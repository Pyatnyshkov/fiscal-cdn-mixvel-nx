import clsx from 'clsx'
import styles from './DocumentSubjectsPanel.module.css'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store'

import { Select } from '@components/UI/Select'
import { Button } from '../UI/Button'

import { documentAddSubject } from '@store/documentSubjects/thunks'
import { selectAppSubjectsSelectOptions } from '@store/appSubjects/selectors'

interface DocumentSubjectsPanel {
  className?: string
}

export const DocumentSubjectsPanel: React.FC<DocumentSubjectsPanel> = ({ className }) => {
  const subjectsOptions = useAppSelector(selectAppSubjectsSelectOptions)

  const [selectedSubject, setSelectedSubject] = useState<{
    value: string
    label: string
  } | null>()

  const dispatch = useAppDispatch()

  const handleDocumentAddSubject = () => {
    if (!selectedSubject) {
      return
    }
    dispatch(documentAddSubject(selectedSubject.value))
  }

  return (
    <div className={clsx(styles.root, className)}>
      <Select
        label="Товарные позиции"
        options={subjectsOptions}
        onChange={setSelectedSubject}
        placeholder="Выберите товар"
      />
      <Button text="Добавить" onClick={handleDocumentAddSubject} className={styles.marginLeft} />
    </div>
  )
}
