import clsx from 'clsx'
import styles from './SubjectsTable.module.css'

import { useAppDispatch, useAppSelector } from '@store'

import { SubjectsTableItem } from '@components/SubjectsTableItem'
import { useEffect } from 'react'
import { selectSubjectsIds } from '@store/subjects/selectors'
import { selectAppSubjectsList } from '@store/appSubjects/selectors'
import { addSubject, extractToSubjects } from '@store/subjects/thunks'

interface SubjectsTable {
  className?: string
}

const subjectsTableHeader = {
  name: 'Наименование',
  price: 'Цена за единицу',
  quantity: 'Количество',
  measure: 'Единица',
  taxes: 'Налог',
  department: 'Отдел',
  subject: 'Предмет расчёта',
  agentRole: 'Агент',
  supplierTin: 'ИНН Поставщика',
  supplierName: 'Поставщик',
  restrictions: 'Ограничения',
}

export const SubjectsTable: React.FC<SubjectsTable> = ({ className }) => {
  const subjects = useAppSelector(selectAppSubjectsList)
  const subjectsIds = useAppSelector(selectSubjectsIds)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(extractToSubjects)
  }, [subjects])

  const handleAddSubject = () => {
    dispatch(addSubject)
  }

  return (
    <table className={clsx(styles.root, className)}>
      <thead>
        <tr>
          <th>#</th>
          {Object.values(subjectsTableHeader).map((title, index) => (
            <th key={index}>{title}</th>
          ))}
          <th className="styles.thAddRow">
            <button type="button" className={styles.buttonAddRow} onClick={handleAddSubject} />
          </th>
        </tr>
      </thead>
      <tbody>
        {subjectsIds.map((id, index) => {
          return <SubjectsTableItem id={id} number={index + 1} key={id} />
        })}
      </tbody>
    </table>
  )
}
