import clsx from 'clsx'
import styles from './ManualCheckToggle.module.css'
import { useAppDispatch, useAppSelector } from '@store'
import { selectIsManualCheckOpen } from '@store/app/selectors'
import { appSlice } from '@store/app'

export const ManualCheckToggle = () => {
  const isManualCheckOpen = useAppSelector(selectIsManualCheckOpen)

  const dispatch = useAppDispatch()

  return (
    <div
      className={clsx(styles.manualCheck, { [styles.manualCheckVisible]: isManualCheckOpen })}
      onClick={() => dispatch(appSlice.actions.toggleManualCheck())}
    >
      Ручной чек
    </div>
  )
}
