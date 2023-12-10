import { Subjects } from '@components/Subjects'
import styles from './EditorSubjectsPage.module.css'

import { useAppDispatch } from '@store'
import { useEffect } from 'react'
import { initEditorSubjects } from '@store/editorSubjects'

export const EditorSubjectsPage = () => {
  // const shiftOpened = useAppSelector(selectShiftOpened)

  // const started = useAppSelector(selectAppStarted)
  // const errorMessage = useAppSelector(selectErrorMessage)

  const dispatch = useAppDispatch()

  useEffect(() => {
    document.title = 'EditorSubjects'
    dispatch(initEditorSubjects)
  }, [])

  // if (errorMessage) {
  //   return <div>{errorMessage}</div>
  // }

  // if (!started) {
  //   return
  // }

  return (
    <div className={styles.root}>
      <Subjects />
    </div>
  )
}
