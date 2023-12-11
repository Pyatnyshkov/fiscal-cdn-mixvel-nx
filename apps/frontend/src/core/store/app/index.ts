import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { initialState } from './initialState'

import { GeneralError, GeneralErrorWithState } from '@models/general/generalError.model'
import { Token } from '@models/token.model'
import { SingleDataSuccess } from '@services/API/app/single.api.transformResponseDataXML'

type PayloadSuccess = PayloadAction<SingleDataSuccess>
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
      // error nulled
      state.generalError.code = ''
      state.generalError.description = ''
      state.generalError.deviceErrorState = false

      state.deviceRouteStatus.requestStarted = false

      state.deviceRouteStatus.nextReloadSeconds = undefined
      state.deviceRouteStatus.loaded = true
      state.deviceRouteStatus.loadFailed = false

      const resp = { single: payload }
      const applicationModel = state
      const deviceRouteStatusModel = state.deviceRouteStatus
      const shift = state.shift

      state.shift.single = Object.assign(state.shift.single, payload)

      state.shift.single.departments = resp.single.departments || []

      const printoutCopies = (state.shift.single.printoutCopies = resp.single.printoutCopies)

      deviceRouteStatusModel.reloadDeviceStatusRetries = 0

      state.shift.single.allowedOperations = resp.single.allowedOperations

      if (payload.currentShift) {
        if (
          printoutCopies &&
          printoutCopies.issueDocuments &&
          printoutCopies.issueDocuments.cheque
        ) {
          // if (printoutCopies.issueDocuments.cheque[chequeModel.chequeType] != undefined)
          //   $('.printoutCopies').show()
        }
        if (payload.currentRegistration) {
          const registrationReport = payload.currentRegistration.registrationReport

          if (registrationReport) {
            applicationModel.agent = registrationReport.agent
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

        shift.state.status = 'opened'
        shift.state.opened = true
        shift.state.closed = false

        const openShiftReport = payload.currentShift.openShiftReport

        state.shift.single.shiftNumber = openShiftReport.shift.number
        state.shift.single.fiscalNumber = openShiftReport.fiscalNumber
        state.shift.single.fiscalSignature = openShiftReport.fiscalSignature
        state.shift.single.cashRegister = openShiftReport.cashRegister
      } else {
        shift.state.status = 'closed'
        shift.state.opened = false
        shift.state.closed = true
      }

      state.shift.state.dataLoaded = true

      // calculateTaxationSystems

      if (
        shift &&
        shift.single &&
        shift.single.currentRegistration &&
        shift.single.currentRegistration.registrationReport
      ) {
        const registrationReport = shift.single.currentRegistration.registrationReport
        if (
          registrationReport.taxationSystems &&
          registrationReport.taxationSystems.taxationSystem &&
          registrationReport.taxationSystems.taxationSystem.length
        ) {
          // const taxationSystems = registrationReport.taxationSystems.taxationSystem
          // taxationSystems.forEach(({ $value }) => {
          //   // state.taxation.enabledTaxationSystems[$value] = TaxationSystems[$value]
          // })
        }
      }

      // documentChanged()
      // if (!applicationModel.started) deviceRouteProviderSuccess()
      // if (callback) return callback(null)
    },
  },
})

export const { openShift, closeShift, toggleManualCheck, hasError } = appSlice.actions
