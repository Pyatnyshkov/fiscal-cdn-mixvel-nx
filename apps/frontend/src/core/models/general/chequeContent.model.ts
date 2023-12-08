import { SubjectsList } from '@models/subjects.model'

export interface ChequeContent {
  customer: {
    phone: string
    email: string
  }
  taxes: {
    vat: {
      amount: string
      type: {
        $value: string
        attributes: {
          codepage: 'fts-1.31_1#vatTaxType'
        }
      }
    }[]
  }
  payments: {
    forms: {
      electronic: {
        amount: string
      }
      cash: {
        amount: string
      }
      consideration: {
        amount: string
      }
    }
    total: {
      amount: string
    }
  }
  settlement: {
    subjects: {
      subject: SubjectsList[]
    }
  }
  taxationSystem: {
    attributes: {
      codepage: string
    }
    $value: number
  }
  correction: {
    own: {}
    forced: undefined
    reason: {
      description: string
      date: string
      documentNumber: string
    }
  }
}
