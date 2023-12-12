import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '..'

export const selectApp = (state: RootState) => state.app
export const selectShift = (state: RootState) => selectApp(state).shift
export const selectSingle = (state: RootState) => selectShift(state).single

export const selectAppStarted = (state: RootState) => selectApp(state).started
export const selectShiftOpened = (state: RootState) => selectApp(state).shift.state.opened
export const selectIgnoreOpenShiftButtonClick = (state: RootState) =>
  selectApp(state).ignoreOpenShiftButtonClick
export const selectIgnoreCloseShiftButtonClick = (state: RootState) =>
  selectApp(state).ignoreCloseShiftButtonClick
export const selectIsManualCheckOpen = (state: RootState) => selectApp(state).started
export const selectShiftCashier = (state: RootState) => selectApp(state).cashier
export const selectAppPointOfSettlementAddress = (state: RootState) =>
  selectApp(state).pointOfSettlement.address

// Errors
export const selectErrorMessage = (state: RootState) => {
  return selectApp(state).generalError && selectApp(state).generalError.description
}

export const selectAppError = (state: RootState) => {
  return selectApp(state).generalError && selectApp(state).generalError
}

export const selectAppEnabledTaxationSystems = (state: RootState) =>
  selectApp(state).taxation.enabledTaxationSystems

export const selectAppTaxationSystem = (state: RootState) =>
  selectSingle(state).currentRegistration.registrationReport.taxationSystems.taxationSystem

// forms

export const selectShiftNumber = (state: RootState) => selectSingle(state).shiftNumber
export const selectRegistrationNumber = (state: RootState) =>
  selectSingle(state).cashRegister.authority.registrationNumber
export const selectFactoryNumber = (state: RootState) =>
  selectSingle(state).cashRegister.factoryNumber
export const selectFiscalStorageFactoryNumber = (state: RootState) =>
  selectSingle(state).cashRegister.fiscalStorage.factoryNumber

export const selectDocumentView = createSelector(
  [
    selectShiftNumber,
    selectRegistrationNumber,
    selectFactoryNumber,
    selectFiscalStorageFactoryNumber,
  ],
  (shiftNumber, registrationNumber, factoryNumber, fiscalStorageFactoryNumber) => ({
    shiftNumber,
    registrationNumber,
    factoryNumber,
    fiscalStorageFactoryNumber,
  })
)
