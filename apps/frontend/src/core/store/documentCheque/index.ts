import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AppThunk } from '@store'

export interface DocumentCheque {
  chequeType: 'credit' | 'debit' | 'creditReturn' | 'debitReturn'
  taxPayerName: string
  taxPayerTin: string
  cashierName: string
  cashierTin: string
  pointOfSettlementAddress: string
  taxationSystem: string
  customerPhone: string
  customerEmail: string
  referenceNumber: string
  electronicAmount: string
  cashAmount: string
  considerationAmount: string
  electronicMaskedCardPAN: string
  copies: string
  totalAmount: string
}

const initialState: DocumentCheque = {
  chequeType: 'credit',
  taxPayerName: '',
  taxPayerTin: '',
  cashierName: '',
  cashierTin: '',
  pointOfSettlementAddress: '',
  taxationSystem: '0',
  customerPhone: '',
  customerEmail: '',
  referenceNumber: '',
  electronicAmount: '0',
  cashAmount: '0',
  considerationAmount: '0',
  electronicMaskedCardPAN: '',
  copies: '2',
  totalAmount: '0',
}

export type ExtractDocumentChequeData = {
  taxPayerName: string
  taxPayerTin: string
  cashierName: string
  cashierTin: string
  pointOfSettlementAddress: string
}

type PayloadUpdate = PayloadAction<{
  key: string
  value: string
}>
type PayloadExtract = PayloadAction<ExtractDocumentChequeData>

export const documentChequeUpdate =
  (name: string): AppThunk =>
  async (dispatch, getState) => {
    const { app } = getState()
  }

// type isChequeType<V extends keyof DocumentCheque> = V extends DocumentCheque['chequeType']
//   ? DocumentCheque['chequeType']
//   : never

//   type MessageOf<T extends DocumentCheque['chequeType']> = T["chequeType"];

export const documentChequeSlice = createSlice({
  name: 'documentCheque',
  initialState,
  reducers: {
    extracted: (state, { payload }: PayloadExtract) => {
      state.taxPayerName = payload.taxPayerName
      state.taxPayerTin = payload.taxPayerTin
      state.cashierName = payload.cashierName
      state.cashierTin = payload.cashierTin
      state.pointOfSettlementAddress = payload.pointOfSettlementAddress
    },
    updated: (state, { payload }: PayloadUpdate) => {
      //@ts-ignore
      state[payload.key] = payload.value
    },
    updatedElectronicAmount: (state, { payload }: PayloadAction<string>) => {
      state.electronicAmount = payload
    },
    updatedTotalAmount: (state, { payload }: PayloadAction<string>) => {
      state.totalAmount = payload
    },
  },
})
