import ReactSelect from 'react-select'
import clsx from 'clsx'
import styles from './SubjectsTableItem.module.css'

import { useAppDispatch, useAppSelector } from '@store'

import { Input, InputView } from '../UI/Input'

import {
  AgentRoleSelectOptions,
  SignsSubjectSelectOptions,
  TaxationSystems,
  TaxesSelectOptions,
} from '@consts'
import { EntityId } from '@reduxjs/toolkit'
import { selectSubjectsSubjectById } from '@store/subjects/selectors'
import { removeSubject, updateSubject, updateSubjectRestrictions } from '@store/subjects/thunks'
import { Checkbox } from '@components/UI/Checkbox'
import { isTaxationSystem } from '@models/subjectElement.state.model'
import { Select, SelectViewVarinant } from '@components/UI/Select'
import { selectEditorSubjectsDepartments } from '@store/editorSubjects/selectors'
import { EditorSubjects } from '@models/editorSubjects.model'

interface TableItem {
  id: EntityId
  number: number
  className?: string
}

export const SubjectsTableItem: React.FC<TableItem> = ({ id, number, className }) => {
  const subject = useAppSelector(selectSubjectsSubjectById(id))
  const departments = useAppSelector(selectEditorSubjectsDepartments)

  const dispatch = useAppDispatch()

  if (!subject) {
    return
  }

  const convertToSelectOptions = (data: EditorSubjects['departments']) => {
    return data.reduce<{ value: string; label: string }[]>((acc, el) => {
      acc.push({ value: el.code, label: el.title })
      return acc
    }, [])
  }

  const departmentsSelectOptions = convertToSelectOptions(departments)

  // перенести table callback

  const handleUpdateSubject = (value: string, name: any) => {
    dispatch(updateSubject(id, name, value))
  }

  const handleUpdateSubjectDepartment = (
    options: { value: string; label: string } | null,
    name: any
  ) => {
    if (!options) {
      return
    }

    const department = { code: options.value, title: options.label }
    dispatch(updateSubject(id, name, department))
  }

  const handleRemoveSubject = (id: EntityId) => dispatch(removeSubject(id))

  const handleUpdateRestrictions = (value: any, checked: boolean) =>
    dispatch(updateSubjectRestrictions(id, checked, value))

  return (
    <tr className={clsx(styles.root, className)}>
      <td>{`${number}`}</td>
      <td>
        <Input
          name="name"
          value={subject.name}
          onChange={(value, name) => handleUpdateSubject(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <Input
          name="price"
          value={subject.price}
          onChange={(value, name) => handleUpdateSubject(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <Input
          name="quantity"
          value={subject.quantity}
          onChange={(value, name) => handleUpdateSubject(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <Input
          name="measure"
          value={subject.measure}
          onChange={(value, name) => handleUpdateSubject(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <Select
          options={TaxesSelectOptions}
          defaultValue={subject.taxes}
          onChange={(option) => handleUpdateSubject(option?.value || '', 'taxes')}
          view={SelectViewVarinant.inTable}
        />
      </td>
      <td>
        <Select
          options={departmentsSelectOptions}
          // defaultValue={subject.department}
          onChange={(option) => handleUpdateSubjectDepartment(option, 'department')}
          view={SelectViewVarinant.inTable}
        />
      </td>
      <td>
        <Select
          options={SignsSubjectSelectOptions}
          defaultValue={subject.signsSubject}
          onChange={(option) => handleUpdateSubject(option?.value || '', 'signsSubject')}
          view={SelectViewVarinant.inTable}
        />
      </td>

      <td>
        <Select
          options={AgentRoleSelectOptions}
          defaultValue={subject.agentRole}
          onChange={(option) => handleUpdateSubject(option?.value || '', 'agentRole')}
          view={SelectViewVarinant.inTable}
        />
      </td>
      <td>
        <Input
          name="supplierTin"
          value={subject.supplierTin}
          onChange={(value, name) => handleUpdateSubject(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <Input
          name="supplierName"
          value={subject.supplierName}
          onChange={(value, name) => handleUpdateSubject(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        {Object.entries(TaxationSystems).map(([key, value]) => {
          const isChecked = subject.restrictionsTaxationSystems.some(
            (value) => isTaxationSystem(value) && value.type.$value === key
          )

          return (
            <Checkbox
              label={value}
              name={key}
              id={`restrictions_${key}`}
              checked={isChecked}
              key={key}
              onChange={handleUpdateRestrictions}
            />
          )
        })}
      </td>
      <td>
        <button
          type="button"
          className={styles.buttonRemoveRow}
          onClick={() => handleRemoveSubject(id)}
        />
      </td>
    </tr>
  )
}
