import styles from './Document.module.css'

import { ChequeForm } from '@components/DocumentForms/ChequeForm'
import { ChequeTotalForm } from '@components/DocumentForms/ChequeTotalForm'
import { DocumentSubjects } from '@components/DocumentSubjects'

export const Document = () => {
  return (
    <div className={styles.root}>
      <div className={styles.form}>
        <ChequeForm />
        <div className={styles.col}>
          <ChequeTotalForm />
        </div>
      </div>
      <DocumentSubjects className={styles.productMarginBottom} />
    </div>
  )
}
