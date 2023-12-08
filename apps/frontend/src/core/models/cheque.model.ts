import { Cashier } from './general/cashier.model'
import { ChequeContent } from './general/chequeContent.model'
import { PointOfSettlement } from './general/pointOfSettlement.model'
import { TaxPayer } from './general/taxPayer.model'
import { TaxationSystem } from './general/taxationSystem.model'

export interface ChequeModel {
  credit?: ChequeContent
  debit?: ChequeContent
  creditReturn?: ChequeContent
  debitReturn?: ChequeContent
  taxPayer: TaxPayer
  cashier: Cashier
  chequeContent: ChequeContent
  copies: number
  chequeType: 'credit' | 'debit' | 'creditReturn' | 'debitReturn'
  document: {
    cheque: {}
  }
  pointOfSettlement: PointOfSettlement
  totalAmount: number
  taxationSystem: TaxationSystem
  issueResult: {}
  issueError: {}
  instructions: {
    deviceRouting: {}
    responseDelivery: {}
  }
  taxation: {
    enabledTaxationSystems: {}
  }
  id: number
  sendButtonDisabled: false
  paymentForm: string
  printoutInjections: {
    documentReferenceNumber: string
    payments: {
      forms: {
        electronic: {
          maskedCardPAN: string
          amount: string
        }
        cash: {
          amount: string
        }
        consideration: {
          amount: string
        }
      }
    }
  }
}