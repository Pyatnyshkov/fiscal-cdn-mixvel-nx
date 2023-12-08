import { Cashier } from './general/cashier.model'
import { EncashmentOperation } from './general/encashment.model'
import { GeneralError, GeneralErrorWithState } from './general/generalError.model'
import { Instructions } from './general/instructions.model'
import { PointOfSettlement } from './general/pointOfSettlement.model'
import { RefillOperation } from './general/refill.model'
import { ShiftState } from './general/shiftState.model'
import { TaxPayer } from './general/taxPayer.model'
import { TaxationSystem } from './general/taxationSystem.model'

type PureObject = Record<string, string>

export interface App {
  deviceRouteStatus: DeviceRouteStatus
  started: boolean
  guid: string
  taxPayer: TaxPayer
  cashier: Cashier
  taxationSystem: TaxationSystem
  pointOfSettlement: PointOfSettlement
  instructions: Instructions
  shift: OpenShift
  taxation: {
    enabledTaxationSystems: {
      [key: number]: string
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
  }
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
        taxationSystem: TaxationSystem[]
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
