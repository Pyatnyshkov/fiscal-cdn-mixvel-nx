import { Cashier } from './cashier.model'
import { TaxPayer } from './taxPayer.model'
import { TaxationSystemModel } from './taxationSystem.model'

export interface CorrectionCheque {
  taxPayer: TaxPayer
  cashier: Cashier
  type: 'credit'
  ownOrForced: 'own'

  taxationSystem: TaxationSystemModel
  taxation: {
    enabledTaxationSystems: Record<string, string>
  }
  issueResult: Record<string, string>
  correctionChequeTaxationSystemsHTML: ''
  correctionChequeTypes: ['credit', 'debit']
}
