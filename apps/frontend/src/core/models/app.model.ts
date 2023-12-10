import { TaxationSystems } from '@consts'
import { Cashier } from './general/cashier.model'
import { GeneralErrorWithState } from './general/generalError.model'
import { Instructions } from './general/instructions.model'
import { PointOfSettlement } from './general/pointOfSettlement.model'
import { ShiftState } from './general/shiftState.model'
import { TaxPayer } from './general/taxPayer.model'
import { TaxationSystemModel } from './general/taxationSystem.model'
import { Token } from './token.model'

type PureObject = Record<string, string>

export interface App {
  attributes: Token['attributes']
  deviceRouteStatus: DeviceRouteStatus
  started: boolean
  guid: string
  taxPayer: TaxPayer
  cashier: Cashier
  taxationSystem: TaxationSystemModel['type']
  pointOfSettlement: PointOfSettlement
  instructions: Instructions
  shift: OpenShift
  taxation: {
    enabledTaxationSystems: {
      [key in keyof typeof TaxationSystems]?: (typeof TaxationSystems)[key]
    }
  }
  activeServices: {
    deviceRoute: boolean
    webSocket: boolean
    subjects: boolean
  }
  generalError: GeneralErrorWithState
  agent: {
    roles: {}
  },
  ignoreOpenShiftButtonClick: boolean,
  ignoreCloseShiftButtonClick: boolean
}

export interface DeviceRouteStatus {
  requestStarted: boolean
  requestFailed: boolean
  loaded: boolean
  nextReloadSeconds: number | undefined
  reloadDeviceStatusRetries: number
  reloadDeviceStatusMaxRetries: number
  reloadDeviceStatusTimeout: number
  loadFailed: boolean
  fail: boolean
  error: GeneralErrorWithState
}

export interface OpenShift {
  state: ShiftState
  single: Single
}

export interface Single {
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
        taxationSystem: TaxationSystemModel[]
      }
      taxPayer: TaxPayer
      pointOfSettlement: PointOfSettlement
      agent: { roles: {} }
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
    encashment: {}
    refill: {}
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
