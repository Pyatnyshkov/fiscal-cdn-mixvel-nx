import { RootState } from '..'

export const selectEncashment = (state: RootState) => state.encashment
export const selectEncashmentRequest = (state: RootState) => selectEncashment(state).request
