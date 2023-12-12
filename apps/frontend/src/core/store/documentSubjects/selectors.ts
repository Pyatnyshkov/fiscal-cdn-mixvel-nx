import { EntityId } from '@reduxjs/toolkit'
import { RootState } from '..'

export const selectDocumentSubjects = (state: RootState) => state.documentSubjects
export const selectDocumentSubjectsEntities = (state: RootState) =>
  selectDocumentSubjects(state).entities
export const selectDocumentSubjectsIds = (state: RootState) => selectDocumentSubjects(state).ids
export const selectDocumentSubjectsById = (id: EntityId) => (state: RootState) =>
  selectDocumentSubjectsEntities(state)[id]

export const selectDocumentSubjectsAmount = (state: RootState) =>
  Object.values(selectDocumentSubjectsEntities(state)).reduce<number>((acc, subject) => {
    return acc + parseInt(subject?.amount || '0')
  }, 0)

export const selectDocumentSubjectsTotalAmount = (state: RootState) =>
  selectDocumentSubjects(state).totalAmount

export const selectDocumentSubjectsTotalTaxesAmount = (state: RootState) =>
  selectDocumentSubjects(state).totalTaxesAmount
