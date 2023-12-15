import { AppThunk } from '@store'
import { DocumentCheque, ExtractDocumentChequeData, documentChequeSlice } from '.'
import { selectDocumentSubjectsAmount } from '@store/documentSubjects/selectors'
import { selectDocumentChequeValues } from './selectors'

export const extractDocumentChequeData: AppThunk = async (dispatch, getState) => {
  const { app } = getState()

  const extractData: ExtractDocumentChequeData = {
    taxPayerName: app.taxPayer.name,
    taxPayerTin: app.taxPayer.tin,
    cashierName: app.cashier.fullName,
    cashierTin: app.cashier.tin,
    pointOfSettlementAddress: app.pointOfSettlement.address,
  }

  dispatch(documentChequeSlice.actions.extracted(extractData))
}

export const updateDocumentCheque =
  (value: string, fieldName: string): AppThunk =>
  (dispatch) => {
    const name = fieldName as keyof DocumentCheque

    dispatch(documentChequeSlice.actions.updated({ key: name, value: value }))

    if (name === 'electronicAmount' || name === 'cashAmount' || name === 'considerationAmount') {
      dispatch(calcAmounts)
    }
  }

export const calcAmounts: AppThunk = (dispatch, getState) => {
  const { documentCheque } = getState()
  const electronicAmount = parseFloat(documentCheque.electronicAmount)
  const considerationAmount = parseFloat(documentCheque.considerationAmount)
  const cashAmount = parseFloat(documentCheque.cashAmount)
  const calcTotalAmount = (electronicAmount + considerationAmount + cashAmount).toString()

  dispatch(documentChequeSlice.actions.updatedTotalAmount(calcTotalAmount))
}

export const updateElectronicAmount: AppThunk = (dispatch, getState) => {
  const subjectsAmount = selectDocumentSubjectsAmount(getState())

  dispatch(documentChequeSlice.actions.updatedElectronicAmount(subjectsAmount.toString()))
  dispatch(calcAmounts)
}
