import { createSlice } from '@reduxjs/toolkit'

interface InitialState {
  documentIsOpen: boolean
}

const initialState: InitialState = {
  documentIsOpen: false,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggled: (state) => {
      state.documentIsOpen = !state.documentIsOpen
    },
  },
})
