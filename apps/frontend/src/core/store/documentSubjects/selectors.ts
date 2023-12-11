import { EntityId } from '@reduxjs/toolkit'
import { RootState } from '..'

export const selectDocumentSubjects = (state: RootState) => state.documentSubjects
export const selectDocumentSubjectsEntities = (state: RootState) =>
  selectDocumentSubjects(state).entities
export const selectDocumentSubjectsIds = (state: RootState) => selectDocumentSubjects(state).ids
export const selectDocumentSubjectsById = (id: EntityId) => (state: RootState) =>
  selectDocumentSubjectsEntities(state)[id]
