import { AxiosError } from 'axios'
import { ShiftError } from '@error'
import { appSubjectsSlice } from '@store/appSubjects'
import { AppThunk } from '@store'
import { selectAppStarted } from './selectors'
import { extractToken } from '@utils/extractToken'
import { createGUID } from '@utils/createGUID'
import { appSlice, hasError } from '.'
import { isSingleDataSuccess } from '@services/API/app/single.api.transformResponseDataXML'
import { setDataToNetwork } from '@store/network'
import { ExtractDocumentChequeData, documentChequeSlice } from '@store/documentCheque'
import { extractDocumentChequeData } from '@store/documentCheque/thunks'
import { DocumentOpenShift } from '@models/general/documentOpenShift.model'
import { DocumentCloseShift } from '@models/general/documentCloseShift.model'
import moment from 'moment'
import { GlobalError } from 'core/errors/globalError'
import { uiSlice } from '@store/ui'

export const initApp: AppThunk = async (dispatch, getState) => {
  const started = selectAppStarted(getState())

  if (started) {
    return
  }

  try {
    const token = extractToken()
    const GUID = createGUID()

    if (token) {
      dispatch(appSlice.actions.starting({ token, GUID }))
    }
    dispatch(fetchAppData)
  } catch (error) {
    if (error instanceof GlobalError) {
      dispatch(uiSlice.actions.globalError({ type: error.type, reason: error.reason }))
    }
    if (error instanceof Error) {
      dispatch(hasError({ code: '', description: error.message }))
    }
  }
}

export const fetchAppSubjects: AppThunk = async (dispatch, getState, { API }) => {
  const { app, network } = getState()
  const subjectData = await API.subjects.post(
    network.subjectsSOAPEndpoint,
    app.instructions.deviceRouting
  )

  if (subjectData) {
    dispatch(appSubjectsSlice.actions.success(subjectData))
  }
}
export const fetchAppData: AppThunk = async (dispatch, getState, { API }) => {
  const { network, app } = getState()

  if (!app.instructions.deviceRouting) {
    return
  }

  try {
    const singleData = await API.single.post(
      network.deviceStatusSOAPEndpoint,
      app.instructions.deviceRouting
    )

    if (!singleData) {
      return
    }

    if (isSingleDataSuccess(singleData)) {
      dispatch(appSlice.actions.success(singleData))
    }

    const { availableServices } = singleData.single
    const networkData = {
      soapEndpoint: availableServices.issueDocuments.soap.service.url,
      operationsSOAPEndpoint: availableServices.operations.soap.service.url,
      subjectsSOAPEndpoint: availableServices.subjectsEditor.soap.service.url,
      subjectsWebEndpoint: availableServices.subjectsEditor.web.site.url,
      socketIOAddress: availableServices.responseDeliveryGateway.socketio.service.url,
      socketIOPath: availableServices.responseDeliveryGateway.socketio.service.path,
      socketIONamespace: availableServices.responseDeliveryGateway.socketio.service.namespace,
    }
    dispatch(setDataToNetwork(networkData))

    dispatch(extractDocumentChequeData)
    dispatch(fetchAppSubjects)
    dispatch(appSlice.actions.servicesAvailable())
  } catch (error) {
    if (error instanceof ShiftError) {
      dispatch(hasError(error.reason))
    }
    if (error instanceof AxiosError) {
      console.error(error)
    }
    if (error instanceof Error) {
      console.error(error)
    }
  }
}

export const openShiftAction: AppThunk = async (dispatch, getState, { API }) => {
  const { app, network } = getState()
  const openShiftData: DocumentOpenShift = {
    attributes: {
      id: moment().format('YYYYMMDDHHmmssSSS'),
    },
    taxPayer: app.taxPayer,
    instructions: app.instructions,
    document: {
      openShiftReport: {
        cashier: app.cashier,
      },
    },
  }
  dispatch(appSlice.actions.toggleOpenShiftButtonClick(true))
  dispatch(appSlice.actions.websocketOpenShift())

  try {
    const data = await API.document.openShift.post(network.soapEndpoint, openShiftData)
  } catch (error) {
    if (error instanceof ShiftError) {
      dispatch(hasError(error.reason))
    }
    if (error instanceof AxiosError) {
      console.error(error)
    }
    if (error instanceof Error) {
      console.error(error)
    }
  }
}

export const closeShiftAction: AppThunk = async (dispatch, getState, { API }) => {
  const { app, network } = getState()
  const closeShiftData: DocumentCloseShift = {
    attributes: {
      id: moment().format('YYYYMMDDHHmmssSSS'),
    },
    taxPayer: app.taxPayer,
    instructions: app.instructions,
    document: {
      closeShiftReport: {
        cashier: app.cashier,
      },
    },
  }
  dispatch(appSlice.actions.toggleCloseShiftButtonClick(true))
  dispatch(appSlice.actions.websocketCloseShift())
  try {
    const data = await API.document.closeShift.post(network.soapEndpoint, closeShiftData)
  } catch (error) {
    if (error instanceof ShiftError) {
      dispatch(hasError(error.reason))
    }
    if (error instanceof AxiosError) {
      console.error(error)
    }
    if (error instanceof Error) {
      console.error(error)
    }
  }
}
