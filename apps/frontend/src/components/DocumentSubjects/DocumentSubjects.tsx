import clsx from 'clsx'
import styles from './DocumentSubjects.module.css'

import { DocumentSubjectsPanel } from '@components/DocumentSubjectsPanel'
import { DocumentSubjectsTable } from '@components/DocumentSubjectsTable'

interface DocumentSubjects {
  className?: string
}

export const DocumentSubjects: React.FC<DocumentSubjects> = ({ className }) => {
  return (
    <div className={clsx(styles.root, className)}>
      <DocumentSubjectsPanel />
      <DocumentSubjectsTable />
    </div>
  )
}
