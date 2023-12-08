import styles from './ShiftDesc.module.css'

import { ManualCheck } from '../ManualCheck'
import { ShiftDocumentForm } from '../Forms/ShiftForm'
import { EncashmentForm } from '../Forms/EncashmentForm'
import { RefillForm } from '../Forms/RefillForm'
import { ManualCheckToggle } from '../ManualCheckToggle'
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
        <ManualCheckToggle />
      </div>
      {isManualCheckOpen && <ManualCheck />}
    </>
  )
}
