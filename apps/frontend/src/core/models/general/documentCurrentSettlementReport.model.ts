import { Cashier } from './cashier.model'
import { Instructions } from './instructions.model'
import { TaxPayer } from './taxPayer.model'

export interface DocumentCurrentSettlementReport {
  attributes: {
    id: string
  }
  taxPayer: TaxPayer
  instructions: Instructions
  document: {
    currentSettlementReport: {}
  }
}
