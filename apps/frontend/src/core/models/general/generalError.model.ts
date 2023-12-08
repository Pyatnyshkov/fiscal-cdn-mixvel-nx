export interface GeneralError {
  type?: string
  code?: string
  description: string
}

export interface GeneralErrorWithState extends GeneralError {
  deviceErrorState: boolean
}
