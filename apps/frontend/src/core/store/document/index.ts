import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { TaxationSystemModel } from '@models/general/taxationSystem.model'
import { ChequeContent } from '@models/general/chequeContent.model'
import { ChequeModel } from '@models/cheque.model'
import { IssueResult } from '@models/general/issueResult.model'

interface DocumentDataState {
  taxationSystem: TaxationSystemModel['type']['$value']
  taxation: {
    enabledTaxationSystems: {
      value: string
    }
  }
  printoutInjections: ChequeModel['printoutInjections']
  sendButtonVisible: ChequeModel['sendButtonVisible']
  issueResult: IssueResult | null
  chequeContent: ChequeContent
  hideOnShiftOperation: boolean
}

const initialState: DocumentDataState = {
  taxationSystem: '0',
  printoutInjections: {
    documentReferenceNumber: '',
    payments: {
      forms: {
        electronic: {
          maskedCardPAN: '',
          amount: '',
        },
        cash: {
          amount: '',
        },
        consideration: {
          amount: '',
        },
      },
    },
  },
  sendButtonVisible: true,
  issueResult: null,
  chequeContent: {} as ChequeContent,
  taxation: {
    enabledTaxationSystems: {
      value: '',
    },
  },
  hideOnShiftOperation: false
}

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    fetchDocumentCheque: () => {},
    sendButtonVisible: (state, { payload }: PayloadAction<boolean>) => {
      state.sendButtonVisible = payload
    },
    successCloseChequeApp: (state, { payload }: PayloadAction<any>) => {
      state.issueResult = payload
    },
    fetchIssueDocumentCurrentSettlementReport: () => {},
    hideOnShiftOperation: (state, { payload }: PayloadAction<boolean>) => {
      state.hideOnShiftOperation = payload
    }
  },
})
