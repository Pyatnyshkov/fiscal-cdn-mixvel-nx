import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { EncashmentOperation } from '@models/general/encashment.model'
import { AppThunk } from '@store'
import { hasError } from '@store/app'
import { ShiftError } from '@error'
import { AxiosError } from 'axios'

const initialState: EncashmentOperation = {
  request: {
    amount: '',
    operatorName: '',
  },
  response: {
    amountBefore: 0,
    amountAfter: 0,
  },
}

type PayloadAdd = PayloadAction<EncashmentOperation['request']>
type PayloadSuccess = PayloadAction<EncashmentOperation['response']>

export const fetchEncashment: AppThunk = async (dispatch, getState, { API }) => {
  const { encashment, network, app } = getState()

  try {
    const data = await API.encashment.post(
      network.operationsSOAPEndpoint,
      app.instructions.deviceRouting,
      encashment.request
    )

    dispatch(encashmentSlice.actions.success(data))
  } catch (error) {
    if (error instanceof ShiftError) {
      dispatch(hasError(error.reason))
    }
    if (error instanceof AxiosError) {
      console.error(error)
    }
    if (error instanceof Error) {
      console.error(error)
    }
  }
}

export const encashmentSlice = createSlice({
  name: 'encashment',
  initialState,
  reducers: {
    addEncashment: (state, { payload }: PayloadAdd) => {
      state.request.amount = payload.amount
      state.request.operatorName = payload.operatorName
    },
    success: (state, { payload }: PayloadSuccess) => {
      state.response.amountAfter = payload.amountAfter
      state.response.amountBefore = payload.amountBefore
    },
  },
})
