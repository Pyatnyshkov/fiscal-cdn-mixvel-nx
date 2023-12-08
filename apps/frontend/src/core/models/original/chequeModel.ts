interface chequeModel {
  taxPayer: {
    tin: string
    name: string
  }
  cashier: {
    tin: string
    fullName: string
  }
  chequeContent: {
    customer: {
      phone: string
      email: string
    }
    taxes: {
      vat: unknown[]
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
        subject: unknown[]
      }
    }
    taxationSystem: {
      attributes: {
        codepage: string
      }
      $value: number
    }
  }
  copies: number
  chequeType: 'credit' | 'debit' | 'creditReturn' | 'debitReturn'
  document: {
    cheque: {}
  }
  pointOfSettlement: {
    address: string
  }
  totalAmount: number
  taxationSystem: {
    attributes: {
      codepage: string
    }
    $value: number
  }
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
    documentReferenceNumber: number
    payments: {
      forms: {
        electronic: {
          maskedCardPAN: string
        }
      }
    }
  }
}
