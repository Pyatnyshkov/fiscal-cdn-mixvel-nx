import { TaxationSystems } from '@consts/taxationSystems.const'

export interface TaxationSystem {
  attributes: {
    codepage: string
  }
  $value: keyof typeof TaxationSystems
}
