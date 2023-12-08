import { EntityId, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { initialState } from './initialState'
import { AppThunk } from '@store'
import { ChequeItem } from '@models/chequeItem.model.'

export const fetchSubjects: AppThunk = async (dispatch, getState, { API }) => {}

type PayloadSetItem = PayloadAction<ChequeItem>
type PayloadRemoveItem = PayloadAction<string>
type PayloadUpdateItem = PayloadAction<{ id: EntityId; changes: ChequeItem }>

export const chequeItemsAdapter = createEntityAdapter<ChequeItem>({
  // Keep the "all IDs" array sorted based on book titles
})

export const chequeItemsSlice = createSlice({
  name: 'chequeItems',
  initialState: chequeItemsAdapter.getInitialState(),
  reducers: {
    setItem: (state, { payload }: PayloadSetItem) => {
      chequeItemsAdapter.addOne(state, payload)
    },
    removeItem: (state, { payload }: PayloadRemoveItem) => {
      chequeItemsAdapter.removeOne(state, payload)
      // state.list.splice(payload, 1)
    },
    updateItem: (state, { payload }: PayloadUpdateItem) => {
      chequeItemsAdapter.updateOne(state, payload)
      // state.list.splice(payload, 1)
    },
  },
})
