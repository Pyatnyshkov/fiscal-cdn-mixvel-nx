import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { initialState } from './initialState'

import { GeneralError, GeneralErrorWithState } from '@models/general/generalError.model'
import { Token } from '@models/token.model'
import {
  SingleData,
  SingleDataSuccess,
} from '@services/API/app/single.api.transformResponseDataXML'
import { TaxationSystems } from '@consts'

type PayloadSuccess = PayloadAction<SingleData>
type PayloadError = PayloadAction<Omit<GeneralError, 'deviceErrorState'>>

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updatedZoneId: (state, { payload }: PayloadAction<number>) => {
      state.instructions.responseDelivery.socketio.client.zoneId = payload.toString()
    },
    setError: (state, { payload }: PayloadError) => {
      state.generalError.code = payload.code
      state.generalError.description = payload.description
    },
    hasError: (state, { payload }: PayloadError) => {
      state.generalError.code = payload.code
      state.generalError.description = payload.description
      state.generalError.deviceErrorState = true
      state.activeServices.webSocket = false
      state.activeServices.subjects = false
      state.deviceRouteStatus.fail = true
      state.deviceRouteStatus.loaded = false
    },
    servicesAvailable: (state) => {
      state.activeServices.webSocket = true
      state.activeServices.subjects = true
    },
    toggleManualCheck: (state) => {
      state.started = !state.started
    },
    openShift: (state) => {
      state.shift.state.opened = true
    },
    closeShift: (state) => {
      state.shift.state.opened = false
    },
    toggleOpenShiftButtonClick: (state, { payload }: PayloadAction<boolean>) => {
      state.ignoreOpenShiftButtonClick = payload
    },
    toggleCloseShiftButtonClick: (state, { payload }: PayloadAction<boolean>) => {
      state.ignoreCloseShiftButtonClick = payload
    },
    starting: (
      state,
      { payload: { token, GUID } }: PayloadAction<{ token: Token; GUID: string }>
    ) => {
      const { taxPayer, document, instructions, attributes } = token
      state.started = true

      state.guid = GUID
      state.attributes.id = attributes.id

      if (taxPayer) {
        state.taxPayer.tin = taxPayer.tin
        state.taxPayer.name = taxPayer.name
      }

      if (document && document.cheque) {
        const { cheque } = document
        const { cashier, pointOfSettlement } = cheque

        if (pointOfSettlement) {
          state.pointOfSettlement.address = pointOfSettlement.address
          state.shift.single.currentRegistration.registrationReport.pointOfSettlement.address =
            pointOfSettlement.address
        }

        if (cashier) {
          state.cashier.tin = cashier.tin
          state.cashier.fullName = cashier.fullName
        }
      }

      if (instructions) {
        state.instructions.deviceRouting = instructions.deviceRouting

        // ???

        if (instructions.responseDelivery) {
          state.instructions.responseDelivery = instructions.responseDelivery
          return
        }

        state.instructions.responseDelivery = {
          socketio: {
            client: {
              guid: GUID,
              zoneId: '',
            },
          },
        }
      }
    },

    errorSingle: (state, { payload }: PayloadAction<GeneralErrorWithState>) => {
      state.generalError.code = ''
      state.generalError.description = ''
      state.generalError.deviceErrorState = false

      state.deviceRouteStatus.requestStarted = false

      const deviceRouteStatus = state.deviceRouteStatus

      state.deviceRouteStatus.reloadDeviceStatusRetries =
        ++deviceRouteStatus.reloadDeviceStatusRetries

      if (
        deviceRouteStatus.reloadDeviceStatusRetries < deviceRouteStatus.reloadDeviceStatusMaxRetries
      ) {
        deviceRouteStatus.loaded = false
        deviceRouteStatus.loadFailed = true
        deviceRouteStatus.nextReloadSeconds = 10
        if (deviceRouteStatus.reloadDeviceStatusTimeout) {
          deviceRouteStatus.reloadDeviceStatusTimeout = 0
        }
        deviceRouteStatus.reloadDeviceStatusTimeout = 1000 // количесво секунд до ретрая;
        deviceRouteStatus.error = payload
      }
    },

    websocketOpenShift: (state) => {},
    websocketCloseShift: (state) => {},

    success: (state, { payload }: PayloadSuccess) => {
      state.generalError.code = ''
      state.generalError.description = ''
      state.generalError.deviceErrorState = false

      state.deviceRouteStatus.requestStarted = false

      state.deviceRouteStatus.nextReloadSeconds = undefined
      state.deviceRouteStatus.loaded = true
      state.deviceRouteStatus.loadFailed = false

      state.shift.single.currentRegistration.registrationReport.taxationSystems.taxationSystem =
        payload.single.currentRegistration.registrationReport.taxationSystems.taxationSystem

      state.shift.single.departments = payload.single.departments || []

      state.deviceRouteStatus.reloadDeviceStatusRetries = 0

      state.shift.single.allowedOperations = payload.single.allowedOperations

      if (payload.single.currentShift) {
        // if (
        //   state.shift.single.printoutCopies  &&
        //   state.shift.single.printoutCopies .issueDocuments &&
        //   state.shift.single.printoutCopies .issueDocuments.cheque
        // ) {
        //   if (state.shift.single.printoutCopies .issueDocuments.cheque[chequeModel.chequeType] != undefined)
        //     $('.state.shift.single.printoutCopies ').show()
        // }
        if (payload.single.currentRegistration) {
          const registrationReport = payload.single.currentRegistration.registrationReport

          if (registrationReport) {
            state.agent = registrationReport.agent
            if (state.shift.state.status === 'closed') {
              if (registrationReport.taxPayer) {
                if (registrationReport.taxPayer.tin)
                  state.shift.single.currentRegistration.registrationReport.taxPayer.tin =
                    registrationReport.taxPayer.tin
                if (registrationReport.taxPayer.name)
                  state.shift.single.currentRegistration.registrationReport.taxPayer.name =
                    registrationReport.taxPayer.name
              }
            }
            if (
              registrationReport &&
              registrationReport.pointOfSettlement &&
              registrationReport.pointOfSettlement.address
            ) {
              const pointOfSettlement = state.pointOfSettlement
              if (!pointOfSettlement.address) {
                state.shift.single.currentRegistration.registrationReport.pointOfSettlement.address =
                  registrationReport.pointOfSettlement.address
                pointOfSettlement.address = registrationReport.pointOfSettlement.address
              }
            }
          }
        }

        state.shift.state.status = 'opened'
        state.shift.state.opened = true
        state.shift.state.closed = false

        const openShiftReport = payload.single.currentShift.openShiftReport

        state.shift.single.shiftNumber = openShiftReport.shift.number
        state.shift.single.fiscalNumber = openShiftReport.fiscalNumber
        state.shift.single.fiscalSignature = openShiftReport.fiscalSignature
        state.shift.single.cashRegister = openShiftReport.cashRegister
      } else {
        state.shift.state.status = 'closed'
        state.shift.state.opened = false
        state.shift.state.closed = true
      }

      state.shift.state.dataLoaded = true

      if (
        state.shift &&
        state.shift.single &&
        state.shift.single.currentRegistration &&
        state.shift.single.currentRegistration.registrationReport
      ) {
        state.taxation.enabledTaxationSystems = {}

        if (
          state.shift &&
          state.shift.single &&
          state.shift.single.currentRegistration &&
          state.shift.single.currentRegistration.registrationReport
        ) {
          const registrationReport = payload.single.currentRegistration.registrationReport
          if (
            registrationReport.taxationSystems &&
            registrationReport.taxationSystems.taxationSystem &&
            registrationReport.taxationSystems.taxationSystem.length
          ) {
            const taxationSystems = registrationReport.taxationSystems.taxationSystem

            console.log(' !!! taxationSystems', taxationSystems)

            taxationSystems.forEach(({ $value }) => {
              //@ts-ignore
              state.taxation.enabledTaxationSystems[$value] = TaxationSystems[$value]
            })
          }
        }
      }
    },
  },
})

export const { openShift, closeShift, toggleManualCheck, hasError } = appSlice.actions
