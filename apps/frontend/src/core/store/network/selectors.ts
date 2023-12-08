import { RootState } from '..'

export const selectApp = (state: RootState) => state.network
export const selectSoapEndpoint = (state: RootState) => selectApp(state).soapEndpoint
export const selectIsDevelop = (state: RootState) => selectApp(state).development
