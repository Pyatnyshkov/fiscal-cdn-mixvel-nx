import { DocumentSubject } from '@models/documentSubject.model'
import { EntityId, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit'

export type TotalAmounts = {
  totalAmount: number
  totalTaxesAmount: {
    '1': number
    '2': number
    '3': number
    '4': number
    '5': number
    '6': number
  }
}

type PayloadAddSubject = PayloadAction<DocumentSubject>
type PayloadUpdateSubject = PayloadAction<{ id: EntityId; changes: Partial<DocumentSubject> }>
type PayloadRemoveSubject = PayloadAction<EntityId>

export const documentSubjectsAdapter = createEntityAdapter<DocumentSubject>()

export const documentSubjectsSlice = createSlice({
  name: 'documentSubjects',
  initialState: documentSubjectsAdapter.getInitialState({
    totalAmount: 0,
    totalTaxesAmount: {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
    },
  }),
  reducers: {
    addSubject: (state, { payload }: PayloadAddSubject) => {
      documentSubjectsAdapter.addOne(state, payload)
    },
    updateSubject: (state, { payload }: PayloadUpdateSubject) => {
      documentSubjectsAdapter.updateOne(state, payload)
    },
    removeSubject: (state, { payload }: PayloadRemoveSubject) => {
      documentSubjectsAdapter.removeOne(state, payload)
    },
    updatedAmounts: (state, { payload }: PayloadAction<TotalAmounts>) => {
      state.totalAmount = payload.totalAmount
      state.totalTaxesAmount = payload.totalTaxesAmount
    },
  },
})
