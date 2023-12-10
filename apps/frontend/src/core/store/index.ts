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

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    editorSubjects: editorSubjectsSlice.reducer,
    network: networkSlice.reducer,
    appSubjects: appSubjectsSlice.reducer,
    encashment: encashmentSlice.reducer,
    refill: refillSlice.reducer,
    document: documentSlice.reducer,
    documentSubjects: documentSubjectsSlice.reducer,
    subjects: subjectsSlice.reducer,
    websocket: wsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { API },
      },
    }).concat(socketMiddleware),
})

type ExtraArgument = { API: API }

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, ExtraArgument, Action>

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
