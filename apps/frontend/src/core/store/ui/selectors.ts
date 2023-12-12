import { RootState } from '..'

export const selectUi = (state: RootState) => state.ui
export const selectUiDocumentIsOpen = (state: RootState) => selectUi(state).documentIsOpen
