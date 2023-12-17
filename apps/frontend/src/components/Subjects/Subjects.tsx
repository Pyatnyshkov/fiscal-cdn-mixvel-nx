import clsx from 'clsx'
import styles from './Subjects.module.css'

import { SubjectsTable } from '@components/SubjectsTable'
import { Button } from '@components/UI/Button'
import { useAppDispatch, useAppSelector } from '@store'
import { fetchCommitSubject } from '@store/editorSubjects/thunks'
import { selectEditorSubjectsGUID } from '@store/editorSubjects/selectors'
import moment from 'moment'
import { useRef } from 'react'

interface Subjects {
  className?: string
}

export const Subjects: React.FC<Subjects> = ({ className }) => {
  const GUID = useAppSelector(selectEditorSubjectsGUID)
  const dispatch = useAppDispatch()
  const inputFile = useRef<HTMLLabelElement>(null)

  const handleCommitSubjects = () => {
    dispatch(fetchCommitSubject)
  }

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    if (inputFile.current) {
      inputFile.current.textContent = input.files?.length ? input.files[0].name : 'Выбирете файл'
    }
  }

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.panel}>
        <div className={styles.title}>Товарные позиции:</div>
      </div>

      <SubjectsTable />
      <div className={styles.buttons}>
        <div className={styles.row}>
          <Button text="Сохранить" onClick={handleCommitSubjects} className={styles.marginRight} />
          <form method="post" action="web/get" encType="multipart/form-data">
            <input type="hidden" name="guid" value={GUID} />
            <input type="hidden" name="t" value={moment().format()} />
            <Button type="submit" text="Сохранить в файл" />
          </form>
        </div>

        <form
          action="web/commit"
          method="post"
          encType="multipart/form-data"
          className={styles.row}
        >
          <input type="hidden" name="guid" value={GUID} />
          <input
            type="hidden"
            name="token"
            value={new URL(window.location.href).searchParams.get('token') || ''}
          />
          <div className={styles.inputFileWrap}>
            <label htmlFor="filetoupload" className={styles.inputFileLabel} ref={inputFile}>
              Выбирете файл
            </label>
            <input
              type="file"
              name="filetoupload"
              className={styles.inputFile}
              onChange={(e) => handleChangeFile(e)}
            />
          </div>
          <input type="hidden" name="t" value={moment().format()} />
          <Button type="submit" text="Загрузить из файла" />
        </form>
      </div>
    </div>
  )
}
