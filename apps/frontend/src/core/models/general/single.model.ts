type PureObject = Record<string, string>

export interface Single2 {
  currentShift: {
    openShiftReport: {
      shift: {
        number: string
      }
      fiscalNumber: string
      fiscalSignature: string
      cashRegister: {
        authority: {
          registrationNumber: string
        }
        fiscalStorage: {
          factoryNumber: string
        }
        factoryNumber: string
      }
    }
  }
  currentRegistration: {
    registrationReport: {
      taxationSystems: {
        taxationSystem: [
          {
            attributes: {
              codepage: string
            }
            $value: number
          }
        ]
      }
      taxPayer: {
        tin: string
        name: string
      }
      pointOfSettlement: {
        address: string
      }
    }
  }
  allowedOperations: {
    issueDocuments: {
      closeShift: PureObject
      cheque: {
        credit: PureObject
        debit: PureObject
        creditReturn: PureObject
        debitReturn: PureObject
      }
      currentSettlementReport: PureObject
    }
    encashment: PureObject
    refill: PureObject
    flowStatementsReport: PureObject
  }
  departments: []
  printoutCopies: {
    issueDocuments: {
      cheque: {
        credit: PureObject
        debit: PureObject
        creditReturn: PureObject
        debitReturn: PureObject
      }
    }
  }
  availableServices: {
    issueDocuments: {
      soap: {
        service: {
          url: string
        }
      }
    }
    operations: {
      soap: {
        service: {
          url: string
        }
      }
    }
    subjectsEditor: {
      soap: {
        service: {
          url: string
        }
      }
      web: {
        site: {
          url: string
        }
      }
    }
    responseDeliveryGateway: {
      socketio: {
        service: {
          namespace: string
          url: string
          path: string
        }
      }
    }
  }
  shiftNumber: string
  fiscalNumber: string
  fiscalSignature: string
  cashRegister: {
    authority: {
      registrationNumber: string
    }
    fiscalStorage: {
      factoryNumber: string
    }
    factoryNumber: string
  }
}
