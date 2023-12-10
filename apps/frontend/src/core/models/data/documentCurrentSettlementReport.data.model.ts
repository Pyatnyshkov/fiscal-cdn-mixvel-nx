import { Instructions } from '@models/general/instructions.model'
import { TaxPayer } from '@models/general/taxPayer.model'

export interface DocumentCurrentSettlementReportData {
  attributes: {
    id: string
  }
  taxPayer: TaxPayer
  instructions: Instructions
  document: {
    currentSettlementReport: {}
  }
}
