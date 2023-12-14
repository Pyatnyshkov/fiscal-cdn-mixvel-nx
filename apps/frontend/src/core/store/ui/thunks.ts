import { AppThunk } from '@store'
import { selectUiErrorMessage } from './selectors'
import { uiSlice } from '.'

export const pushError =
  (message: string): AppThunk =>
  async (dispatch, getState) => {
    const stateMessage = selectUiErrorMessage(getState())

    if (stateMessage === message) {
      return
    }

    dispatch(uiSlice.actions.error({ message }))
  }
