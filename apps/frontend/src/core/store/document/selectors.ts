import { RootState } from '..'

export const selectDocument = (state: RootState) => state.document
export const selectDocumentTaxPayer = (state: RootState) => selectDocument(state).taxPayer.name
export const selectDocumentCashier = (state: RootState) => selectDocument(state).cashier.fullName
export const selectDocumentPointOfSettlementAddress = (state: RootState) =>
  selectDocument(state).pointOfSettlement.address
