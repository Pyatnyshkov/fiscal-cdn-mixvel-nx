import { RootState } from '..'

export const selectApp = (state: RootState) => state.websocket
export const selectWsState = (state: RootState) => selectApp(state).state