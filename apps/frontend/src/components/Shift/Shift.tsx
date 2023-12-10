import clsx from 'clsx'
import { Button } from '../UI/Button'
import { Input } from '../UI/Input'

import styles from './Shift.module.css'
import { Notices } from '../Notices'
import { useAppDispatch, useAppSelector } from '@store'
import { selectShiftCashier, selectShiftOpened } from '@store/app/selectors'
import { fetchAppData } from '@store/app'

export const Shift = () => {
  const shiftOpened = useAppSelector(selectShiftOpened)
  const { fullName, tin } = useAppSelector(selectShiftCashier)

  const dispatch = useAppDispatch()

  const handleShiftOpen = () => {
    if (shiftOpened) {
      // dispatch(f)
      return
    }
    dispatch(fetchAppData)
  }

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <div className={styles.col}>
          <h1 className={styles.title}>{!shiftOpened ? 'Смена закрыта' : 'Смена открыта'}</h1>
          <Button
            text={!shiftOpened ? 'Открыть смену' : 'Закрыть смену'}
            onClick={handleShiftOpen}
          />
        </div>
        <div className={clsx(styles.col, styles.notice)}>
          <Notices />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.col}>
          <Input
            name="name.fdfd"
            label="ФИО кассира"
            value={fullName}
            className={styles.inputMargin}
            disabled
          />
          <Input name="inn" label="ИНН" value={tin} classNameInput={styles.inputWidth} disabled />
        </div>
      </div>
    </div>
  )
}
