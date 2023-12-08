import { SubjectOptions } from '@components/ChequeTableItem/const'
import { AgentRoleOptions } from '@consts/agentRole'
import { SignsMethodOptions } from '@consts/signsMethod.const'

import { TaxesOptions } from '@consts/taxes.const'

export interface Subjects {
  loadFailed: boolean
  requestStarted: boolean
  nextReloadSeconds: number
  subjectsLoaded: boolean
  identification: {
    guid: string
  }
  subjects: SubjectsList[]
  subjectsList?: '<select class="subjectsListSelect"><option value="0">Hellblade</option><option value="1">Pookmon</option></select>'
}

export interface SubjectsList {
  name: string
  price: string
  quantity: string
  measure: string
  taxes: {
    vat: [
      {
        amount: 0
        type: {
          $value: keyof typeof TaxesOptions
          attributes: {
            codepage: 'fts-1.31_1#vatTaxType'
          }
        }
      }
    ]
  }
  agent: {
    role: {
      $value: keyof typeof AgentRoleOptions
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
      $value: keyof typeof SignsMethodOptions
    }
    method: {
      attributes: {
        codepage: 'fts-1.31_1#featureOfSettlementMethod'
      }
      $value: keyof typeof SignsMethodOptions
    }
  }
  restrictions: {
    taxationSystems: {
      taxationSystem: [
        {
          type: {
            $value: '0'
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
  amount: string
}
