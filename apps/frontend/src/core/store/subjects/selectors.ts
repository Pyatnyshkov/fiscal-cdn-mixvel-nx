import { EntityId } from '@reduxjs/toolkit'
import { RootState } from '..'

export const selectSubjects = (state: RootState) => state.subjects
export const selectSubjectsEntities = (state: RootState) => selectSubjects(state).entities
export const selectSubjectsIds = (state: RootState) => selectSubjects(state).ids
export const selectSubjectsSubjectById = (id: EntityId) => (state: RootState) =>
  selectSubjectsEntities(state)[id]
