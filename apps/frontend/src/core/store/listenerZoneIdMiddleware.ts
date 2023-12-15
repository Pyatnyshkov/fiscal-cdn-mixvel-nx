import { createListenerMiddleware } from '@reduxjs/toolkit'

import { wsSlice } from './websocket'
import { appSlice } from './app'

import { AppStartListening } from './types'

export const listenerZoneIdMiddleware = createListenerMiddleware()
export const startListeningZoneId = listenerZoneIdMiddleware.startListening as AppStartListening

startListeningZoneId({
  actionCreator: wsSlice.actions.subscribe,
  effect: ({ payload: zoneId }, api) => {
    api.dispatch(appSlice.actions.updatedZoneId(zoneId))
  },
})
