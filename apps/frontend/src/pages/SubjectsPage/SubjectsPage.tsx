import { Subjects } from '@components/Subjects'
import styles from './SubjectsPage.module.css'

import { Shift } from '@components/Shift'

export const SubjectsPage = () => {
  return (
    <div className={styles.root}>
      <Shift />
      <Subjects />
    </div>
  )
}
