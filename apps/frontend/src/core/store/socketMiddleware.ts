import { io, Socket } from 'socket.io-client'
import { websocket } from './websocket'
import { network } from './network'
import { documentSlice } from './document'
import { appSlice } from './app'
import { fetchAppSubjects, fetchAppData } from './app/thunks'

import { AppMiddleware } from './types'

interface IOoptions {
  timeout: number
  path?: string
}

const socketMiddleware: AppMiddleware = ({ dispatch, getState }) => {
  let socket: Socket

  return (next) => (action) => {
    if (network.success.match(action) || websocket.connect.match(action)) {
      const getUrl = (url: string) => {
        return process.env.NODE_ENV === 'production'
          ? url
          : url.replace('https://taxserver.sirena-travel.ru', 'http://localhost:8080')
      }
      const socketIOAddress = action.payload
        ? getUrl(action.payload.socketIOAddress)
        : getState().websocket.socketIOAddress
      const socketIOPath = action.payload
        ? action.payload.socketIOPath
        : getState().websocket.socketIOPath
      const options: IOoptions = {
        timeout: 1000,
      }
      if (socketIOPath) options.path = socketIOPath
      if (!socket) {
        socket = io(socketIOAddress, options)
        const guid = getState().app.guid
        socket.on('connect', () =>
          dispatch(
            websocket.setConnected({
              guid,
              socketIOAddress,
              socketIOPath,
            })
          )
        )
        socket.on('disconnect', () => {
          dispatch(websocket.setDisconnected())
          dispatch(websocket.reconnect())
        })
        socket.on('connect_error', () => dispatch(websocket.setConnectError()))
        socket.on('connect_timeout', () => dispatch(websocket.setConnectTimeout()))
        socket.on('ping', () => dispatch(websocket.ping()))
        socket.on('pong', () => dispatch(websocket.pong()))
      }
      dispatch(websocket.setConnecting())
      socket.connect()
    }

    if (websocket.setConnected.match(action)) {
      socket.emit('subscribe', { guid: action.payload.guid }, (zoneId: number) => {
        dispatch(websocket.subscribe(zoneId))
      })
    }

    if (documentSlice.actions.fetchDocumentCheque.match(action)) {
      socket.once('issueResult', (msg: any) => {
        dispatch(documentSlice.actions.sendButtonVisible(true))
        dispatch(documentSlice.actions.successCloseChequeApp(msg))
        if (msg.error && msg.error.error) {
          dispatch(
            appSlice.actions.setError({
              code: msg.error.error.code,
              description: msg.error.error.description,
            })
          )
        }
        dispatch<any>(fetchAppSubjects);
      })
    }

    if (documentSlice.actions.fetchIssueDocumentCurrentSettlementReport.match(action)) {
      socket.once('issueResult', (msg: any) => {
        if (msg.error) {
          dispatch(
            appSlice.actions.setError({
              code: msg.error.code,
              description: msg.error.description,
            })
          )
        }
        dispatch<any>(fetchAppSubjects);
      })
    }

    if (appSlice.actions.websocketOpenShift.match(action)) {
      socket.once('issueResult', (msg: any) => {
        dispatch(appSlice.actions.toggleOpenShiftButtonClick(false))
        dispatch(documentSlice.actions.sendButtonVisible(true))
        const err = msg.error
        if (err) {
          dispatch(
            appSlice.actions.setError({
              code: err.code,
              description: err.description,
            })
          )
        }
        dispatch<any>(fetchAppData)
        dispatch(appSlice.actions.openShift())
      })
    }

    if (appSlice.actions.websocketCloseShift.match(action)) {
      socket.once('issueResult', (msg: any) => {
        dispatch(appSlice.actions.toggleCloseShiftButtonClick(false))
        dispatch(documentSlice.actions.sendButtonVisible(true))
        const err = msg.error
        if (err) {
          dispatch(
            appSlice.actions.setError({
              code: err.code,
              description: err.description,
            })
          )
        }
        dispatch<any>(fetchAppData)
        dispatch(appSlice.actions.closeShift())
      })
    }

    next(action)
  }
}

export default socketMiddleware
