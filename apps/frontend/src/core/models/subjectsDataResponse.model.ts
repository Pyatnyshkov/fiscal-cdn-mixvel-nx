import {
  AgentRole,
  AgentRoleValue,
  SignsMethod,
  SignsMethodValue,
  SignsSubject,
  SignsSubjectValue,
  Taxes,
  TaxesValue,
} from '@consts'

export interface SubjectsDataResponse {
  name: string
  price: string
  quantity: string
  measure: string
  taxes: {
    vat: [
      {
        amount: string
        type: {
          $value: TaxesValue
          attributes: {
            codepage: 'fts-1.31_1#vatTaxType'
          }
        }
      }
    ]
  }
  agent?: {
    role: {
      $value: AgentRoleValue
      attributes: {
        codepage: 'fts-1.31_1#agentMode'
      }
    }
  }
  signs: {
    subject: {
      attributes: {
        codepage: 'fts-1.31_1#type'
      }
      $value: SignsSubjectValue
    }
    method: {
      attributes: {
        codepage: 'fts-1.31_1#featureOfSettlementMethod'
      }
      $value: SignsMethodValue
    }
  }
  restrictions?: {
    taxationSystems: {
      taxationSystem: [
        {
          type: {
            $value: string
            attributes: {
              codepage: 'fts-1.31_1#taxationSystem'
            }
          }
        }
      ]
    }
  }
  supplier?: {
    name: string
    tin: string
  }
  department?: {
    code: string
    title: string
  }
}
