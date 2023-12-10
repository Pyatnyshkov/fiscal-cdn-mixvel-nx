import { Cashier } from './cashier.model'
import { ChequeContent } from './chequeContent.model'
import { PointOfSettlement } from './pointOfSettlement.model'

export interface DocumentCheque {
  credit?: ChequeContent
  debit?: ChequeContent
  creditReturn?: ChequeContent
  debitReturn?: ChequeContent
  cashier: Cashier
  pointOfSettlement: PointOfSettlement
}
