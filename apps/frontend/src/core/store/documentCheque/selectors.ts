import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '..'

export const selectDocumentCheque = (state: RootState) => state.documentCheque
export const selectDocumentPointOfSettlementAddress = (state: RootState) =>
  selectDocumentCheque(state).pointOfSettlementAdsress

export const selectDocumentChequeTaxPayerName = (state: RootState) =>
  selectDocumentCheque(state).taxPayerName
export const selectDocumentChequeTaxPayerTin = (state: RootState) =>
  selectDocumentCheque(state).taxPayerTin

export const selectDocumentChequeCashierName = (state: RootState) =>
  selectDocumentCheque(state).cashierName
export const selectDocumentChequeCashierTin = (state: RootState) =>
  selectDocumentCheque(state).cashierTin

export const selectDocumentChequeChequeType = (state: RootState) =>
  selectDocumentCheque(state).chequeType
export const selectDocumentChequeTaxationSystem = (state: RootState) =>
  selectDocumentCheque(state).taxationSystem
export const selectDocumentChequeReferenceNumber = (state: RootState) =>
  selectDocumentCheque(state).documentReferenceNumber
export const selectDocumentChequeCustomerPhone = (state: RootState) =>
  selectDocumentCheque(state).customerPhone
export const selectDocumentChequeCustomerEmail = (state: RootState) =>
  selectDocumentCheque(state).customerEmail
export const selectDocumentChequeElectronicAmount = (state: RootState) =>
  selectDocumentCheque(state).electronicAmount
export const selectDocumentChequeCashAmount = (state: RootState) =>
  selectDocumentCheque(state).cashAmount
export const selectDocumentChequeConsiderationAmount = (state: RootState) =>
  selectDocumentCheque(state).considerationAmount
export const selectDocumentChequeElectronicMaskedCardPAN = (state: RootState) =>
  selectDocumentCheque(state).electronicMaskedCardPAN
export const selectDocumentChequeCopies = (state: RootState) => selectDocumentCheque(state).copies

export const selectDocumentChequeValues = createSelector(
  [
    selectDocumentChequeTaxPayerName,
    selectDocumentChequeTaxPayerTin,
    selectDocumentChequeCashierName,
    selectDocumentChequeCashierTin,
    selectDocumentChequeChequeType,
    selectDocumentChequeTaxationSystem,
    selectDocumentChequeReferenceNumber,
    selectDocumentChequeCustomerPhone,
    selectDocumentChequeCustomerEmail,
    selectDocumentPointOfSettlementAddress,
    selectDocumentChequeElectronicAmount,
    selectDocumentChequeCashAmount,
    selectDocumentChequeConsiderationAmount,
    selectDocumentChequeElectronicMaskedCardPAN,
    selectDocumentChequeCopies,
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
    pointOfSettlementAddress,
    electronicAmount,
    cashAmount,
    considerationAmount,
    electronicMaskedCardPAN,
    copies
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
    electronicAmount,
    cashAmount,
    considerationAmount,
    electronicMaskedCardPAN,
    copies,
  })
)

export const selectDocumentChequeTotal = createSelector(
  [
    selectDocumentChequeElectronicAmount,
    selectDocumentChequeCashAmount,
    selectDocumentChequeConsiderationAmount,
    selectDocumentChequeElectronicMaskedCardPAN,
    selectDocumentChequeCopies,
  ],
  (electronicAmount, cashAmount, considerationAmount, electronicMaskedCardPAN, copies) => ({
    electronicAmount,
    cashAmount,
    considerationAmount,
    electronicMaskedCardPAN,
    copies,
  })
)

export const selectDocumentChequeTotalAmount = (state: RootState) =>
  selectDocumentCheque(state).totalAmount
