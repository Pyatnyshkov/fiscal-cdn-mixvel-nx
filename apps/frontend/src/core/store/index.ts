import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { appSlice } from './app'
import { appSubjectsSlice } from './appSubjects'
import { networkSlice } from './network'
import { encashmentSlice } from './encashment'
import { refillSlice } from './refill'
import { documentSlice } from './document'
import { documentSubjectsSlice } from './documentSubjects'
import { subjectsSlice } from './subjects'
import { wsSlice } from './websocket'

import { API } from '@services/API'
import socketMiddleware from './socketMiddleware'
import { editorSubjectsSlice } from './editorSubjects'
import { listenerZoneIdMiddleware } from './listenerZoneIdMiddleware'
import { listenerUpdateMiddleware } from './listenerUpdateMiddleware'
import { documentChequeSlice } from './documentCheque'
import { uiSlice } from './ui'

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    app: appSlice.reducer,
    editorSubjects: editorSubjectsSlice.reducer,
    network: networkSlice.reducer,
    appSubjects: appSubjectsSlice.reducer,
    encashment: encashmentSlice.reducer,
    refill: refillSlice.reducer,
    document: documentSlice.reducer,
    documentSubjects: documentSubjectsSlice.reducer,
    documentCheque: documentChequeSlice.reducer,
    subjects: subjectsSlice.reducer,
    websocket: wsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { API },
      },
    }).concat(
      socketMiddleware,
      listenerZoneIdMiddleware.middleware,
      listenerUpdateMiddleware.middleware
    ),
})

type ExtraArgument = { API: API }

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, ExtraArgument, Action>

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
