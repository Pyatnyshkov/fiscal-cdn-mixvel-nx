import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { EncashmentOperation } from '@models/general/encashment.model'
import { AppThunk } from '@store'
import { hasError } from '@store/app'
import { ShiftError } from '@error'
import { AxiosError } from 'axios'
import { DocumentModel } from '@models/general/document.mode'
import { Cashier } from '@models/general/cashier.model'
import { PointOfSettlement } from '@models/general/pointOfSettlement.model'
import { TaxationSystem } from '@models/general/taxationSystem.model'
import { ChequeContent } from '@models/general/chequeContent.model'
import { ChequeModel } from '@models/cheque.model'

interface InitialState {
  chequeType: DocumentModel['chequeType']
  taxPayer: DocumentModel['taxPayer']
  cashier: Cashier
  pointOfSettlement: PointOfSettlement
  taxationSystem: TaxationSystem // нужна ли
  customer: ChequeContent['customer']
  printoutInjections: ChequeModel['printoutInjections']
  electronicAmount: ChequeModel['printoutInjections']['payments']['forms']['electronic']['amount']
  cashAmount: ChequeModel['printoutInjections']['payments']['forms']['cash']['amount']
  considerationAmount: ChequeModel['printoutInjections']['payments']['forms']['consideration']['amount']
  electronicMaskedCardPAN: ChequeModel['printoutInjections']['payments']['forms']['electronic']['maskedCardPAN']
  copies: ChequeModel['copies']
}

const initialState: InitialState = {
  chequeType: 'credit',
  taxPayer: {
    tin: '',
    name: '',
  },
  cashier: {
    tin: '',
    fullName: '',
  },
  pointOfSettlement: {
    address: '',
  },
  taxationSystem: {
    attributes: {
      codepage: '',
    },
    $value: '0',
  },
  customer: {
    phone: '',
    email: '',
  },
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
  electronicAmount: '',
  cashAmount: '',
  considerationAmount: '',
  electronicMaskedCardPAN: '',
  copies: 0,
}

type PayloadAdd = PayloadAction<EncashmentOperation['request']>
type PayloadSuccess = PayloadAction<EncashmentOperation['response']>
type PayloadExtract = PayloadAction<
  Pick<InitialState, 'taxPayer' | 'cashier' | 'pointOfSettlement'>
>

export const extractAppDataToDocument: AppThunk = async (dispatch, getState, { API }) => {
  const { app } = getState()
  dispatch(
    documentSlice.actions.extract({
      taxPayer: app.taxPayer,
      cashier: app.cashier,
      pointOfSettlement: app.pointOfSettlement,
    })
  )
}

// export const fetchDocument: AppThunk = async (dispatch, getState, { API }) => {
//   const { encashment, network, app } = getState()

//   try {
//     const data = await API.encashment.post(
//       network.operationsSOAPEndpoint,
//       app.instructions.deviceRouting,
//       encashment.request
//     )

//     dispatch(documentSlice.actions.success(data))
//   } catch (error) {
//     if (error instanceof ShiftError) {
//       dispatch(hasError(error.reason))
//     }
//     if (error instanceof AxiosError) {
//       console.error(error)
//     }
//     if (error instanceof Error) {
//       console.error(error)
//     }
//   }
// }

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    extract: (state, { payload }: PayloadExtract) => {
      state.taxPayer = payload.taxPayer
      state.cashier = payload.cashier
      state.pointOfSettlement.address = payload.pointOfSettlement.address
    },
  },
})
