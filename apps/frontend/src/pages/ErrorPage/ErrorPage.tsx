import { useAppSelector } from '@store'
import styles from './ErrorPage.module.css'
import { selectUiGlobalError } from '@store/ui/selectors'

export const ErrorPage = () => {
  const { type, reason } = useAppSelector(selectUiGlobalError)

  return (
    <div className={styles.root}>
      <div className={styles.error}>
        <div className={styles.point}></div>
        {reason}
      </div>
    </div>
  )
}
