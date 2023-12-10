import { ChequeModel } from '@models/cheque.model'
import { Instructions } from './instructions.model'
import { TaxPayer } from './taxPayer.model'
import { CorrectionCheque } from './correctionCheque.model'

export interface DocumentCorrectionCheque {
  attributes: {
    id: string
  }
  taxPayer: TaxPayer
  instructions: Instructions
  document: {
    correctionCheque: ChequeModel & CorrectionCheque
  }
}
