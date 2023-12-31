import clsx from 'clsx'
import { Button } from '../UI/Button'
import { Input } from '../UI/Input'

import styles from './Shift.module.css'
import { Notices } from '../Notices'
import { useAppDispatch, useAppSelector } from '@store'
import {
  selectShiftCashier,
  selectShiftOpened,
  selectIgnoreOpenShiftButtonClick,
  selectIgnoreCloseShiftButtonClick,
} from '@store/app/selectors'
import { closeShiftAction, openShiftAction } from '@store/app/thunks'
import { Alert } from '@components/Alert'
import { Modal } from '@components/Modal'
import { useState } from 'react'
import { FiscalDocument } from '@components/FiscalDocument'

export const Shift = () => {
  const shiftOpened = useAppSelector(selectShiftOpened)
  const ignoreOpenShiftButtonClick = useAppSelector(selectIgnoreOpenShiftButtonClick)
  const ignoreCloseShiftButtonClick = useAppSelector(selectIgnoreCloseShiftButtonClick)
  const { fullName, tin } = useAppSelector(selectShiftCashier)

  const dispatch = useAppDispatch()

  const handleShiftOpen = () => {
    if (shiftOpened) {
      dispatch(closeShiftAction)
      return
    }
    dispatch(openShiftAction)
  }

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <div className={styles.col}>
          <h1 className={styles.title}>{!shiftOpened ? 'Смена закрыта' : 'Смена открыта'}</h1>
          <Button
            text={!shiftOpened ? 'Открыть смену' : 'Закрыть смену'}
            onClick={handleShiftOpen}
            disabled={ignoreOpenShiftButtonClick || ignoreCloseShiftButtonClick}
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
            classNameLabel={styles.widthLabel}
            disabled
          />
          <Input name="inn" label="ИНН" value={tin} classNameInput={styles.inputWidth} disabled />
        </div>
        <div className={clsx(styles.col, styles.error)}>
          <Alert />
        </div>
      </div>
    </div>
  )
}
