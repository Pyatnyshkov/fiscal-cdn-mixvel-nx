import { AnyAction, ThunkAction, combineReducers, configureStore } from '@reduxjs/toolkit'
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
import { documentChequeSlice } from './documentCheque'
import { uiSlice } from './ui'

const rootReducer = combineReducers({
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
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { API },
      },
    }).concat(
      socketMiddleware,
      listenerZoneIdMiddleware.middleware
    ),
})

export type ExtraArgument = { API: API }

const dispatch = store.dispatch

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  ExtraArgument,
  AnyAction
>

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
