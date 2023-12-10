import { PropsWithChildren, useEffect } from 'react'
import { ShiftPage } from '@pages/ShiftPage'
import { store, useAppDispatch, useAppSelector } from '@store'
import { Provider } from 'react-redux'

import styles from './App.module.css'
import { EditorSubjectsPage } from '@pages/EditorSubjectsPage'
import { initApp } from '@store/app'
import { selectAppStarted, selectErrorMessage } from '@store/app/selectors'

// export const Auth: React.FC<PropsWithChildren> = ({ children }) => {
//   const started = useAppSelector(selectAppStarted)
//   const errorMessage = useAppSelector(selectErrorMessage)

//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     dispatch(initApp)
//   }, [])

//   if (errorMessage) {
//     return <div>{errorMessage}</div>
//   }

//   if (!started) {
//     return
//   }

//   return children
// }

export const Router: React.FC<PropsWithChildren> = ({ children }) => {
  // const shiftRoute = location.pathname.includes('subjects')
  const editorSubjectsRoute = location.pathname.includes('subjects')

  if (editorSubjectsRoute) {
    return <EditorSubjectsPage />
  }

  return <ShiftPage />
}

export const App = () => {
  return (
    <Provider store={store}>
      <div className={styles.root}>
        <Router />
      </div>
    </Provider>
  )
}
