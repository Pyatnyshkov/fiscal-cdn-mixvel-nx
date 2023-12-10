import styles from './ShiftDesc.module.css'

import { Document } from '../Document'
import { ShiftDocumentForm } from '../DocumentForms/ShiftForm'
import { EncashmentForm } from '../DocumentForms/EncashmentForm'
import { RefillForm } from '../DocumentForms/RefillForm'
import { DocumentToggle } from '../DocumentToggle'
import { useAppSelector } from '@store'
import { selectIsManualCheckOpen } from '@store/app/selectors'

export const ShiftDesc = () => {
  const isManualCheckOpen = useAppSelector(selectIsManualCheckOpen)

  return (
    <>
      <div className={styles.root}>
        <div className={styles.form}>
          <ShiftDocumentForm />
          <div className={styles.col}>
            <div className={styles.row}>
              <EncashmentForm />
            </div>
            <div className={styles.row}>
              <RefillForm />
            </div>
          </div>
        </div>
        <DocumentToggle />
      </div>
      {isManualCheckOpen && <Document />}
    </>
  )
}
