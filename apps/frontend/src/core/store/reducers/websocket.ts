import { IWSstate } from '@models/original/websocket'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: IWSstate = {
  guid: '',
  socketIOAddress: '',
  socketIOPath: '',
  state: {
    connected: false,
    connecting: false,
    connectionError: false,
    lastConnectionError: null,
    subscribed: false,
    connectCount: 0,
    secondsToNextAttempt: undefined,
    lastPing: undefined,
    lastPong: undefined,
    zoneId: undefined,
  },
}

export const wsSlice = createSlice({
  name: 'ws',
  initialState: initialState,
  reducers: {
    initiate: (state: IWSstate, action: PayloadAction<any>) => {
      state.guid = action.payload.guid
      state.socketIOAddress = action.payload.socketIOAddress
      state.socketIOPath = action.payload.socketIOPath
    },
    setConnected: (state: IWSstate, action: PayloadAction<string>) => {
      state.state.connecting = false
      state.state.secondsToNextAttempt = undefined
      state.state.connectCount++
      state.state.connected = true
      state.state.connectionError = false
    },
    subscribe: (state: IWSstate, action: PayloadAction<number>) => {
      state.state.subscribed = true
      state.state.zoneId = action.payload
    },
  },
})

export const { initiate, setConnected, subscribe } = wsSlice.actions
export const websocket = wsSlice.actions
export default wsSlice.reducer
