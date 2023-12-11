import { createListenerMiddleware } from '@reduxjs/toolkit'

import { wsSlice } from './websocket'
import { appSlice } from './app'

export const listenerZoneIdMiddleware = createListenerMiddleware()

listenerZoneIdMiddleware.startListening({
  actionCreator: wsSlice.actions.subscribe,
  effect: ({ payload: zoneId }, api) => {
    api.dispatch(appSlice.actions.updatedZoneId(zoneId))
    console.log('zoneId ', zoneId)
  },
})
