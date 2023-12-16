import { RootState } from '..'

export const selectDocument = (state: RootState) => state.document

export const selectSendButtonVisible = (state: RootState) => selectDocument(state).sendButtonVisible
export const selectIssueResult = (state: RootState) => selectDocument(state).issueResult
export const selectHideOnShiftOperation = (state: RootState) => selectDocument(state).hideOnShiftOperation
