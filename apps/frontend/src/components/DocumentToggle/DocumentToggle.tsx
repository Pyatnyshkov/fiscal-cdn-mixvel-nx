import clsx from 'clsx'
import styles from './DocumentToggle.module.css'
import { useAppDispatch, useAppSelector } from '@store'
import { selectIsManualCheckOpen } from '@store/app/selectors'
import { appSlice } from '@store/app'
import { selectUiDocumentIsOpen } from '@store/ui/selectors'
import { uiSlice } from '@store/ui'

export const DocumentToggle = () => {
  const documentIsOpen = useAppSelector(selectUiDocumentIsOpen)

  const dispatch = useAppDispatch()

  return (
    <div
      className={clsx(styles.manualCheck, { [styles.manualCheckVisible]: documentIsOpen })}
      onClick={() => dispatch(uiSlice.actions.toggled())}
    >
      Ручной чек
    </div>
  )
}
