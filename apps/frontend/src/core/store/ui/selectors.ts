import { RootState } from '..'

export const selectUi = (state: RootState) => state.ui
export const selectUiDocumentIsOpen = (state: RootState) => selectUi(state).documentIsOpen
export const selectUiGlobalError = (state: RootState) => selectUi(state).globalError
export const selectUiHasGlobalError = (state: RootState) => selectUiGlobalError(state).type
export const selectUiErrorMessage = (state: RootState) => selectUi(state).error.message
