import ReactSelect from 'react-select'
import clsx from 'clsx'
import styles from './DocumentSubjectsTableItem.module.css'
import { useAppDispatch, useAppSelector } from '@store'
import { EntityId } from '@reduxjs/toolkit'

import { Input, InputView } from '../UI/Input'

import { selectDocumentSubjectsById } from '@store/documentSubjects/selectors'
import { documentSubjectsSlice } from '@store/documentSubjects'
import {
  AgentRoleSelectOptions,
  SignsMethodSelectOptions,
  SignsSubjectSelectOptions,
  TaxesSelectOptions,
} from '@consts'
import { documentRemoveSubject, documentUpdateSubject } from '@store/documentSubjects/thunks'
import { getDefaultOptionIndex } from '@utils/getDefaultOptionIndex'
import { Select, SelectViewVarinant } from '@components/UI/Select'

interface TableItem {
  id: EntityId
  number: number
  className?: string
}

export const DocumentSubjectsTableItem: React.FC<TableItem> = ({ id, number, className }) => {
  const documentSubject = useAppSelector(selectDocumentSubjectsById(id))

  const dispatch = useAppDispatch()

  if (!documentSubject) {
    return
  }

  const taxesOptionsDefaultIndex = getDefaultOptionIndex(TaxesSelectOptions, documentSubject.taxes)
  const signsSubjectOptionsDefaultIndex = getDefaultOptionIndex(
    SignsSubjectSelectOptions,
    documentSubject.signsSubject
  )
  const signsMethodOptionsDefaultIndex = 3
  const agentRoleOptionsDefaultIndex = getDefaultOptionIndex(
    AgentRoleSelectOptions,
    documentSubject.agentRole
  )

  console.warn('agentRoleOptionsDefaultIndex', agentRoleOptionsDefaultIndex)

  const handleDocumentRemoveSubject = (id: string) => dispatch(documentRemoveSubject(id))

  const handleDocumentUpdateSubject = (value: string, name: string) => {
    dispatch(documentUpdateSubject(id, name, value))
  }

  return (
    <tr className={clsx(styles.root, className)}>
      <td>{`${number}`}</td>
      <td>
        <Input
          name="name"
          value={documentSubject.name}
          onChange={(value, name) => handleDocumentUpdateSubject(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <Input
          name="price"
          value={documentSubject.price}
          onChange={(value, name) => handleDocumentUpdateSubject(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <Input
          name="quantity"
          value={documentSubject.quantity}
          onChange={(value, name) => handleDocumentUpdateSubject(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <Input
          name="amount"
          value={documentSubject.amount}
          onChange={(value, name) => handleDocumentUpdateSubject(value, name)}
          view={InputView.tableCol}
          disabled
        />
      </td>
      <td>
        <Input
          name="measure"
          value={documentSubject.measure}
          onChange={(value, name) => handleDocumentUpdateSubject(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <Select
          options={TaxesSelectOptions}
          defaultValue={documentSubject.taxes}
          onChange={(option) => handleDocumentUpdateSubject(option?.value || '', 'taxes')}
          view={SelectViewVarinant.inTable}
        />
      </td>
      <td>
        <Input
          name="taxesAmount"
          value={documentSubject.taxesAmount}
          view={InputView.tableCol}
          disabled
        />
      </td>
      <td>
        <Select
          // options={SignsSubjectSelectOptions}
          // defaultValue={SignsSubjectSelectOptions[signsSubjectOptionsDefaultIndex].value}
          // onChange={(option) => handleDocumentUpdateSubject(option?.value || '', 'signsSubject')}
          isDisabled
          view={SelectViewVarinant.inTable}
        />
      </td>
      <td>
        <Select
          options={SignsSubjectSelectOptions}
          defaultValue={documentSubject.signsSubject}
          onChange={(option) => handleDocumentUpdateSubject(option?.value || '', 'signsSubject')}
          view={SelectViewVarinant.inTable}
        />
      </td>
      <td>
        <Select
          options={SignsMethodSelectOptions}
          defaultValue={documentSubject.signsMethod}
          onChange={(option) => handleDocumentUpdateSubject(option?.value || '', 'signsMethod')}
          view={SelectViewVarinant.inTable}
        />
      </td>
      <td>
        <Select
          options={AgentRoleSelectOptions}
          defaultValue={documentSubject.agentRole}
          view={SelectViewVarinant.inTable}
          isDisabled
        />
      </td>
      <td>
        <Input
          name="supplierName"
          value={documentSubject.supplierName}
          onChange={(value, name) => handleDocumentUpdateSubject(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <Input
          name="supplierTin"
          value={documentSubject.supplierTin}
          onChange={(value, name) => handleDocumentUpdateSubject(value, name)}
          view={InputView.tableCol}
        />
      </td>
      <td>
        <button
          type="button"
          className={styles.buttonRemoveRow}
          onClick={() => handleDocumentRemoveSubject(documentSubject.id)}
        />
      </td>
    </tr>
  )
}
