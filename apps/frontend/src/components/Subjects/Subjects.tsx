import clsx from 'clsx'
import styles from './Subjects.module.css'

import { SubjectsTable } from '@components/SubjectsTable'
import { Button } from '@components/UI/Button'
import { useAppDispatch, useAppSelector } from '@store'
import { fetchCommitSubject } from '@store/editorSubjects/thunks'
import { selectEditorSubjectsGUID } from '@store/editorSubjects/selectors'
import moment from 'moment'

interface Subjects {
  className?: string
}

export const Subjects: React.FC<Subjects> = ({ className }) => {
  const GUID = useAppSelector(selectEditorSubjectsGUID)
  const dispatch = useAppDispatch()

  const handleCommitSubjects = () => {
    dispatch(fetchCommitSubject)
  }
  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.panel}>
        <h1 className={styles.title}>Товарные позиции:</h1>
      </div>

      <SubjectsTable />
      <div>
        <Button text="Сохранить" onClick={handleCommitSubjects} />
        <form method="post" action="web/get" encType="multipart/form-data">
          <input type="hidden" name="guid" value={GUID} className="guid" />
          <input type="hidden" name="t" value={moment().format()} className="random" />
          <Button type="submit" text="Сохранить в файл" />
        </form>
        <form action="web/commit" method="post" encType="multipart/form-data">
          <input type="hidden" name="guid" value={GUID} className="guid" />
          <input
            type="hidden"
            name="token"
            value={new URL(location.href).searchParams.get('token') || ''}
            className="token"
          />
          <input type="file" name="filetoupload" />
          <input type="hidden" name="t" value={moment().format()} className="random" />
          <Button type="submit" text="Загрузить из файла" />
        </form>
      </div>
    </div>
  )
}
