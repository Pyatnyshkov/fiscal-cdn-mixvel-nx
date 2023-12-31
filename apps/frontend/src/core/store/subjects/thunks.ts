import { AppThunk } from '@store'
import { EntityId } from '@reduxjs/toolkit'
import { selectAppSubjectsList } from '@store/appSubjects/selectors'
import { SubjectElement } from '@models/subjectElement.state.model'
import { subjectsSlice } from '.'
import { TaxationSystemsValue } from '@consts'
import { selectSubjectsSubjectById } from './selectors'
import { TaxationSystemModel } from '@models/general/taxationSystem.model'
import { selectEditorSubjectsDepartments } from '@store/editorSubjects/selectors'

type ExtractToSubjects = AppThunk
type AddSubject = AppThunk
type UpdateSubject = (
  id: EntityId,
  name: keyof SubjectElement,
  value: SubjectElement[keyof SubjectElement]
) => AppThunk
type UpdateSubjectRestrictions = (
  id: EntityId,
  checked: boolean,
  value: TaxationSystemsValue
) => AppThunk
type RemoveSubject = (id: EntityId) => AppThunk

type Changes = { [key in keyof SubjectElement]?: SubjectElement[key] }

export const extractToSubjects: ExtractToSubjects = (dispatch, getState) => {
  const subjects = selectAppSubjectsList(getState())
  const departments = selectEditorSubjectsDepartments(getState())

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
      department: { code: '', title: '' },
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
    taxes: '1',
    department: { code: '', title: '' },
    signsSubject: '4',
    agentRole: '',
    supplierTin: '',
    supplierName: '',
    restrictionsTaxationSystems: [],
  }

  dispatch(subjectsSlice.actions.addedSubject(subjectElement))
}

export const updateSubjectRestrictions: UpdateSubjectRestrictions =
  (id, checked, value) => (dispatch, getState) => {
    const subject = selectSubjectsSubjectById(id)(getState())

    if (!subject) {
      return
    }

    const copyRestrictions = [...subject.restrictionsTaxationSystems]

    const updateData: {
      id: EntityId
      changes: { restrictionsTaxationSystems: TaxationSystemModel[] }
    } = {
      id,
      changes: { restrictionsTaxationSystems: [] },
    }

    checked &&
      copyRestrictions.push({
        type: {
          attributes: {
            codepage: 'fts-1.31_1#taxationSystem',
          },
          $value: value,
        },
      })

    const indexx = copyRestrictions.findIndex((el: any) => el.type.$value === value)

    !checked && copyRestrictions.splice(indexx, 1)

    updateData.changes.restrictionsTaxationSystems = copyRestrictions

    dispatch(subjectsSlice.actions.updatedSubjectRestrictions(updateData))
  }

export const updateSubject: UpdateSubject = (id, name, value) => (dispatch) => {
  const updateData: {
    id: EntityId
    changes: Changes
  } = {
    id,
    changes: { [name]: value },
  }

  dispatch(subjectsSlice.actions.updatedSubject(updateData))
}

export const removeSubject: RemoveSubject = (id) => (dispatch) => {
  dispatch(subjectsSlice.actions.removedSubject(id))
}
