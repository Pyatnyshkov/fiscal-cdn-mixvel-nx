import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { TaxationSystemModel } from '@models/general/taxationSystem.model'
import { ChequeContent } from '@models/general/chequeContent.model'
import { ChequeModel } from '@models/cheque.model'

interface DocumentDataState {
  taxationSystem: TaxationSystemModel['type']['$value']
  taxation: {
    enabledTaxationSystems: {
      value: string
    }
  }
  printoutInjections: ChequeModel['printoutInjections']
  sendButtonDisabled: ChequeModel['sendButtonDisabled']
  sendButtonVisible: ChequeModel['sendButtonVisible']
  issueResult: ChequeModel['issueResult']
  chequeContent: ChequeContent
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
  sendButtonDisabled: false,
  issueResult: {},
  chequeContent: {} as ChequeContent,
  taxation: {
    enabledTaxationSystems: {
      value: '',
    },
  },
}

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    fetchDocumentCheque: (state, { payload }: PayloadAction<boolean>) => {
      state.sendButtonVisible = !payload
    },
    sendButtonState: (state, { payload }: PayloadAction<boolean>) => {
      state.sendButtonDisabled = !payload
    },
    successCloseChequeApp: (state, { payload }: any) => {
      state.issueResult = payload
    },
  },
})
