import { EntityId, createSelector } from '@reduxjs/toolkit'
import { RootState } from '..'

export const selectChequeItems = (state: RootState) => state.chequeItems
export const selectChequeEntities = (state: RootState) => selectChequeItems(state).entities
export const selectChequeIds = (state: RootState) => selectChequeItems(state).ids

export const selectChequeGetItemById = (id: EntityId) => (state: RootState) =>
  selectChequeEntities(state)[id]

// export const selectSubjetsList = (state: RootState) =>
//   selectSubjets(state).subjects.reduce<{ value: string; label: string }[]>((acc, { name }) => {
//     acc.push({ value: name, label: name })
//     return acc
//   }, [])
