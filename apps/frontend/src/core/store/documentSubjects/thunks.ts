import { DocumentSubject } from '@models/documentSubject.model'
import { AppThunk } from '@store'
import { documentSubjectsSlice } from '.'
import { EntityId } from '@reduxjs/toolkit'
import { selectDocumentSubjectsById } from './selectors'
import { calcAmounts } from '@utils/calcAmounts'
import { selectSubjectByName } from '@store/appSubjects/selectors'

type DocumentAddSubject = (subjectName: string | null) => AppThunk
type DocumentUpdateSubject = (id: EntityId, name: string, value: string) => AppThunk

export const documentAddSubject: DocumentAddSubject = (subjectName) => (dispatch, getState) => {
  const subject = selectSubjectByName(subjectName)(getState())

  const price = (subject && subject.price) || ''
  const quantity = (subject && subject.quantity) || ''
  const taxesType = (subject && subject?.taxes.vat[0].type.$value) || '1'

  const { amount, taxesAmount } = calcAmounts(price, quantity, taxesType)

  const documentSubject: DocumentSubject = {
    id: crypto.randomUUID(),
    name: (subject && subject.name) || '',
    price: price,
    quantity: quantity,
    amount: amount,
    measure: (subject && subject.measure) || '',
    taxes: taxesType,
    taxesAmount: taxesAmount,
    department: [],
    signsSubject: (subject && subject.signs.subject.$value) || '3',
    signsMethod: (subject && subject.signs.method.$value) || '1',
    agentRole: (subject && subject.agent?.role.$value) || '',
    supplierTin: (subject && subject.supplier?.tin) || '',
    supplierName: (subject && subject.supplier?.name) || '',
  }

  dispatch(documentSubjectsSlice.actions.addSubject(documentSubject))
}

export const documentUpdateSubject: DocumentUpdateSubject =
  (id, name, value) => (dispatch, getState) => {
    const subject = selectDocumentSubjectsById(id)(getState())
    const updateSubjectData = {
      id,
      changes: { [name]: value },
    }

    const isPrice = name === 'price'
    const isQuantity = name === 'quantity'
    const isTaxes = name === 'taxes'

    const isCalcFields = isPrice || isQuantity || isTaxes

    if (subject && isCalcFields) {
      const price = isPrice ? value : subject.price
      const quantity = isQuantity ? value : subject.quantity
      const taxesType = isTaxes ? value : subject.taxes

      console.warn({ price: price, quantity: quantity, taxes: taxesType })
      const { amount, taxesAmount } = calcAmounts(price, quantity, taxesType)

      updateSubjectData.changes.amount = amount
      updateSubjectData.changes.taxesAmount = taxesAmount
    }

    console.warn(updateSubjectData.changes)

    dispatch(documentSubjectsSlice.actions.updateSubject(updateSubjectData))
  }
