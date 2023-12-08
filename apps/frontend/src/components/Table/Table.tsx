import clsx from 'clsx'
import styles from './Table.module.css'
import { Button } from '../Button'

import { ChequeTableItem } from '../ChequeTableItem'
import { Select } from '@components/Select'
import { useAppDispatch, useAppSelector } from '@store'

import { chequeItemsSlice } from '@store/chequeItems'
import {
  selectSubjectsFindSubject,
  selectSubjectsListToSelectOptions,
} from '@store/subjects/selectors'
import { useState } from 'react'
import { ChequeItem } from '@models/chequeItem.model.'
import { selectChequeEntities, selectChequeIds } from '@store/chequeItems/selectors'

interface Table {
  className?: string
}

const chequeItemsHeader = {
  name: 'Наименование',
  price: 'Цена за единицу',
  quantity: 'Количество',
  amount: 'Стоимость',
  measure: 'Единица',
  taxes: 'Налог',
  taxesAmount: 'Сумма налога',
  department: 'Отдел',
  subject: 'Предмет расчёта',
  method: 'Способ расчёта',
  agentRole: 'Агент',
  supplierTin: 'ИНН Поставщика',
  supplierName: 'Поставщик',
}

const subjectsHeader = {
  name: 'Наименование',
  price: 'Цена за единицу',
  quantity: 'Количество',
  amount: 'Стоимость',
  measure: 'Единица',
  taxes: 'Налог',
  taxesAmount: 'Сумма налога',
  department: 'Отдел',
  subject: 'Предмет расчёта',
  method: 'Способ расчёта',
  agentRole: 'Агент',
  supplierTin: 'ИНН Поставщика',
  supplierName: 'Поставщик',
}

const dataTable = [
  {
    name: '',
    price: '',
    quantity: '',
    amount: '',
    measure: '',
    taxes: [],
    taxesAmount: '',
    department: [],
    subject: [],
    method: [],
    agentRole: [],
    supplierTin: '',
    supplierName: '',
  },
  {
    name: '',
    price: '',
    quantity: '',
    amount: '',
    measure: '',
    taxes: [],
    taxesAmount: '',
    department: [],
    subject: [],
    method: [],
    agentRole: [],
    supplierTin: '',
    supplierName: '',
  },
]

export const Table: React.FC<Table> = ({ className }) => {
  const subjectsList = useAppSelector(selectSubjectsListToSelectOptions)
  const chequeIds = useAppSelector(selectChequeIds)
  // const chequeItemsList = chequeItemsAdapter.getSelectors((state: RootState) => state.chequeItems.entities)
  const [subjectFromSelect, setSubjectFromSelect] = useState<{ value: string; label: string }>()
  const subject = useAppSelector(selectSubjectsFindSubject(subjectFromSelect?.label || ''))

  console.log('subject', subject)

  const dispatch = useAppDispatch()

  const handleRemoveItem = (id: string) => dispatch(chequeItemsSlice.actions.removeItem(id))

  const handleAddEmptyItem = () => {
    const emptyItem: ChequeItem = {
      id: crypto.randomUUID(),
      name: '',
      price: '',
      quantity: '',
      amount: '',
      measure: '',
      taxes: '1',
      taxesAmount: '',
      department: [],
      signsSubject: '3',
      signsMethod: '1',
      agentRole: '2',
      supplierTin: '',
      supplierName: '',
    }
    dispatch(chequeItemsSlice.actions.setItem(emptyItem))
  }

  const handleAddSubjectItem = () => {
    if (!subject) {
      return
    }
    dispatch(chequeItemsSlice.actions.setItem(subject))
  }

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.subjects}>
        <Select label="Товарные позиции" options={subjectsList} onChange={setSubjectFromSelect} />
        <Button text="Добавить" onClick={handleAddSubjectItem} />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            {Object.values(chequeItemsHeader).map((title, index) => (
              <th key={index}>{title}</th>
            ))}
            <th className="styles.thAddRow">
              <button type="button" className={styles.buttonAddRow} onClick={handleAddEmptyItem} />
            </th>
          </tr>
        </thead>
        <tbody>
          {chequeIds.map((id, index) => {
            // const key = index + 'x' + data.length
            if (!id) {
              return
            }
            return <ChequeTableItem id={id} index={index} onClick={handleRemoveItem} key={id} />
          })}
        </tbody>
      </table>
    </div>
  )
}
