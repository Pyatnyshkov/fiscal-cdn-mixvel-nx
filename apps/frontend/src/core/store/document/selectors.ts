import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '..'

export const selectDocument = (state: RootState) => state.document
export const selectDocumentPointOfSettlementAddress = (state: RootState) =>
  selectDocument(state).pointOfSettlement.address

// ChequeTotal

export const selectDocumentTaxPayerName = (state: RootState) => selectDocument(state).taxPayer.name
export const selectDocumentTaxPayerTin = (state: RootState) => selectDocument(state).taxPayer.tin

export const selectDocumentCashierName = (state: RootState) =>
  selectDocument(state).cashier.fullName
export const selectDocumentCashierTin = (state: RootState) => selectDocument(state).cashier.tin

export const selectDocumentChequeType = (state: RootState) => selectDocument(state).chequeType
export const selectDocumentTaxationSystem = (state: RootState) =>
  selectDocument(state).taxationSystem.$value
export const selectDocumentReferenceNumber = (state: RootState) =>
  selectDocument(state).printoutInjections.documentReferenceNumber
export const selectDocumentCustomerPhone = (state: RootState) =>
  selectDocument(state).customer.phone
export const selectDocumentCustomerEmail = (state: RootState) =>
  selectDocument(state).customer.email

export const selectDocumentCheque = createSelector(
  [
    selectDocumentTaxPayerName,
    selectDocumentTaxPayerTin,
    selectDocumentCashierName,
    selectDocumentCashierTin,
    selectDocumentChequeType,
    selectDocumentTaxationSystem,
    selectDocumentReferenceNumber,
    selectDocumentCustomerPhone,
    selectDocumentCustomerEmail,
    selectDocumentPointOfSettlementAddress,
  ],
  (
    taxPayerName,
    taxPayerTin,
    cashierName,
    cashierTin,
    chequeType,
    taxationSystem,
    referenceNumber,
    customerPhone,
    customerEmail,
    pointOfSettlementAddress
  ) => ({
    taxPayerName,
    taxPayerTin,
    cashierName,
    cashierTin,
    chequeType,
    taxationSystem,
    referenceNumber,
    customerPhone,
    customerEmail,
    pointOfSettlementAddress,
  })
)

// ChequeTotal

export const selectDocumentElectronicAmount = (state: RootState) =>
  selectDocument(state).electronicAmount
export const selectDocumentCashAmount = (state: RootState) => selectDocument(state).cashAmount
export const selectDocumentConsiderationAmount = (state: RootState) =>
  selectDocument(state).considerationAmount
export const selectDocumentElectronicMaskedCardPAN = (state: RootState) =>
  selectDocument(state).electronicMaskedCardPAN
export const selectDocumentCopies = (state: RootState) => selectDocument(state).copies

export const selectDocumentChequeTotal = createSelector(
  [
    selectDocumentElectronicAmount,
    selectDocumentCashAmount,
    selectDocumentConsiderationAmount,
    selectDocumentElectronicMaskedCardPAN,
    selectDocumentCopies,
  ],
  (electronicAmount, cashAmount, considerationAmount, electronicMaskedCardPAN, copies) => ({
    electronicAmount,
    cashAmount,
    considerationAmount,
    electronicMaskedCardPAN,
    copies,
  })
)

export const selectSendButtonVisible = (state: RootState) => selectDocument(state).sendButtonVisible
