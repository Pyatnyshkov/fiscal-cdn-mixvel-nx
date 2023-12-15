import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AppThunk } from '..'
import { selectSoapEndpoint } from './selectors'

interface InitialState {
  soapEndpoint: string
  deviceStatusSOAPEndpoint: string
  operationsSOAPEndpoint: string
  subjectsSOAPEndpoint: string
  subjectsWebEndpoint: string
  socketIOAddress: string
  socketIOPath: string
  socketIONamespace: string
  development: boolean
}

const initialState: InitialState = {
  soapEndpoint: '',
  deviceStatusSOAPEndpoint: process.env.NX_DEVICE_STATUS_SOAP_ENDPOINT || '',
  operationsSOAPEndpoint: '',
  subjectsSOAPEndpoint: '',
  subjectsWebEndpoint: '',
  socketIOAddress: '',
  socketIOPath: '',
  socketIONamespace: '',
  development: true,
}

type PayloadSuccess = PayloadAction<Omit<InitialState, 'deviceStatusSOAPEndpoint' | 'development'>>

type SetDataNetwork = (
  data: Omit<InitialState, 'deviceStatusSOAPEndpoint' | 'development'>
) => AppThunk

export const setDataToNetwork: SetDataNetwork = (data) => (dispatch, getState) => {
  const soapEndpoint = selectSoapEndpoint(getState())

  if (!soapEndpoint) {
    dispatch(networkSlice.actions.success(data))
  }
}

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    success: (state, { payload }: PayloadSuccess) => {
      const getUrl = (url: string) => {
        return !state.development
          ? url
          : url.replace('https://taxserver.sirena-travel.ru', 'http://localhost:8080')
      }

      state.soapEndpoint = getUrl(payload.soapEndpoint) || ''
      state.operationsSOAPEndpoint = getUrl(payload.operationsSOAPEndpoint) || ''
      state.subjectsSOAPEndpoint = getUrl(payload.subjectsSOAPEndpoint) || ''
      state.subjectsWebEndpoint = getUrl(payload.subjectsWebEndpoint) || ''
      state.socketIOPath = payload.socketIOPath || ''
      state.socketIOAddress = getUrl(payload.socketIOAddress) || ''
      state.socketIONamespace = payload.socketIONamespace || ''
    },
  },
})

export const network = networkSlice.actions
