import { AgentRoleValue, SignsMethodValue, SignsSubjectValue, TaxesValue } from '@consts'
import { SubjectsDataResponse } from './subjects.data.response.model'
import { TaxationSystemModel } from '@models/general/taxationSystem.model'

export interface SubjectsEditorDataRequest {
  name: string
  price: string
  quantity: string
  measure: string
  taxes: {
    vat: [
      {
        type: {
          $value: TaxesValue
          attributes: {
            codepage: 'fts-1.31_1#vatTaxType'
          }
        }
      }
    ]
  }
  agent: {
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
  }
  restrictions: {
    taxationSystems: {
      taxationSystem: TaxationSystemModel[]
    }
  }
  supplier: {
    name: string
    tin: string
  }
  department: {
    code: string
    title: string
  }
}
