// import { Instructions } from '@models/general/instructions.model'
// import { PointOfSettlement } from '@models/general/pointOfSettlement.model'
// import { TaxPayer } from '@models/general/taxPayer.model'
// import { IOpenShift } from './openShift.model'

// export interface DeviceRouteStatus {
//   taxPayer: TaxPayer
//   shift: IOpenShift
//   requestStarted: boolean
//   requestFailed: boolean
//   loaded: boolean
//   nextReloadSeconds: number | undefined
//   reloadDeviceStatusRetries: number
//   reloadDeviceStatusMaxRetries: number
//   reloadDeviceStatusTimeout: number
//   departments: []
//   deviceRouting: Instructions['deviceRouting'] | null
//   pointOfSettlement: PointOfSettlement | null
//   printoutCopies: {
//     issueDocuments: {
//       cheque: {
//         credit: {}
//         debit: {}
//         creditReturn: {}
//         debitReturn: {}
//       }
//     }
//   }
//   loadFailed: boolean
// }
