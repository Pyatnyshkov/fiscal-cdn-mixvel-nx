import { SubjectElement } from '@models/subjectElement.state.model'

import { EntityId, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit'

type PayloadAdd = PayloadAction<SubjectElement>
type PayloadAddMany = PayloadAction<SubjectElement[]>
type PayloadUpdate = PayloadAction<{ id: EntityId; changes: Partial<SubjectElement> }>
type PayloadUpdatedRestrictions = PayloadAction<{ id: EntityId; changes: Partial<SubjectElement> }>
type PayloadRemove = PayloadAction<EntityId>

export const subjectsAdapter = createEntityAdapter<SubjectElement>()

export const subjectsSlice = createSlice({
  name: 'subjects',
  initialState: subjectsAdapter.getInitialState(),
  reducers: {
    extractedSubject: (state, { payload }: PayloadAddMany) => {
      subjectsAdapter.setAll(state, payload)
    },
    addedSubject: (state, { payload }: PayloadAdd) => {
      subjectsAdapter.addOne(state, payload)
    },
    updatedSubject: (state, { payload }: PayloadUpdate) => {
      subjectsAdapter.updateOne(state, payload)
    },
    updatedSubjectRestrictions: (state, { payload }: PayloadUpdatedRestrictions) => {
      subjectsAdapter.updateOne(state, payload)
    },
    removedSubject: (state, { payload }: PayloadRemove) => {
      subjectsAdapter.removeOne(state, payload)
    },
  },
})
