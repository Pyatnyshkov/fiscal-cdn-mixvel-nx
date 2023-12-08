import { OpenShift } from '@models/app.model'
import { Cashier } from '@models/general/cashier.model'
import { GeneralError } from '@models/general/generalError.model'
import { Instructions } from '@models/general/instructions.model'
import { PointOfSettlement } from '@models/general/pointOfSettlement.model'
import { Single2 } from '@models/general/single.model'
import { TaxPayer } from '@models/general/taxPayer.model'

export interface AppMM {
  started: true
  guid: '70b2f7b7-2a73-0b45-93ea-8b03a228211a'
  taxPayer: {
    tin: ''
    name: 'Борисов Алексей'
  }
  cashier: {
    tin: ''
    fullName: 'Борисов Алексей'
  }
  pointOfSettlement: {
    address: 'г Москва, Шелепихинская наб, д 34 к 3, кв 420'
  }
  taxationSystem: {
    attributes: {
      codepage: 'fts-1.31_1#taxationSystem'
    }
    $value: 0
  }
  allowedOperationsModel: {
    issueDocuments: {
      closeShift: {}
      cheque: {
        credit: {}
        debit: {}
        creditReturn: {}
        debitReturn: {}
      }
      currentSettlementReport: {}
    }
    encashment: {}
    refill: {}
    flowStatementsReport: {}
  }
  instructions: {
    deviceRouting: {
      cashRegistersService: {
        messagingBroker: {
          url: 'amqp://aqsi-fh.scenarios.inbound:KyY9UbvDKV1@vv-bunny-03.sirena-travel.ru/AQSI'
          amqp: {
            exchange: 'devices'
          }
        }
        cashRegister: {
          serialNumber: '1002749096001528'
          vendor: 'AQSI'
        }
      }
    }
    responseDelivery: {
      socketio: {
        client: {
          guid: '70b2f7b7-2a73-0b45-93ea-8b03a228211a'
          zoneId: '1'
        }
      }
    }
  }
  shift: {
    state: {
      dataLoaded: true
      status: 'opened'
      opened: true
    }
    cashier: {
      tin: ''
      fullName: 'Борисов Алексей'
    }
    single: {
      currentShift: {
        openShiftReport: {
          shift: {
            number: '21'
          }
          fiscalNumber: '58'
          fiscalSignature: '76901938'
          cashRegister: {
            authority: {
              registrationNumber: '7049400025059324'
            }
            fiscalStorage: {
              factoryNumber: '7575757575757575'
            }
            factoryNumber: '7575757575757575'
          }
        }
      }
      currentRegistration: {
        registrationReport: {
          taxationSystems: {
            taxationSystem: [
              {
                attributes: {
                  codepage: 'fts-1.31_1'
                }
                $value: 0
              }
            ]
          }
          taxPayer: {
            tin: '7734473613'
            name: 'МИКСВЕЛ'
          }
          pointOfSettlement: {
            address: 'г Москва, Шелепихинская наб, д 34 к 3, кв 420'
          }
        }
      }
      allowedOperations: {
        issueDocuments: {
          closeShift: {}
          cheque: {
            credit: {}
            debit: {}
            creditReturn: {}
            debitReturn: {}
          }
          currentSettlementReport: {}
        }
        encashment: {}
        refill: {}
        flowStatementsReport: {}
      }
      departments: []
      printoutCopies: {
        issueDocuments: {
          cheque: {
            credit: {}
            debit: {}
            creditReturn: {}
            debitReturn: {}
          }
        }
      }
      availableServices: {
        issueDocuments: {
          soap: {
            service: {
              url: 'https://taxserver.sirena-travel.ru/fh/documents/v2'
            }
          }
        }
        operations: {
          soap: {
            service: {
              url: 'https://taxserver.sirena-travel.ru/fh/operations/v1'
            }
          }
        }
        subjectsEditor: {
          soap: {
            service: {
              url: 'https://taxserver.sirena-travel.ru/fh/subjects/v1'
            }
          }
          web: {
            site: {
              url: 'https://taxserver.sirena-travel.ru/fh/subjects/index.html?guid=$guid$&token=JTVCJTVE'
            }
          }
        }
        responseDeliveryGateway: {
          socketio: {
            service: {
              url: 'https://taxserver.sirena-travel.ru'
              path: '/fh/documents/socketio'
            }
          }
        }
      }
      shiftNumber: '21'
      fiscalNumber: '58'
      fiscalSignature: '76901938'
      cashRegister: {
        authority: {
          registrationNumber: '7049400025059324'
        }
        fiscalStorage: {
          factoryNumber: '7575757575757575'
        }
        factoryNumber: '7575757575757575'
      }
    }
    deviceRouting: {
      cashRegistersService: {
        messagingBroker: {
          url: 'amqp://aqsi-fh.scenarios.inbound:KyY9UbvDKV1@vv-bunny-03.sirena-travel.ru/AQSI'
          amqp: {
            exchange: 'devices'
          }
        }
        cashRegister: {
          serialNumber: '1002749096001528'
          vendor: 'AQSI'
        }
      }
    }
    responseDelivery: {
      socketio: {
        client: {
          guid: '70b2f7b7-2a73-0b45-93ea-8b03a228211a'
          zoneId: '1'
        }
      }
    }
    guid: '70b2f7b7-2a73-0b45-93ea-8b03a228211a'
  }
  taxation: {
    enabledTaxationSystems: {
      '0': 'общая СН'
    }
  }
  activeServices: {
    deviceRoute: true
    webSocket: true
    subjects: true
  }
}

export interface ApplicationModel {
  started: boolean
  guid: string
  taxPayer: TaxPayer
  cashier: Cashier
  pointOfSettlement: PointOfSettlement
  taxationSystem: {
    attributes: {
      codepage: string
    }
    $value: number
  }
  allowedOperationsModel: Single2['allowedOperations']
  instructions: Instructions
  shift: OpenShift
  taxation: {
    enabledTaxationSystems: {}
  }
  activeServices: {
    deviceRoute: boolean
    webSocket: boolean
    subjects: boolean
  }
  generalError: GeneralError
  agent?: {
    roles: {}
  }
}
