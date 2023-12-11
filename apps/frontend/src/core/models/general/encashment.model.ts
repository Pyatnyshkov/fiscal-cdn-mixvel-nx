export interface EncashmentOperation {
  request: {
    amount: string
    operatorName: string
  }
  response: {
    amountBefore: number
    amountAfter: number
  }
}
