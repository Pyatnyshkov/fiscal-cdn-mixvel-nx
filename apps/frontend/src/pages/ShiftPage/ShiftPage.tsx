import { useEffect } from 'react'
import styles from './ShiftPage.module.css'

import { useAppDispatch, useAppSelector } from '@store'
import { selectAppStarted, selectErrorMessage, selectShiftOpened } from '@store/app/selectors'
import { initApp } from '@store/app'

import { Shift } from '@components/Shift'
import { ShiftDesc } from '@components/ShiftDesc'

export const ShiftPage = () => {
  const started = useAppSelector(selectAppStarted)
  const shiftOpened = useAppSelector(selectShiftOpened)
  const errorMessage = useAppSelector(selectErrorMessage)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initApp)
  }, [])

  if (errorMessage) {
    return <div>{errorMessage}</div>
  }

  if (!started) {
    return
  }

  return (
    <div className={styles.root}>
      <Shift />
      {shiftOpened && <ShiftDesc />}
    </div>
  )
}
