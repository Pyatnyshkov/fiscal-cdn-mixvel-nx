import { IWSstate } from '@models/original/websocket'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '..'

const initialState: IWSstate = {
  msg: null,
  guid: '',
  socketIOAddress: '',
  socketIOPath: '',
  state: {
    connected: false,
    connecting: false,
    connectError: false,
    connectionError: false,
    lastConnectionError: null,
    subscribed: false,
    connectCount: 0,
    secondsToNextAttempt: 0,
    lastPing: undefined,
    lastPong: undefined,
    zoneId: undefined,
  },
}

type reconnectType = () => AppThunk

export const reconnect: reconnectType = () => (dispatch, getState) => {
  dispatch(wsSlice.actions.reconnect());
  var interval = setInterval(() => {
    const state = getState().websocket.state;
    if (state.connected) {
      clearInterval(interval);
      return;
    }
    if (state.secondsToNextAttempt <= 0) {
      clearInterval(interval);
      dispatch(wsSlice.actions.connect());
    } else {
      dispatch(wsSlice.actions.countdown());
    }
  }, 1000);
}

export const wsSlice = createSlice({
  name: 'ws',
  initialState: initialState,
  reducers: {
    connect: (state: IWSstate) => {},
    setConnecting: (state: IWSstate) => {
      state.state.connecting = true;
      state.state.connectError = false;
    },
    setConnected: (state: IWSstate, action: PayloadAction<any>) => {
      state.state.connecting = false
      state.state.secondsToNextAttempt = 0
      state.state.connectCount++
      state.state.connected = true
      state.state.connectionError = false
      state.guid = action.payload.guid
      state.socketIOAddress = action.payload.socketIOAddress
      state.socketIOPath = action.payload.socketIOPath
    },
    subscribe: (state: IWSstate, action: PayloadAction<number>) => {
      state.state.subscribed = true
      state.state.zoneId = action.payload
    },
    setDisconnected: (state: IWSstate) => {
      state.state.connected = false;
      state.state.subscribed = false;
      state.state.connecting = false;
      state.state.connectError = true;
      state.state.lastConnectionError = "disconnect";
    },
    setConnectError: (state: IWSstate, action: PayloadAction<Error>) => {
      state.state.connecting = false;
      state.state.connected = false;
      state.state.subscribed = false;
      state.state.connectError = true;
      state.state.lastConnectionError = action.payload;
    },
    setConnectTimeout: (state: IWSstate) => {
      state.state.connecting = false;
      state.state.connected = false;
      state.state.subscribed = false;
      state.state.connectError = true;
      state.state.lastConnectionError = "timeout";
    },
    ping: (state: IWSstate) => {
      state.state.lastPing = new Date();
    },
    pong: (state: IWSstate) => {
      state.state.lastPong = new Date();
    },
    once: (state: IWSstate, action: PayloadAction<any>) => {},
    setMessage: (state: IWSstate, action: PayloadAction<any>) => {
      state.msg = action.payload;
    },
    reconnect: (state: IWSstate, action: PayloadAction<number | undefined>) => {
      state.state.connected = false;
      state.state.secondsToNextAttempt = action.payload || 4;
    },
    countdown: (state: IWSstate) => {
      state.state.secondsToNextAttempt = state.state.secondsToNextAttempt - 1
    }
  },
})

export const websocket = wsSlice.actions
export default wsSlice.reducer
