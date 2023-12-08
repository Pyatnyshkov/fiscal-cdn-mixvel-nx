import { RootState } from '..'

export const selectRefill = (state: RootState) => state.refill
export const selectRefillRequest = (state: RootState) => selectRefill(state).request
