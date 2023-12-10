import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { EncashmentOperation } from '@models/general/encashment.model'
import { AppThunk } from '@store'
import { hasError } from '@store/app'
import { ShiftError } from '@error'
import { AxiosError } from 'axios'
import { DocumentModel } from '@models/general/document.mode'
import { Cashier } from '@models/general/cashier.model'
import { PointOfSettlement } from '@models/general/pointOfSettlement.model'
import { TaxationSystemModel } from '@models/general/taxationSystem.model'
import { ChequeContent } from '@models/general/chequeContent.model'
import { ChequeModel } from '@models/cheque.model'

import { selectDocumentSubjectsEntities } from '@store/documentSubjects/selectors'
import { SubjectsDocumentDataRequest } from '@models/data/subjectsDocument.data.request.model'
import moment from 'moment'
import { DocumentCurrentSettlementReportData } from '@models/data/documentCurrentSettlementReport.data.model'
import { Instructions } from '@models/general/instructions.model'
import { getInstructionsWithZoneId } from '@utils/getInstructionsWithZoneId'

interface InitialState {
  chequeType: DocumentModel['chequeType']
  taxPayer: DocumentModel['taxPayer']
  cashier: Cashier
  pointOfSettlement: PointOfSettlement
  taxationSystem: TaxationSystemModel['type']
  customer: ChequeContent['customer']
  printoutInjections: ChequeModel['printoutInjections']
  electronicAmount: ChequeModel['printoutInjections']['payments']['forms']['electronic']['amount']
  cashAmount: ChequeModel['printoutInjections']['payments']['forms']['cash']['amount']
  considerationAmount: ChequeModel['printoutInjections']['payments']['forms']['consideration']['amount']
  electronicMaskedCardPAN: ChequeModel['printoutInjections']['payments']['forms']['electronic']['maskedCardPAN']
  copies: ChequeModel['copies']
  sendButtonDisabled: ChequeModel['sendButtonDisabled']
  sendButtonVisible: ChequeModel['sendButtonVisible']
  issueResult: ChequeModel['issueResult']
  chequeContent: ChequeContent
}

const initialState: InitialState = {
  chequeType: 'credit',
  taxPayer: {
    tin: '',
    name: '',
  },
  cashier: {
    tin: '',
    fullName: '',
  },
  pointOfSettlement: {
    address: '',
  },
  taxationSystem: {
    attributes: {
      codepage: 'fts-1.31_1#taxationSystem',
    },
    $value: '0',
  },
  customer: {
    phone: '',
    email: '',
  },
  printoutInjections: {
    documentReferenceNumber: '',
    payments: {
      forms: {
        electronic: {
          maskedCardPAN: '',
          amount: '',
        },
        cash: {
          amount: '',
        },
        consideration: {
          amount: '',
        },
      },
    },
  },
  electronicAmount: '',
  cashAmount: '',
  considerationAmount: '',
  electronicMaskedCardPAN: '',
  copies: '2',
  sendButtonVisible: true,
  sendButtonDisabled: false,
  issueResult: {},
  chequeContent: {} as ChequeContent,
}

type PayloadUpdateChequeTotal = PayloadAction<
  Pick<
    InitialState,
    'electronicAmount' | 'considerationAmount' | 'cashAmount' | 'electronicMaskedCardPAN' | 'copies'
  >
>

export type ChequeForm = {
  taxPayerName: InitialState['taxPayer']['name']
  taxPayerTin: InitialState['taxPayer']['tin']
  cashierName: InitialState['cashier']['fullName']
  cashierTin: InitialState['cashier']['tin']
  chequeType: InitialState['chequeType']
  taxationSystem: InitialState['taxationSystem']['$value']
  referenceNumber: InitialState['printoutInjections']['documentReferenceNumber']
  customerPhone: InitialState['customer']['email']
  customerEmail: InitialState['customer']['phone']
  pointOfSettlementAddress: InitialState['pointOfSettlement']['address']
}

type PayloadUpdateCheque = PayloadAction<ChequeForm>

type PayloadExtract = PayloadAction<
  Pick<InitialState, 'taxPayer' | 'cashier' | 'pointOfSettlement'>
>

export const extractAppDataToDocument: AppThunk = async (dispatch, getState, { API }) => {
  const { app } = getState()
  dispatch(
    documentSlice.actions.extract({
      taxPayer: app.taxPayer,
      cashier: app.cashier,
      pointOfSettlement: app.pointOfSettlement,
    })
  )
}

export const fetchIssueDocumentCheque: AppThunk = async (dispatch, getState, { API }) => {
  const { app, document, network, websocket } = getState()

  const documentSubjectsEntities = selectDocumentSubjectsEntities(getState())

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

  console.log('subjectsEntities', subjectsList)

  const documentData: DocumentModel = {
    taxPayer: {
      tin: app.taxPayer.tin,
      name: app.taxPayer.name,
    },
    document: {
      cheque: {
        [document.chequeType]: {
          customer: {
            phone: document.customer.phone,
            email: document.customer.email,
          },
          taxes: {
            vat: [
              {
                amount: '1',
                type: {
                  $value: '1',
                  attributes: {
                    codepage: 'fts-1.31_1#vatTaxType',
                  },
                },
              },
            ],
          },
          payments: {
            forms: {
              electronic: {
                amount: document.electronicAmount,
              },
              cash: {
                amount: document.cashAmount,
              },
              consideration: {
                amount: document.considerationAmount,
              },
            },
            total: {
              amount: '',
            },
          },
          settlement: {
            subjects: {
              subject: subjectsList, // сюда зашвыриваем
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
          tin: document.cashier.tin,
          fullName: document.cashier.fullName,
        },
        pointOfSettlement: {
          address: document.pointOfSettlement.address,
        },
      },
    },
    chequeType: document.chequeType,
    copies: document.copies,
    attributes: {
      id: app.attributes.id || '1',
    },
    instructions: getInstructionsWithZoneId(app.instructions, websocket.state.zoneId),
    printoutInjections: {
      documentReferenceNumber: document.printoutInjections.documentReferenceNumber,
      payments: {
        forms: {
          electronic: {
            maskedCardPAN: document.electronicMaskedCardPAN,
            amount: document.electronicAmount,
          },
          cash: {
            amount: document.cashAmount,
          },
          consideration: {
            amount: document.considerationAmount,
          },
        },
      },
    },
  }

  console.log('documentData', documentData)
  dispatch(documentSlice.actions.fetchDocumentCheque(true))
  dispatch(documentSlice.actions.sendButtonState(false))
  try {
    const data = await API.document.cheque.post(network.soapEndpoint, documentData)
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
    instructions: getInstructionsWithZoneId(app.instructions, websocket.state.zoneId),
    document: {
      currentSettlementReport: {},
    },
  }

  dispatch(documentSlice.actions.fetchDocumentCheque(true))
  dispatch(documentSlice.actions.sendButtonState(false))
  try {
    const data = await API.document.currentSettlementReport.post(
      network.soapEndpoint,
      currentSettlementReportData
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

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    updateChequeTotal: (state, { payload }: PayloadUpdateChequeTotal) => {
      state.electronicAmount = payload.electronicAmount
      state.cashAmount = payload.cashAmount
      state.considerationAmount = payload.considerationAmount
      state.electronicMaskedCardPAN = payload.electronicMaskedCardPAN
      state.copies = payload.copies
    },
    updateCheque: (state, { payload }: PayloadUpdateCheque) => {
      // state = Object.assign(state, payload) // когда структура будет ясна )

      state.taxPayer.name = payload.taxPayerName
      state.taxPayer.tin = payload.taxPayerTin
      state.cashier.fullName = payload.cashierName
      state.cashier.tin = payload.cashierTin
      state.chequeType = payload.chequeType
      state.pointOfSettlement.address = payload.pointOfSettlementAddress
      state.taxationSystem.$value = payload.taxationSystem
      state.printoutInjections.documentReferenceNumber = payload.referenceNumber
      state.customer.email = payload.customerEmail
      state.customer.phone = payload.customerPhone
    },
    extract: (state, { payload }: PayloadExtract) => {
      state.taxPayer = payload.taxPayer
      state.cashier = payload.cashier
      state.pointOfSettlement.address = payload.pointOfSettlement.address
    },
    fetchDocumentCheque: (state, { payload }: PayloadAction<boolean>) => {
      state.sendButtonVisible = !payload
    },
    sendButtonState: (state, { payload }: PayloadAction<boolean>) => {
      state.sendButtonDisabled = !payload
    },
    successCloseChequeApp: (state, { payload }: any) => {
      state.issueResult = payload
    },
  },
})
