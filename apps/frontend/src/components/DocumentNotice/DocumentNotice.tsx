import styles from './DocumentNotice.module.css'
import { useAppDispatch, useAppSelector } from '@store'
import { createPortal } from 'react-dom'
import { selectUiErrorMessage } from '@store/ui/selectors'
import { useEffect, useState } from 'react'
import { uiSlice } from '@store/ui'

export const DocumentNotice = () => {
  const message = useAppSelector(selectUiErrorMessage)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!message) {
      return
    }
    const timerId = setTimeout(() => {
      dispatch(uiSlice.actions.removeError())
    }, 5000)
    return () => clearTimeout(timerId)
  }, [message, dispatch])

  if (!message) {
    return
  }

  return createPortal(
    <div className={styles.root}>
      <div className={styles.error}>
        <div className={styles.point}></div>
        {message}
      </div>
    </div>,
    document.body
  )
}
