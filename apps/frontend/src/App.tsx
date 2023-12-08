import { ShiftPage } from '@pages/ShiftPage'
import { store } from '@store'
import { Provider } from 'react-redux'

import styles from './App.module.css'

export const App = () => {
  return (
    <Provider store={store}>
      {/* добавить старт провайдр  */}
      <div className={styles.root}>
        <ShiftPage />
      </div>
    </Provider>
  )
}
