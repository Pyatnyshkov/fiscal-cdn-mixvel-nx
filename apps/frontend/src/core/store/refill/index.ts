import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RefillOperation } from '@models/general/refill.model'
import { ShiftError } from '@error'
import { AxiosError } from 'axios'
import { AppThunk } from '@store'
import { hasError } from '@store/app'

const initialState: RefillOperation = {
  request: {
    amount: '',
    operatorName: '',
  },
  response: {
    amountBefore: 0,
    amountAfter: 0,
  },
}

type PayloadAdd = PayloadAction<RefillOperation['request']>
type PayloadSuccess = PayloadAction<RefillOperation['response']>

export const fetchRefill: AppThunk = async (dispatch, getState, { API }) => {
  const { refill, network, app } = getState()

  try {
    const data = await API.refill.post(
      network.operationsSOAPEndpoint,
      app.instructions.deviceRouting,
      refill.request
    )

    dispatch(refillSlice.actions.success(data))
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

export const refillSlice = createSlice({
  name: 'refill',
  initialState,
  reducers: {
    addRefill: (state, { payload }: PayloadAdd) => {
      state.request.amount = payload.amount
      state.request.operatorName = payload.operatorName
    },
    success: (state, { payload }: PayloadSuccess) => {
      state.response.amountAfter = payload.amountAfter
      state.response.amountBefore = payload.amountBefore
    },
  },
})
