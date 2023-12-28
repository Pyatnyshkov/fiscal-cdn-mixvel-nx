import { useAppSelector } from '@store'
import styles from './ErrorPage.module.css'
import { selectUiGlobalError } from '@store/ui/selectors'

export const ErrorPage = () => {
  const { type, reason } = useAppSelector(selectUiGlobalError)

  return (
    <h2>
      При загрузке страницы произошла ошибка
    </h2>
  )
}
