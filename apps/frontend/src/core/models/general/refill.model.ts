export interface RefillOperation {
  request: {
    amount: string
    operatorName: string
  }
  response: {
    amountBefore: number
    amountAfter: number
  }
}
