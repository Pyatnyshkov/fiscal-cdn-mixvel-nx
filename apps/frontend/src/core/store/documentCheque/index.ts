import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AppThunk } from '@store'

export interface DocumentCheque {
  chequeType: 'credit' | 'debit' | 'creditReturn' | 'debitReturn'
  taxPayerName: string
  taxPayerTin: string
  cashierName: string
  cashierTin: string
  pointOfSettlementAdsress: string
  taxationSystem: string
  customerPhone: string
  customerEmail: string
  documentReferenceNumber: string
  electronicAmount: string
  cashAmount: string
  considerationAmount: string
  electronicMaskedCardPAN: string
  copies: string
  totalAmount: string
  [key: string]: string | Record<number, string>[]
}

const initialState: DocumentCheque = {
  chequeType: 'credit',
  taxPayerName: '',
  taxPayerTin: '',
  cashierName: '',
  cashierTin: '',
  pointOfSettlementAdsress: '',
  taxationSystem: '2',
  customerPhone: '',
  customerEmail: '',
  documentReferenceNumber: '',
  electronicAmount: '0',
  cashAmount: '0',
  considerationAmount: '0',
  electronicMaskedCardPAN: '',
  copies: '2',
  totalAmount: '',
}

export type ExtractDocumentChequeData = {
  taxPayerName: string
  taxPayerTin: string
  cashierName: string
  cashierTin: string
  pointOfSettlementAdsress: string
}

type PayloadUpdate = PayloadAction<{ [key in keyof DocumentCheque]: DocumentCheque[key] }>
type PayloadExtract = PayloadAction<ExtractDocumentChequeData>

export const documentChequeUpdate =
  (name: string): AppThunk =>
  async (dispatch, getState) => {
    const { app } = getState()
  }

export const documentChequeSlice = createSlice({
  name: 'documentCheque',
  initialState,
  reducers: {
    extracted: (state, { payload }: PayloadExtract) => {
      state.taxPayerName = payload.taxPayerName
      state.taxPayerTin = payload.taxPayerTin
      state.cashierName = payload.cashierName
      state.cashierTin = payload.cashierTin
      state.pointOfSettlementAdsress = payload.pointOfSettlementAdsress
    },
    updated: (state, { payload }: PayloadUpdate) => {
      Object.entries(payload).forEach(([key, value]) => {
        state[key] = value
      })
    },
    updatedElectronicAmount: (state, { payload }: PayloadAction<string>) => {
      state.electronicAmount = payload
    },
    updatedTotalAmount: (state, { payload }: PayloadAction<string>) => {
      state.formsTotalAmount = payload
    },
    updatedTotalTaxaAmount: (state, { payload }: PayloadAction<[]>) => {
      state.formsTotalTaxaAmount = payload
    },
  },
})
