import { ShiftPage } from '@pages/ShiftPage'
import { store, useAppSelector } from '@store'
import { Provider } from 'react-redux'

import styles from './App.module.css'
import { EditorSubjectsPage } from '@pages/EditorSubjectsPage'
import { ErrorPage } from '@pages/ErrorPage'

import { DocumentNotice } from '@components/DocumentNotice'
import { selectUiHasGlobalError } from '@store/ui/selectors'
import { FiscalDocument } from '@components/FiscalDocument'

export const Router = () => {
  const hasGlobalError = useAppSelector(selectUiHasGlobalError)
  const editorSubjectsRoute = window.location.pathname.includes('subjects')

  if (hasGlobalError) {
    return <ErrorPage />
  }

  return editorSubjectsRoute ? <EditorSubjectsPage /> : <ShiftPage />
}

export const App = () => {
  return (
    <Provider store={store}>
      <div className={styles.root}>
        <Router />
        <DocumentNotice />
        <FiscalDocument />
      </div>
    </Provider>
  )
}
