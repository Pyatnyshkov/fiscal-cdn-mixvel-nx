import { ChequeModel } from '@models/cheque.model'
import { TaxPayer } from './taxPayer.model'
import { Instructions } from './instructions.model'
import { Cashier } from './cashier.model'
import { CorrectionCheque } from './correctionCheque.model'

export interface DocumentModel {
  taxPayer: TaxPayer
  document: {
    cheque: ChequeModel
    closeShiftReport: {
      cashier: Cashier
    }
    correctionCheque: ChequeModel & CorrectionCheque
    currentSettlementReport: {}
  }
  chequeType: 'credit' | 'debit' | 'creditReturn' | 'debitReturn'
  copies: string
  attributes: {
    id: number
  }
  instructions: Instructions
  printoutInjections: ChequeModel['printoutInjections']
}
