import styles from './ShiftDesc.module.css'

import { Document } from '../Document'
import { ShiftDocumentForm } from '../DocumentForms/ShiftForm'
import { EncashmentForm } from '../DocumentForms/EncashmentForm'
import { RefillForm } from '../DocumentForms/RefillForm'
import { DocumentToggle } from '../DocumentToggle'
import { useAppSelector } from '@store'
import { selectIsManualCheckOpen } from '@store/app/selectors'
import { selectUiDocumentIsOpen } from '@store/ui/selectors'

export const ShiftDesc = () => {
  const documentIsOpen = useAppSelector(selectUiDocumentIsOpen)

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
      {documentIsOpen && <Document />}
    </>
  )
}
