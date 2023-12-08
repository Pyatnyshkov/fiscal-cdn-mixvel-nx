import styles from './ManualCheck.module.css'
import { ManualCheckTotal } from '../ManualCheckTotal'

import { ChequeForm } from '../Forms/ChequeForm'
import { Table } from '../Table'

export const ManualCheck = () => {
  return (
    <div className={styles.root}>
      <div className={styles.form}>
        <ChequeForm />
        <div className={styles.col}>
          <ManualCheckTotal />
        </div>
      </div>
      <Table className={styles.productMarginBottom} />
    </div>
  )
}
