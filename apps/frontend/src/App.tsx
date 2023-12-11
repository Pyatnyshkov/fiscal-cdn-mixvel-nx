import { ShiftPage } from '@pages/ShiftPage'
import { store } from '@store'
import { Provider } from 'react-redux'

import styles from './App.module.css'
import { EditorSubjectsPage } from '@pages/EditorSubjectsPage'

export const Router = () => {
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
