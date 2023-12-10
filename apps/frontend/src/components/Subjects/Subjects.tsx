import clsx from 'clsx'
import styles from './Subjects.module.css'

import { SubjectsTable } from '@components/SubjectsTable'
import { Button } from '@components/UI/Button'
import { useAppDispatch } from '@store'

interface Subjects {
  className?: string
}

export const Subjects: React.FC<Subjects> = ({ className }) => {
  const dispatch = useAppDispatch()

  const handleUpdateSubjects = () => {}
  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.panel}>
        <h1 className={styles.title}>Товарные позиции:</h1>
        <Button
          text="Сохранить"
          // onClick={handleShiftOpen}
        />
      </div>

      <SubjectsTable />
    </div>
  )
}
