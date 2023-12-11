import { Cashier } from './general/cashier.model'
import { ChequeContent } from './general/chequeContent.model'
import { PointOfSettlement } from './general/pointOfSettlement.model'
import { TaxPayer } from './general/taxPayer.model'
import { TaxationSystemModel } from './general/taxationSystem.model'

export interface ChequeModel {
  credit?: ChequeContent
  debit?: ChequeContent
  creditReturn?: ChequeContent
  debitReturn?: ChequeContent
  taxPayer: TaxPayer
  cashier: Cashier
  chequeContent: ChequeContent
  copies: string
  chequeType: 'credit' | 'debit' | 'creditReturn' | 'debitReturn'
  document: {
    cheque: Record<string, string>
  }
  pointOfSettlement: PointOfSettlement
  totalAmount: number
  taxationSystem: TaxationSystemModel['type']
  issueResult: Record<string, string>
  issueError: Record<string, string>
  instructions: {
    deviceRouting: Record<string, string>
    responseDelivery: Record<string, string>
  }
  taxation: {
    enabledTaxationSystems: Record<string, string>
  }
  id: number
  sendButtonDisabled: boolean
  sendButtonVisible: boolean
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
