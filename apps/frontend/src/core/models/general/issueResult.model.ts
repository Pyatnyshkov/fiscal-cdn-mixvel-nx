export interface IssueResult {
  document: {
    dateTime: string
    sequenceNumber: number
    fiscalSignature: number
    fiscalNumber: number
    cheque: {
      shift: {
        number: number
      }
    }
  }
}
