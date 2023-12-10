import styles from './ShiftPage.module.css'

import { Shift } from '@components/Shift'
import { ShiftDesc } from '@components/ShiftDesc'

import { useAppSelector } from '@store'
import { selectShiftOpened } from '@store/app/selectors'

export const ShiftPage = () => {
  const shiftOpened = useAppSelector(selectShiftOpened)

  return (
    <div className={styles.root}>
      <Shift />
      {shiftOpened && <ShiftDesc />}
    </div>
  )
}
