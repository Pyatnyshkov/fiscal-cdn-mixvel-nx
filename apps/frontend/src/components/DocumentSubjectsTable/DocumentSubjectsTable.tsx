import clsx from 'clsx'
import styles from './DocumentSubjectsTable.module.css'

import { useAppDispatch, useAppSelector } from '@store'

import { DocumentSubjectsTableItem } from '@components/DocumentSubjectsTableItem'

import { documentAddSubject } from '@store/documentSubjects/thunks'
import { selectDocumentSubjectsIds } from '@store/documentSubjects/selectors'

interface DocumentSubjectsTable {
  className?: string
}

const subjectsTableHeader = {
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
  supplierName: 'Поставщик',
  supplierTin: 'ИНН Поставщика',
}

export const DocumentSubjectsTable: React.FC<DocumentSubjectsTable> = ({ className }) => {
  const documentSubjectsIds = useAppSelector(selectDocumentSubjectsIds)

  const dispatch = useAppDispatch()

  const handleDocumentAddSubject = () => {
    dispatch(documentAddSubject(null))
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
            <button
              type="button"
              className={styles.buttonAddRow}
              onClick={handleDocumentAddSubject}
            />
          </th>
        </tr>
      </thead>
      <tbody>
        {documentSubjectsIds.map((id, index) => {
          return <DocumentSubjectsTableItem id={id} number={index + 1} key={id} />
        })}
      </tbody>
    </table>
  )
}
