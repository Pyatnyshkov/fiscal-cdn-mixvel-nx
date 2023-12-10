import { AppThunk } from '@store'
import { EntityId } from '@reduxjs/toolkit'
import { selectAppSubjectsList } from '@store/appSubjects/selectors'
import { SubjectElement } from '@models/subjectElement.state.model'
import { subjectsSlice } from '.'

type ExtractToSubjects = AppThunk
type AddSubject = AppThunk
type UpdateSubject = (id: EntityId, name: string, value: string) => AppThunk
type RemoveSubject = (id: EntityId) => AppThunk

export const extractToSubjects: ExtractToSubjects = (dispatch, getState) => {
  const subjects = selectAppSubjectsList(getState())

  if (!subjects.length) {
    return
  }

  const subjectsElements: SubjectElement[] = subjects.map((subject) => {
    return {
      id: crypto.randomUUID(),
      name: subject.name,
      price: subject.price,
      quantity: subject.quantity,
      measure: subject.measure,
      taxes: subject.taxes.vat[0].type.$value,
      department: [],
      signsSubject: subject.signs.subject.$value || '3',
      agentRole: subject.agent?.role.$value || '',
      supplierTin: subject.supplier?.tin || '',
      supplierName: subject.supplier?.name || '',
      restrictionsTaxationSystems: subject.restrictions?.taxationSystems.taxationSystem || [],
    }
  })

  dispatch(subjectsSlice.actions.extractedSubject(subjectsElements))
}

export const addSubject: AddSubject = (dispatch) => {
  const subjectElement: SubjectElement = {
    id: crypto.randomUUID(),
    name: '',
    price: '',
    quantity: '',
    measure: '',
    taxes: '',
    department: [],
    signsSubject: '3',
    agentRole: '',
    supplierTin: '',
    supplierName: '',
    restrictionsTaxationSystems: [],
  }

  dispatch(subjectsSlice.actions.addedSubject(subjectElement))
}

export const updateSubject: UpdateSubject = (id, name, value) => (dispatch) => {
  const updateData = {
    id,
    changes: { [name]: value },
  }

  dispatch(subjectsSlice.actions.updatedSubject(updateData))
}

export const removeSubject: RemoveSubject = (id) => (dispatch) => {
  dispatch(subjectsSlice.actions.removedSubject(id))
}
