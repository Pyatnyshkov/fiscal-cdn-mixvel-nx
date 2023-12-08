import { Cashier } from './cashier.model'
import { TaxPayer } from './taxPayer.model'
import { TaxationSystem } from './taxationSystem.model'

export interface CorrectionCheque {
  taxPayer: TaxPayer
  cashier: Cashier
  type: 'credit'
  ownOrForced: 'own'

  taxationSystem: TaxationSystem
  taxation: {
    enabledTaxationSystems: {}
  }
  issueResult: {}
  correctionChequeTaxationSystemsHTML: ''
  correctionChequeTypes: ['credit', 'debit']
}
