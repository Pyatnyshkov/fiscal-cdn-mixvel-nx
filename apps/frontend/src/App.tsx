import { PropsWithChildren, useEffect } from 'react'
import { ShiftPage } from '@pages/ShiftPage'
import { store, useAppDispatch, useAppSelector } from '@store'
import { Provider } from 'react-redux'

import styles from './App.module.css'
import { SubjectsPage } from '@pages/SubjectsPage'
import { initApp } from '@store/app'
import { selectAppStarted, selectErrorMessage } from '@store/app/selectors'

export const Auth: React.FC<PropsWithChildren> = ({ children }) => {
  const started = useAppSelector(selectAppStarted)
  const errorMessage = useAppSelector(selectErrorMessage)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initApp)
  }, [])

  if (errorMessage) {
    return <div>{errorMessage}</div>
  }

  if (!started) {
    return
  }

  return children
}

export const App = () => {
  return (
    <Provider store={store}>
      <Auth>
        <div className={styles.root}>
          {/* <ShiftPage /> */}
          <SubjectsPage />
        </div>
      </Auth>
    </Provider>
  )
}
