import { useAppSelector } from '@store'
import { selectAppError } from '@store/app/selectors'

import styles from './Alert.module.css'

export const Alert = () => {
  const { type, code, description } = useAppSelector(selectAppError)

  if (!description) {
    return
  }

  return (
    <div className={styles.root}>
      <div className={styles.point}></div>
      {description}
    </div>
  )
}
