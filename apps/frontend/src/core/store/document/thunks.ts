import { AppThunk } from '@store'
import { documentSlice } from '.'
import {
  selectDocumentSubjectsEntities,
  selectDocumentSubjectsTotalTaxesAmount,
} from '@store/documentSubjects/selectors'
import { SubjectsDocumentDataRequest } from '@models/data/subjectsDocument.data.request.model'
import { DocumentModel } from '@models/general/document.mode'
import { hasError } from '@store/app'
import { ShiftError } from '@error'
import { AxiosError } from 'axios'
import { DocumentCurrentSettlementReportData } from '@models/data/documentCurrentSettlementReport.data.model'
import moment from 'moment'
import { uiSlice } from '@store/ui'
import { pushError } from '@store/ui/thunks'

export const fetchIssueDocumentCheque: AppThunk = async (dispatch, getState, { API }) => {
  const { app, document, documentCheque, network } = getState()
  const documentSubjectsEntities = selectDocumentSubjectsEntities(getState())

  const subjectsTotalTaxesAmount = selectDocumentSubjectsTotalTaxesAmount(getState())

  const totalAmount = () => {
    const electronicAmount = parseFloat(documentCheque.electronicAmount)
    const considerationAmount = parseFloat(documentCheque.considerationAmount)
    const cashAmount = parseFloat(documentCheque.cashAmount)
    const totalAmount = (electronicAmount + considerationAmount + cashAmount).toString()
    return totalAmount
  }

  const totalTaxesAmount = () => {
    return Object.entries(subjectsTotalTaxesAmount).reduce<any>((acc, [key, value]) => {
      if (value) {
        acc.push({
          amount: value,
          type: {
            $value: key,
            attributes: {
              codepage: 'fts-1.31_1#vatTaxType',
            },
          },
        })
      }

      return acc
    }, [])
  }

  console.log('totalTaxesAmount', totalTaxesAmount())

  // проверка данных
  const checkDocumentCheque = () => {
    const subjects = Object.values(documentSubjectsEntities)

    // // Необходимы данные организации
    // if (!documentCheque.taxPayerName && !documentCheque.taxPayerTin) {
    //   dispatch(pushError('Необходимы данные организации'))
    //   return
    // }

    // Необходимы товарные позиции
    if (!subjects.length) {
      dispatch(pushError('Необходимы товарные позиции'))
      return
    }

    // Укажите систему налогообложения
    if (!documentCheque.taxationSystem) {
      dispatch(pushError('Укажите систему налогообложения'))
      return
    }

    // Укажите адрес точки обслуживания
    if (!documentCheque.pointOfSettlementAddress) {
      dispatch(pushError('Укажите адрес точки обслуживания'))
      return
    }

    // Товарные позиции недооформлены
    if (parseFloat(documentCheque.totalAmount) <= 0) {
      dispatch(pushError('Товарные позиции недооформлены'))
      return
    }

    return true
  }

  if (!checkDocumentCheque()) {
    return
  }

  console.log('hello')
  //

  const subjectsList = Object.values(documentSubjectsEntities).reduce<
    SubjectsDocumentDataRequest[]
  >((acc, subject) => {
    if (!subject) {
      return acc
    }
    const subjectEl: SubjectsDocumentDataRequest = {
      name: subject.name,
      price: subject.price,
      quantity: subject.quantity,
      measure: subject.measure,
      amount: subject.amount,
      taxes: {
        vat: [
          {
            amount: subject.taxesAmount,
            type: {
              $value: subject.taxes,
              attributes: {
                codepage: 'fts-1.31_1#vatTaxType',
              },
            },
          },
        ],
      },
      agent: {
        role: {
          $value: subject.agentRole,
          attributes: {
            codepage: 'fts-1.31_1#agentMode',
          },
        },
      },
      signs: {
        subject: {
          attributes: {
            codepage: 'fts-1.31_1#type',
          },
          $value: subject.signsSubject,
        },
        method: {
          attributes: {
            codepage: 'fts-1.31_1#featureOfSettlementMethod',
          },
          $value: subject.signsMethod,
        },
      },
      restrictions: {
        taxationSystems: {
          taxationSystem: [
            {
              type: {
                $value: app.taxationSystem.$value,
                attributes: {
                  codepage: 'fts-1.31_1#taxationSystem',
                },
              },
            },
          ],
        },
      },
      supplier: {
        name: subject.supplierName,
        tin: subject.supplierTin,
      },
      department: {
        code: '',
        title: '',
      },
    }
    acc.push(subjectEl)
    return acc
  }, [])

  const documentData: DocumentModel = {
    taxPayer: {
      tin: documentCheque.cashierTin,
      name: documentCheque.taxPayerName,
    },
    document: {
      cheque: {
        [documentCheque.chequeType]: {
          customer: {
            phone: documentCheque.customerPhone,
            email: documentCheque.customerEmail,
          },
          taxes: {
            vat: totalTaxesAmount(),
          },
          payments: {
            forms: {
              electronic: {
                amount: documentCheque.electronicAmount,
              },
              cash: {
                amount: documentCheque.cashAmount,
              },
              consideration: {
                amount: documentCheque.considerationAmount,
              },
            },
            total: {
              amount: totalAmount(),
            },
          },
          settlement: {
            subjects: {
              subject: subjectsList,
            },
          },
          taxationSystem: {
            attributes: {
              codepage: '',
            },
            $value: 0,
          },
          correction: {
            own: {},
            forced: undefined,
            reason: {
              description: '',
              date: '',
              documentNumber: '',
            },
          },
        },
        cashier: {
          tin: documentCheque.cashierTin,
          fullName: documentCheque.cashierName,
        },
        pointOfSettlement: {
          address: documentCheque.pointOfSettlementAddress,
        },
      },
    },
    chequeType: documentCheque.chequeType,
    copies: documentCheque.copies,
    attributes: {
      id: app.attributes.id || '1',
    },
    instructions: app.instructions,
    printoutInjections: {
      documentReferenceNumber: document.printoutInjections.documentReferenceNumber,
      payments: {
        forms: {
          electronic: {
            maskedCardPAN: documentCheque.electronicMaskedCardPAN,
            amount: documentCheque.electronicAmount,
          },
          cash: {
            amount: documentCheque.cashAmount,
          },
          consideration: {
            amount: documentCheque.considerationAmount,
          },
        },
      },
    },
  }

  dispatch(documentSlice.actions.fetchDocumentCheque(true))
  dispatch(documentSlice.actions.sendButtonState(false))
  try {
    const data = await API.document.cheque.post(network.soapEndpoint, documentData)
    console.log(data)
    // dispatch(documentSlice.actions.success(data))
    //TODO изменить включение кнопки только при статусе ответа "sheduled"
    dispatch(documentSlice.actions.sendButtonState(true))
  } catch (error) {
    if (error instanceof ShiftError) {
      dispatch(hasError(error.reason))
    }
    if (error instanceof AxiosError) {
      console.error(error)
    }
    if (error instanceof Error) {
      console.error(error)
    }
  }
}

export const fetchIssueDocumentCurrentSettlementReport: AppThunk = async (
  dispatch,
  getState,
  { API }
) => {
  const { app, network, websocket } = getState()

  const currentSettlementReportData: DocumentCurrentSettlementReportData = {
    attributes: {
      id: moment().format('YYYYMMDDHHmmssSSS'),
    },
    taxPayer: app.taxPayer,
    instructions: app.instructions,
    document: {
      currentSettlementReport: {},
    },
  }

  dispatch(documentSlice.actions.sendButtonState(false))
  try {
    const data = await API.document.currentSettlementReport.post(
      network.soapEndpoint,
      currentSettlementReportData
    )
    console.log(data)
    // dispatch(documentSlice.actions.success(data))
    //TODO изменить включение кнопки только при статусе ответа "sheduled"
    dispatch(documentSlice.actions.sendButtonState(true))
  } catch (error) {
    console.log(error)
    if (error instanceof ShiftError) {
      dispatch(hasError(error.reason))
    }
    if (error instanceof AxiosError) {
      console.error(error)
    }
    if (error instanceof Error) {
      console.error(error)
    }
  }
}

export const fetchFlowStatementReport: AppThunk = async (dispatch, getState, { API }) => {
  const { app, network } = getState()

  try {
    const data = await API.report.post(
      network.operationsSOAPEndpoint,
      app.instructions.deviceRouting
    )
    // dispatch(documentSlice.actions.success(data))
    //TODO изменить включение кнопки только при статусе ответа "sheduled"
    dispatch(documentSlice.actions.sendButtonState(true))
  } catch (error) {
    if (error instanceof ShiftError) {
      dispatch(hasError(error.reason))
    }
    if (error instanceof AxiosError) {
      console.error(error)
    }
    if (error instanceof Error) {
      console.error(error)
    }
  }
}
