import { RootState } from '..'

export const selectDocument = (state: RootState) => state.document

export const selectSendButtonVisible = (state: RootState) => selectDocument(state).sendButtonVisible
