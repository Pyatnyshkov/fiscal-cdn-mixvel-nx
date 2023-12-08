// export const fetchSubjects: AppThunk = async (dispatch, getState, { API }) => {
//     const { network, app } = getState()

//     // dispatch(appSlice.actions.loading)

//     if (app.instructions.deviceRouting) {
//       // try {
//       //   const data = await API.deviceRouteStatus.post(
//       //     network.deviceStatusSOAPEndpoint,
//       //     deviceRouteStatus.deviceRouting
//       //   )
//       // } catch (error) {
//       //   console.error('fetchDeviceRouteStatus', error)
//       // }

//       // --- Mock data
//       const parser = new DOMParser()
//       const data = parser.parseFromString(deviceRouteStatusMockDataXML, 'text/xml')
//       const transformedData = deviceRouteStatusTransformDataXML(data)
//       // ---

//       if (isSingleDataFail(transformedData) && !network.soapEndpoint) {
//         const error = {
//           code: transformedData.single.fail.code,
//           description: transformedData.single.fail.description,
//         }

//         dispatch(appSlice.actions.error(error))
//       }

//       if (isSingleData(transformedData) && !network.soapEndpoint) {
//         dispatch(appSlice.actions.successSingle(transformedData.single))

//         const { availableServices } = transformedData.single
//         const networkData = {
//           soapEndpoint: availableServices.issueDocuments.soap.service.url,
//           operationsSOAPEndpoint: availableServices.operations.soap.service.url,
//           subjectsSOAPEndpoint: availableServices.subjectsEditor.soap.service.url,
//           subjectsWebEndpoint: availableServices.subjectsEditor.web.site.url,
//           socketIOAddress: availableServices.responseDeliveryGateway.socketio.service.url,
//           socketIOPath: availableServices.responseDeliveryGateway.socketio.service.path,
//           socketIONamespace: availableServices.responseDeliveryGateway.socketio.service.namespace,
//         }

//         dispatch(setDataToNetwork(networkData))
//         dispatch(appSlice.actions.servicesAvailable())
//       }
//     }
//   }
