import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { GlobalErrorType } from './const'

type GlobalError = { type: GlobalErrorType | ''; reason: string }

interface InitialState {
  documentIsOpen: boolean
  error: { message: string }
  globalError: GlobalError
}

const initialState: InitialState = {
  documentIsOpen: false,
  error: {
    message: '',
  },
  globalError: {
    type: '',
    reason: '',
  },
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggled: (state) => {
      state.documentIsOpen = !state.documentIsOpen
    },
    error: (state, { payload }: PayloadAction<{ message: string }>) => {
      state.error.message = payload.message
    },
    removeError: (state) => {
      state.error.message = ''
    },
    globalError: (state, { payload }: PayloadAction<GlobalError>) => {
      state.globalError.type = payload.type
      state.globalError.reason = payload.reason
    },
  },
})
