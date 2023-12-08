import { ErrorModel } from './error.model'

export interface IRefillOperationModel {
  request: {
    amount: string
    operatorName: string
  }
  error: ErrorModel
}
