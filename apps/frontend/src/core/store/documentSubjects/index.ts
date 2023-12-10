import { DocumentSubject } from '@models/documentSubject.model'
import { EntityId, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit'

type PayloadAddSubject = PayloadAction<DocumentSubject>
type PayloadUpdateSubject = PayloadAction<{ id: EntityId; changes: Partial<DocumentSubject> }>
type PayloadRemoveSubject = PayloadAction<EntityId>

export const documentSubjectsAdapter = createEntityAdapter<DocumentSubject>()

export const documentSubjectsSlice = createSlice({
  name: 'documentSubjects',
  initialState: documentSubjectsAdapter.getInitialState(),
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
  },
})
