import styles from './ShiftPage.module.css'

import { Shift } from '@components/Shift'
import { ShiftDesc } from '@components/ShiftDesc'

import { useAppDispatch, useAppSelector } from '@store'
import { selectAppStarted, selectErrorMessage, selectShiftOpened } from '@store/app/selectors'
import { initApp } from '@store/app/thunks'
import { useEffect } from 'react'

export const ShiftPage = () => {
  const shiftOpened = useAppSelector(selectShiftOpened)

  const started = useAppSelector(selectAppStarted)
  const errorMessage = useAppSelector(selectErrorMessage)

  const dispatch = useAppDispatch()

  useEffect(() => {
    document.title = 'Shift'
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
