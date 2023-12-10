import { App } from '@models/app.model'

export const initialState: App = {
  deviceRouteStatus: {
    requestStarted: false,
    requestFailed: false,
    loaded: false,
    nextReloadSeconds: undefined,
    reloadDeviceStatusRetries: 0,
    reloadDeviceStatusMaxRetries: 0,
    reloadDeviceStatusTimeout: 0,
    loadFailed: false,
    fail: false,
    error: {
      code: '',
      description: '',
      deviceErrorState: false,
    },
  },
  started: false,
  attributes: {
    id: '',
  },
  guid: '',
  taxPayer: {
    tin: '',
    name: '',
  },
  cashier: {
    tin: '',
    fullName: '',
  },
  taxationSystem: {
    attributes: {
      codepage: 'fts-1.31_1#taxationSystem',
    },
    $value: '0',
  },
  pointOfSettlement: {
    address: '',
  },
  instructions: {
    deviceRouting: {
      cashRegistersService: {
        messagingBroker: {
          url: '',
          amqp: {
            exchange: 'devices',
          },
        },
        cashRegister: {
          serialNumber: '',
          vendor: 'AQSI',
        },
      },
    },
    responseDelivery: {
      socketio: {
        client: {
          guid: '',
          zoneId: '',
        },
      },
    },
  },
  shift: {
    state: {
      closed: false,
      dataLoaded: false,
      status: 'closed',
      opened: false,
    },
    single: {
      currentShift: {
        openShiftReport: {
          shift: {
            number: '',
          },
          fiscalNumber: '',
          fiscalSignature: '',
          cashRegister: {
            authority: {
              registrationNumber: '',
            },
            fiscalStorage: {
              factoryNumber: '',
            },
            factoryNumber: '',
          },
        },
      },
      currentRegistration: {
        registrationReport: {
          taxationSystems: {
            taxationSystem: [],
          },
          taxPayer: {
            tin: '',
            name: '',
          },
          pointOfSettlement: {
            address: '',
          },
          agent: {
            roles: {},
          },
        },
      },
      allowedOperations: {
        issueDocuments: {
          closeShift: {},
          cheque: {
            credit: {},
            debit: {},
            creditReturn: {},
            debitReturn: {},
          },
          currentSettlementReport: {},
        },
        encashment: {
          request: {
            amount: '',
            operatorName: '',
          },
          response: {
            amountBefore: 0,
            amountAfter: 0,
          },
        },
        refill: {
          request: {
            amount: '',
            operatorName: '',
          },
          response: {
            amountBefore: '',
            amountAfter: '',
          },
        },
        flowStatementsReport: {},
      },
      departments: [],
      printoutCopies: {
        issueDocuments: {
          cheque: {
            credit: {},
            debit: {},
            creditReturn: {},
            debitReturn: {},
          },
        },
      },
      availableServices: {
        issueDocuments: {
          soap: {
            service: {
              url: '',
            },
          },
        },
        operations: {
          soap: {
            service: {
              url: '',
            },
          },
        },
        subjectsEditor: {
          soap: {
            service: {
              url: '',
            },
          },
          web: {
            site: {
              url: '',
            },
          },
        },
        responseDeliveryGateway: {
          socketio: {
            service: {
              namespace: '',
              url: '',
              path: '',
            },
          },
        },
      },
      shiftNumber: '',
      fiscalNumber: '',
      fiscalSignature: '',
      cashRegister: {
        authority: {
          registrationNumber: '',
        },
        fiscalStorage: {
          factoryNumber: '',
        },
        factoryNumber: '',
      },
    },
  },
  taxation: {
    enabledTaxationSystems: {},
  },
  activeServices: {
    deviceRoute: false,
    webSocket: false,
    subjects: false,
  },
  generalError: {
    code: '',
    description: '',
    deviceErrorState: false,
  },
  agent: {
    roles: {},
  },
}
