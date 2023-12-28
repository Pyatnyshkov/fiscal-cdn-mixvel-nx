import { RootState } from '..'

export const selectNetwork = (state: RootState) => state.network
export const selectSoapEndpoint = (state: RootState) => selectNetwork(state).soapEndpoint
export const selectWebEndpoint = (state: RootState) => selectNetwork(state).subjectsWebEndpoint