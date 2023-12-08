import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import socketMiddleware from './socketMiddleware'

import { networkSlice } from './network'

import { appSlice } from './app'
import { subjectsSlice } from './subjects'
import { API } from '@services/API'
import { chequeItemsSlice } from './chequeItems'
import { encashmentSlice } from './encashment'
import { refillSlice } from './refill'
import { documentSlice } from './document'
import { wsSlice } from './websocket'

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    network: networkSlice.reducer,
    subjects: subjectsSlice.reducer,
    chequeItems: chequeItemsSlice.reducer,
    encashment: encashmentSlice.reducer,
    refill: refillSlice.reducer,
    document: documentSlice.reducer,
    websocket: wsSlice.reducer
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
