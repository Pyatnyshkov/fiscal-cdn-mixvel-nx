import { ChequeModel } from '@models/cheque.model'
import { TaxPayer } from './taxPayer.model'
import { Instructions } from './instructions.model'

import { DocumentCheque } from './documentCheque.model'

export interface DocumentModel {
  taxPayer: TaxPayer
  document: {
    cheque: DocumentCheque
  }
  chequeType: 'credit' | 'debit' | 'creditReturn' | 'debitReturn'
  copies: string
  attributes: {
    id: string
  }
  instructions: Instructions
  printoutInjections: ChequeModel['printoutInjections']
}
