import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '..'
import { ChequeItem } from '@models/chequeItem.model.'
import { calcVatAmount } from '@utils/calcTaxes'

export const selectSubjects = (state: RootState) => state.subjects
export const selectSubjectsList = (state: RootState) => selectSubjects(state).subjects
export const selectSubjectsListToSelectOptions = (state: RootState) =>
  selectSubjectsList(state).reduce<{ value: string; label: string }[]>((acc, { name }) => {
    acc.push({ value: name, label: name })
    return acc
  }, [])

export const selectSubjectsFindSubject = (name: string) => (state: RootState) => {
  const subject = selectSubjectsList(state).find((subject) => subject.name === name)
  if (!subject) {
    return
  }

  const chequeItem: ChequeItem = {
    id: crypto.randomUUID(),
    name: subject.name,
    price: subject.price,
    quantity: subject.quantity,
    amount: '0',
    measure: subject.measure,
    taxes: subject.taxes.vat[0].type.$value,
    taxesAmount: subject.taxes.vat[0].type.$value,
    department: [],
    signsSubject: subject.signs.subject.$value,
    signsMethod: subject.signs.method.$value,
    agentRole: subject.agent.role.$value,
    supplierTin: subject.supplier?.tin || '',
    supplierName: subject.supplier?.name || '',
  }

  return chequeItem
}
