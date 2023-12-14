import {
  AnyAction,
  Middleware,
  ThunkDispatch,
  TypedAddListener,
  TypedStartListening,
  addListener,
} from '@reduxjs/toolkit'
import { AppDispatch, ExtraArgument, RootState } from '@store'

export type AppStartListening = TypedStartListening<RootState, AppDispatch>
export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>

export type AppMiddleware = Middleware<
  unknown,
  RootState,
  ThunkDispatch<RootState, ExtraArgument, AnyAction>
>
