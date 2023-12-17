import { DocumentSubject } from '@models/documentSubject.model'
import { AppThunk } from '@store'
import { TotalAmounts, documentSubjectsSlice } from '.'
import { EntityId } from '@reduxjs/toolkit'
import {
  selectDocumentSubjectsAmount,
  selectDocumentSubjectsById,
  selectDocumentSubjectsEntities,
  selectDocumentSubjectsTotalTaxesAmount,
} from './selectors'
import { calcAmounts } from '@utils/calcAmounts'
import { selectSubjectByName } from '@store/appSubjects/selectors'
import { documentChequeSlice } from '@store/documentCheque'
import { updateElectronicAmount } from '@store/documentCheque/thunks'

type DocumentAddSubject = (subjectName: string | null) => AppThunk
type DocumentRemoveSubject = (id: string) => AppThunk
type DocumentUpdateSubject = (id: EntityId, name: string, value: string) => AppThunk

export const calcTotalAmount: AppThunk = (dispatch, getState) => {
  const subjectsEntities = selectDocumentSubjectsEntities(getState())
  const totalTaxesAmountList = selectDocumentSubjectsTotalTaxesAmount(getState())

  const subjects = Object.values(subjectsEntities)

  const totalAmount = subjects.reduce<number>((acc, subject) => {
    return acc + parseInt(subject?.amount || '0')
  }, 0)

  const totalTaxesAmount = subjects.reduce<any>(
    (acc, subject) => {
      if (!subject) {
        return acc
      }

      const taxesType = subject.taxes
      const taxesAmount = parseFloat(subject.taxesAmount)

      acc[taxesType] += taxesAmount

      return acc
    },
    {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
    }
  )

  dispatch(documentSubjectsSlice.actions.updatedAmounts({ totalAmount, totalTaxesAmount }))
  dispatch(updateElectronicAmount)
}

export const documentRemoveSubject: DocumentRemoveSubject =
  (id: string) => (dispatch, getState) => {
    dispatch(documentSubjectsSlice.actions.removeSubject(id))
    dispatch(calcTotalAmount)
  }

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
  dispatch(calcTotalAmount)
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

      const { amount, taxesAmount } = calcAmounts(price, quantity, taxesType)

      updateSubjectData.changes.amount = amount
      updateSubjectData.changes.taxesAmount = taxesAmount
    }

    dispatch(documentSubjectsSlice.actions.updateSubject(updateSubjectData))
    dispatch(calcTotalAmount)
  }
