// import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { IAppState } from '../../models/app'
// import { OpenShiftModel } from '../../models/openShift.model'

// import pako from 'pako'

// // @ts-ignore
// import { getUrlParam, createGUID } from '../../utils'
// import { config } from '../../utils/preedit_config'

// const initialState: IAppState = {
//   token: '$$TOKEN$$',
//   deviceStatusSOAPEndpoint: '',
//   applicationModel: {
//     started: false,
//     guid: '',
//     taxPayer: {
//       tin: '',
//       name: '',
//     },
//     cashier: {
//       tin: '',
//       fullName: '',
//     },
//     pointOfSettlement: {
//       address: '',
//     },
//     taxationSystem: {
//       attributes: {
//         codepage: 'fts-1.31_1#taxationSystem',
//       },
//       $value: 0,
//     },
//     allowedOperationsModel: {
//       issueDocuments: {},
//     },
//     instructions: {
//       deviceRouting: {},
//       responseDelivery: {
//         socketio: {
//           client: {
//             guid: '',
//             zoneId: '',
//           },
//         },
//       },
//     },
//     shift: {} as OpenShiftModel,
//     taxation: {
//       enabledTaxationSystems: {},
//     },
//     activeServices: {
//       deviceRoute: true,
//       webSocket: false,
//       subjects: false,
//     },
//     generalError: {
//       code: '',
//       description: '',
//     },
//     agent: {
//       roles: {},
//     },
//   },
// }

// export const appSlice = createSlice({
//   name: 'app',
//   initialState: initialState,
//   reducers: {
//     extractToken: (state: IAppState) => {
//       if (state.token == '$$TOKEN$$') {
//         state.deviceStatusSOAPEndpoint = config.deviceStatusSOAPEndpoint
//         state.token = decodeURIComponent(getUrlParam('token'))
//       }
//       var token1 = atob(state.token)
//       // @ts-ignore
//       var token2 = pako.inflateRaw(token1, { to: 'string' })
//       state.token = JSON.parse(token2)
//     },
//     setGUID: (state: IAppState) => {
//       state.applicationModel.guid = createGUID()
//     },
//     extractApplicationModelFromToken: ({ token, applicationModel }: IAppState) => {
//       delete applicationModel.agent
//       delete applicationModel.generalError
//       if (token.document && token.document.cheque) {
//         var cheque = token.document.cheque
//         if (cheque.pointOfSettlement)
//           applicationModel.pointOfSettlement.address = cheque.pointOfSettlement.address
//         if (token.taxPayer) {
//           applicationModel.taxPayer.tin = token.taxPayer.tin
//           applicationModel.taxPayer.name = token.taxPayer.name
//         }
//         if (cheque.cashier) {
//           applicationModel.cashier.tin = cheque.cashier.tin
//           applicationModel.cashier.fullName = cheque.cashier.fullName
//         }
//         if (cheque.pointOfSettlement)
//           applicationModel.pointOfSettlement.address = cheque.pointOfSettlement.address
//       }
//       applicationModel.instructions = {
//         deviceRouting: token.instructions.deviceRouting,
//         responseDelivery: token.instructions.responseDelivery,
//       }
//       if (!applicationModel.instructions.responseDelivery)
//         applicationModel.instructions.responseDelivery = {}
//       applicationModel.instructions.responseDelivery.socketio = {
//         client: {
//           guid: applicationModel.guid,
//         },
//       }
//     },
//   },
// })

// export const { extractToken, setGUID, extractApplicationModelFromToken } = appSlice.actions
// export const app = appSlice.actions
// export default appSlice.reducer
