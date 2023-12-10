import ReactSelect from 'react-select'
import clsx from 'clsx'
import styles from './SubjectsTableItem.module.css'

import { useAppDispatch, useAppSelector } from '@store'

import { Input, InputView } from '../UI/Input'

import { documentSubjectsSlice } from '@store/documentSubjects'
import {
  AgentRoleSelectOptions,
  SignsSubjectSelectOptions,
  TaxationSystems,
  TaxesSelectOptions,
} from '@consts'
import { getDefaultOptionIndex } from '@utils/getDefaultOptionIndex'
import { EntityId } from '@reduxjs/toolkit'
import { selectSubjectsSubjectById } from '@store/subjects/selectors'
import { removeSubject, updateSubject } from '@store/subjects/thunks'
import { Checkbox } from '@components/UI/Checkbox'
import { isTaxationSystem } from '@models/subjectElement.state.model'

interface TableItem {
  id: EntityId
  number: number
  className?: string
}

export const SubjectsTableItem: React.FC<TableItem> = ({ id, number, className }) => {
  const subject = useAppSelector(selectSubjectsSubjectById(id))

  const dispatch = useAppDispatch()

  if (!subject) {
    return
  }

  const taxesOptionsDefaultIndex = getDefaultOptionIndex(TaxesSelectOptions, subject.taxes)
  const signsSubjectOptionsDefaultIndex = getDefaultOptionIndex(
    SignsSubjectSelectOptions,
    subject.signsSubject
  )

  const agentRoleOptionsDefaultIndex = getDefaultOptionIndex(
    AgentRoleSelectOptions,
    subject.agentRole
  )

  // перенести table callback

  const handleUpdateSubject = (value: string, name: string) => {
    dispatch(updateSubject(id, name, value))
  }

  const handleRemoveSubject = (id: EntityId) => dispatch(removeSubject(id))

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
        <ReactSelect
          options={TaxesSelectOptions}
          defaultValue={TaxesSelectOptions[taxesOptionsDefaultIndex]}
          onChange={(option) => handleUpdateSubject(option?.value || '', 'taxes')}
        />
      </td>
      <td>
        <ReactSelect isDisabled />
      </td>
      <td>
        <ReactSelect
          options={SignsSubjectSelectOptions}
          defaultValue={SignsSubjectSelectOptions[signsSubjectOptionsDefaultIndex]}
          onChange={(option) => handleUpdateSubject(option?.value || '', 'signsSubject')}
        />
      </td>

      <td>
        <ReactSelect
          options={AgentRoleSelectOptions}
          defaultValue={AgentRoleSelectOptions[agentRoleOptionsDefaultIndex]}
          onChange={(option) => handleUpdateSubject(option?.value || '', 'agentRole')}
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
              onChange={(value) => console.log(value)}
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
