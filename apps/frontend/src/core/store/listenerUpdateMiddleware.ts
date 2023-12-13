import { createListenerMiddleware } from '@reduxjs/toolkit'

import { wsSlice } from './websocket'
import { fetchAppSubjects } from './app/thunks'

export const listenerUpdateMiddleware = createListenerMiddleware()

listenerUpdateMiddleware.startListening({
  actionCreator: wsSlice.actions.update,
  effect: (payload, api) => {
    console.log('payload', payload)
    console.log('api', api)
    api.dispatch(fetchAppSubjects)
  },
})
