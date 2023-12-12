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
    pointOfSettlementAdsress: app.pointOfSettlement.address,
  }

  dispatch(documentChequeSlice.actions.extracted(extractData))
}

export const updateDocumentCheque =
  (value: string, name: string): AppThunk =>
  (dispatch, getState) => {
    const documentChequeValues = selectDocumentChequeValues(getState())
    const copyDocumentChequeValues = { ...documentChequeValues }

    const isDocumentCheque = (data: any): data is DocumentCheque => {
      const datax = data as DocumentCheque
      return datax.cashAmount ? true : false
    }

    if (isDocumentCheque(copyDocumentChequeValues)) {
      copyDocumentChequeValues[name] = value
      console.log('fdfd')
      dispatch(documentChequeSlice.actions.updated(copyDocumentChequeValues))
    }

    console.log('first', value, name)

    if (name === 'electronicAmount' || name === 'cashAmount' || name === 'considerationAmount') {
      console.log('!!!!!!')
      dispatch(calcAmounts)
    }

    // dispatch(documentChequeSlice.actions.updated(calcTotalAmount))
  }

export const calcAmounts: AppThunk = (dispatch, getState) => {
  const { documentCheque } = getState()
  const electronicAmount = parseFloat(documentCheque.electronicAmount)
  const considerationAmount = parseFloat(documentCheque.considerationAmount)
  const cashAmount = parseFloat(documentCheque.cashAmount)
  const calcTotalAmount = (electronicAmount + considerationAmount + cashAmount).toString()

  dispatch(documentChequeSlice.actions.updatedTotalAmount(calcTotalAmount))
}

export const calcElectronicAmount: AppThunk = (dispatch, getState) => {
  const subjectsAmount = selectDocumentSubjectsAmount(getState())

  dispatch(documentChequeSlice.actions.updatedElectronicAmount(subjectsAmount.toString()))
  dispatch(calcAmounts)
}
