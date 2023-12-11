import { Single } from '@models/app.model'
import { getNumberFromElement, getTextFromElement, isElementHaveValue } from '../utils'

// type SingleData = {
//   single: Data | DataShort | DataFail
// }

export type SingleData = SingleDataSuccess | SingleDataShortSuccess | SingleDataFail

export type SingleDataSuccess = Pick<
  Single,
  | 'currentShift'
  | 'currentRegistration'
  | 'allowedOperations'
  | 'departments'
  | 'printoutCopies'
  | 'availableServices'
> &
  turnOnNot

type turnOnNot = { turnOnNotCompletedBecauseShiftCloseRequired?: boolean }

export type SingleDataShortSuccess = Pick<SingleDataSuccess, 'currentShift' | 'currentRegistration'>
export type SingleDataFail = SingleDataShortSuccess & Fail
type Fail = {
  fail: {
    code: string
    description: string
  }
}

type SingleTransformResponseDataXML = (data: any) => SingleData

export const isSingleDataSuccess = (data: any): data is { single: SingleDataSuccess } => {
  return data.single?.departments ? true : false
}

export const isSingleDataShortSuccess = (data: any): data is { single: SingleDataShortSuccess } => {
  return !data.single?.departments ? true : false
}

export const isSingleDataFail = (data: any): data is { single: SingleDataFail } => {
  return data.single?.fail ? true : false
}

export const singleTransformResponseDataXML: SingleTransformResponseDataXML = (res) => {
  let i
  // const fault = getFaultFromResponse(res)
  // if (fault) return callback(fault);
  // const error = getErrorFromResponse(res)
  // if (error) return callback(error);
  const single = res
    .getElementsByTagName('soap:Envelope')[0]
    .getElementsByTagName('soap:Body')[0]
    .getElementsByTagName('tns:deviceRouteStatusResponse')[0]
    .getElementsByTagName('single')[0]
  // if (!single) return callback({
  //   description: "No single in response"
  // });
  let turnOnNotCompletedBecauseShiftCloseRequired = single.getElementsByTagName(
    'turnOnNotCompletedBecauseShiftCloseRequired'
  )
  if (turnOnNotCompletedBecauseShiftCloseRequired)
    turnOnNotCompletedBecauseShiftCloseRequired = turnOnNotCompletedBecauseShiftCloseRequired[0]
  if (turnOnNotCompletedBecauseShiftCloseRequired)
    turnOnNotCompletedBecauseShiftCloseRequired = true
  const allowedOperationsX = single.getElementsByTagName('allowedOperations')[0]
  const issueDocuments: any = {}
  const allowedOperations: any = {
    issueDocuments: issueDocuments,
  }
  const departments = []
  const availableServices = {
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
          url: '',
          path: '',
          namespace: '',
        },
      },
    },
  }
  const availableServicesX = single.getElementsByTagName('availableServices')[0]
  if (availableServicesX) {
    let a = availableServicesX.getElementsByTagName('issueDocuments')[0]
    if (a)
      availableServices.issueDocuments.soap.service.url = getTextFromElement(
        a.getElementsByTagName('url')
      )
    a = availableServicesX.getElementsByTagName('operations')[0]
    if (a)
      availableServices.operations.soap.service.url = getTextFromElement(
        a.getElementsByTagName('url')
      )
    a = availableServicesX.getElementsByTagName('subjectsEditor')[0]
    if (a) {
      const b = a.getElementsByTagName('soap')[0]
      const c = a.getElementsByTagName('web')[0]
      availableServices.subjectsEditor.soap.service.url = getTextFromElement(
        b.getElementsByTagName('url')
      )
      availableServices.subjectsEditor.web.site.url = getTextFromElement(
        c.getElementsByTagName('url')
      )
    }
    a = availableServicesX.getElementsByTagName('responseDeliveryGateway')[0]
    if (a) {
      availableServices.responseDeliveryGateway.socketio.service.url = getTextFromElement(
        a.getElementsByTagName('url')
      )
      availableServices.responseDeliveryGateway.socketio.service.path = getTextFromElement(
        a.getElementsByTagName('path')
      )
      availableServices.responseDeliveryGateway.socketio.service.namespace = getTextFromElement(
        a.getElementsByTagName('namespace')
      )
    }
  }
  if (allowedOperationsX) {
    const allowedOperationsEncashment = allowedOperationsX.getElementsByTagName('encashment')[0]
      ? {}
      : undefined
    const allowedOperationsRefill = allowedOperationsX.getElementsByTagName('refill')[0]
      ? {}
      : undefined
    const allowedOperationsFlowStatementsReport = allowedOperationsX.getElementsByTagName(
      'flowStatementsReport'
    )[0]
      ? {}
      : undefined
    const issueDocumentsX = allowedOperationsX.getElementsByTagName('issueDocuments')[0]
    if (issueDocumentsX) {
      const issueDocumentsOpenShift = issueDocumentsX.getElementsByTagName('openShift')[0]
        ? {}
        : undefined
      const issueDocumentsXCloseShift = issueDocumentsX.getElementsByTagName('closeShift')[0]
      const issueDocumentsCloseShift: any = issueDocumentsXCloseShift ? {} : undefined
      if (
        issueDocumentsXCloseShift &&
        issueDocumentsXCloseShift.getElementsByTagName('shiftExpired')[0]
      )
        issueDocumentsCloseShift.shiftExpired = {}
      const issueDocumentsCheque: any = issueDocumentsX.getElementsByTagName('cheque')[0]
        ? {}
        : undefined
      const issueDocumentsCorrectionCheque: any = issueDocumentsX.getElementsByTagName(
        'correctionCheque'
      )[0]
        ? {}
        : undefined
      const issueDocumentsCurrentSettlementReport: any = issueDocumentsX.getElementsByTagName(
        'currentSettlementReport'
      )[0]
        ? {}
        : undefined
      if (issueDocumentsOpenShift) issueDocuments.openShift = issueDocumentsOpenShift
      if (issueDocumentsCloseShift) issueDocuments.closeShift = issueDocumentsCloseShift
      if (issueDocumentsCheque) {
        issueDocuments.cheque = issueDocumentsCheque
        const issueChequeX = issueDocumentsX.getElementsByTagName('cheque')[0]
        if (issueChequeX.getElementsByTagName('credit')[0]) issueDocumentsCheque.credit = {}
        if (issueChequeX.getElementsByTagName('debit')[0]) issueDocumentsCheque.debit = {}
        if (issueChequeX.getElementsByTagName('creditReturn')[0])
          issueDocumentsCheque.creditReturn = {}
        if (issueChequeX.getElementsByTagName('debitReturn')[0])
          issueDocumentsCheque.debitReturn = {}
      }
      if (issueDocumentsCorrectionCheque) {
        issueDocuments.correctionCheque = issueDocumentsCorrectionCheque
        const issueCorrectionChequeX = issueDocumentsX.getElementsByTagName('correctionCheque')[0]
        if (issueCorrectionChequeX.getElementsByTagName('credit')[0])
          issueDocumentsCorrectionCheque.credit = {}
        if (issueCorrectionChequeX.getElementsByTagName('debit')[0])
          issueDocumentsCorrectionCheque.debit = {}
      }
      if (issueDocumentsCurrentSettlementReport)
        issueDocuments.currentSettlementReport = issueDocumentsCurrentSettlementReport
    }
    if (allowedOperationsEncashment) allowedOperations.encashment = allowedOperationsEncashment
    if (allowedOperationsRefill) allowedOperations.refill = allowedOperationsRefill
    if (allowedOperationsFlowStatementsReport)
      allowedOperations.flowStatementsReport = allowedOperationsFlowStatementsReport
    const failX = single.getElementsByTagName('fail')[0]
    if (failX) {
      const failed: any = {
        single: {
          allowedOperations: allowedOperations,
          availableServices: availableServices,
          fail: {
            code: getTextFromElement(failX.getElementsByTagName('code')[0]),
            description:
              getTextFromElement(failX.getElementsByTagName('description')[0]) +
              '. Case: ' +
              getTextFromElement(failX.getElementsByTagName('uuid')[0]),
          },
        },
      }
      return failed
      // return callback(null, {
      //   single: {
      //     allowedOperations: allowedOperations,
      //     availableServices: availableServices,
      //     fail: {
      //       code: getTextFromElement(failX.getElementsByTagName('code')[0]),
      //       description:
      //         getTextFromElement(failX.getElementsByTagName('description')[0]) +
      //         '. Case: ' +
      //         getTextFromElement(failX.getElementsByTagName('uuid')[0]),
      //     },
      //   },
      // })
    }
    let currentShift = single.getElementsByTagName('currentShift')
    if (currentShift && currentShift.length) currentShift = currentShift[0]
    else {
      const short = {
        single: {
          allowedOperations: allowedOperations,
          availableServices: availableServices,
        },
      }
      return short
    }
    // return callback(null, {
    //   single: {
    //     allowedOperations: allowedOperations,
    //     availableServices: availableServices,
    //   },
    // })
    var openShiftReport = currentShift.getElementsByTagName('openShiftReport')[0]
    var shift = openShiftReport.getElementsByTagName('shift')[0]
    var cashRegister = openShiftReport.getElementsByTagName('cashRegister')[0]
    const currentRegistrationX = single.getElementsByTagName('currentRegistration')[0]
    var currentRegistration: any = {}
    if (currentRegistrationX) {
      const registrationReport: any = {}
      currentRegistration.registrationReport = registrationReport
      const registrationReportX = currentRegistrationX.getElementsByTagName('registrationReport')[0]
      const taxationSystems: any = {}
      const taxationSystem: any = []
      registrationReport.taxationSystems = taxationSystems
      taxationSystems.taxationSystem = taxationSystem
      if (registrationReportX) {
        const taxationSystemsX = registrationReportX.getElementsByTagName('taxationSystem')
        i = 0
        for (i = 0; i < taxationSystemsX.length; ++i) {
          const systemX = taxationSystemsX[i]
          taxationSystem.push({
            attributes: { codepage: systemX.getAttribute('codepage') },
            $value: getNumberFromElement(systemX),
          })
        }
        const taxPayerX = registrationReportX.getElementsByTagName('taxPayer')
        if (taxPayerX) {
          const tin = getTextFromElement(taxPayerX[0].getElementsByTagName('tin'))
          const name = getTextFromElement(taxPayerX[0].getElementsByTagName('name'))
          if (tin && name) {
            registrationReport.taxPayer = {
              tin: tin,
              name: name,
            }
          }
        }
        const pointOfSettlementX = registrationReportX.getElementsByTagName('pointOfSettlement')
        if (pointOfSettlementX) {
          const address = getTextFromElement(pointOfSettlementX[0].getElementsByTagName('address'))
          if (address)
            registrationReport.pointOfSettlement = {
              address: address,
            }
        }
        const agentModeX = registrationReportX.getElementsByTagName('agentMode')
        if (agentModeX && agentModeX[0]) {
          const agentModeRolesX = agentModeX[0].getElementsByTagName('roles')
          if (agentModeRolesX && agentModeRolesX[0]) {
            const agentModeRoles: any = {}
            registrationReport.agent = { roles: agentModeRoles }
            if (isElementHaveValue(agentModeRolesX[0].getElementsByTagName('bankPaymentAgent')))
              agentModeRoles.bankPaymentAgent = true
            if (isElementHaveValue(agentModeRolesX[0].getElementsByTagName('bankPaymentSubagent')))
              agentModeRoles.bankPaymentSubagent = true
            if (isElementHaveValue(agentModeRolesX[0].getElementsByTagName('paymentAgent')))
              agentModeRoles.paymentAgent = true
            if (isElementHaveValue(agentModeRolesX[0].getElementsByTagName('paymentSubagent')))
              agentModeRoles.paymentSubagent = true
            if (isElementHaveValue(agentModeRolesX[0].getElementsByTagName('attorney')))
              agentModeRoles.attorney = true
            if (isElementHaveValue(agentModeRolesX[0].getElementsByTagName('commissionAgent')))
              agentModeRoles.commissionAgent = true
            if (isElementHaveValue(agentModeRolesX[0].getElementsByTagName('another')))
              agentModeRoles.another = true
          }
        }
      }
    }
    var printoutCopies: any = {}
    const supportedExtensionsX = single.getElementsByTagName('supportedExtensions')
    if (supportedExtensionsX && supportedExtensionsX[0]) {
      const departmentsX = supportedExtensionsX[0].getElementsByTagName('departments')
      if (departmentsX && departmentsX[0]) {
        const departmentX = departmentsX[0].getElementsByTagName('department')
        for (i = 0; i < departmentX.length; ++i) {
          const dcode = getTextFromElement(departmentX[i].getElementsByTagName('code'))
          let dname = getTextFromElement(departmentX[i].getElementsByTagName('title'))
          if (!dname) dname = getTextFromElement(departmentX[i].getElementsByTagName('name'))
          departments.push({
            code: dcode,
            name: dname,
          })
        }
      }
      const printoutCopiesX = supportedExtensionsX[0].getElementsByTagName('printoutCopies')
      if (printoutCopiesX && printoutCopiesX[0]) {
        const iDocumentsX = printoutCopiesX[0].getElementsByTagName('issueDocuments')[0]
        if (iDocumentsX) {
          const iDocumentsCheque: any = iDocumentsX.getElementsByTagName('cheque')[0]
            ? {}
            : undefined
          if (iDocumentsCheque) {
            const iChequeX = iDocumentsX.getElementsByTagName('cheque')[0]
            if (iChequeX.getElementsByTagName('credit')[0]) iDocumentsCheque.credit = {}
            if (iChequeX.getElementsByTagName('debit')[0]) iDocumentsCheque.debit = {}
            if (iChequeX.getElementsByTagName('creditReturn')[0]) iDocumentsCheque.creditReturn = {}
            if (iChequeX.getElementsByTagName('debitReturn')[0]) iDocumentsCheque.debitReturn = {}
            printoutCopies.issueDocuments = {
              cheque: iDocumentsCheque,
            }
          }
        }
      }
    }
  }
  const resp = {
    single: {
      currentShift: {
        openShiftReport: {
          shift: {
            number: getTextFromElement(shift.getElementsByTagName('number')[0]),
          },
          fiscalNumber: getTextFromElement(openShiftReport.getElementsByTagName('fiscalNumber')[0]),
          fiscalSignature: getTextFromElement(
            openShiftReport.getElementsByTagName('fiscalSignature')[0]
          ),
          cashRegister: {
            authority: {
              registrationNumber: getTextFromElement(
                cashRegister
                  .getElementsByTagName('authority')[0]
                  .getElementsByTagName('registrationNumber')[0]
              ),
            },
            fiscalStorage: {
              factoryNumber: getTextFromElement(
                cashRegister
                  .getElementsByTagName('fiscalStorage')[0]
                  .getElementsByTagName('factoryNumber')[0]
              ),
            },
            factoryNumber: getTextFromElement(
              cashRegister.getElementsByTagName('factoryNumber')[0]
            ),
          },
        },
      },
      currentRegistration: currentRegistration,
      allowedOperations: allowedOperations,
      departments: departments,
      printoutCopies: printoutCopies,
      availableServices: availableServices,
    },
  }
  // TODO Добавить вывод даты, фискального ид и фискального признака
  // if (turnOnNotCompletedBecauseShiftCloseRequired) {
  //   resp.single.turnOnNotCompletedBecauseShiftCloseRequired = true
  // }
  return resp
  // return callback(null, resp)
}
