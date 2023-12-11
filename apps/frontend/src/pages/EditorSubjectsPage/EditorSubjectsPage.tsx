import { Subjects } from '@components/Subjects'
import styles from './EditorSubjectsPage.module.css'

import { useAppDispatch } from '@store'
import { useEffect } from 'react'
import { initEditorSubjects } from '@store/editorSubjects'

export const EditorSubjectsPage = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    document.title = 'Editor'
    dispatch(initEditorSubjects)
  }, [dispatch])

  return (
    <div className={styles.root}>
      <Subjects />
    </div>
  )
}
