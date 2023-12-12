import { singleAPI } from './app/single.api'
import { commitSubjectsAPI } from './commitSubjects/commitSubjects.api'
import { encashmentAPI } from './encashment/encashment.api'
import { flowStatementReportAPI } from './flowStatementReport/flowStatementReport.api'
import { issueDocumentChequeAPI } from './issueDocumentCheque/issueDocumentCheque.api'
import { issueDocumentOpenShift } from './issueDocumentOpenShift/issueDocumentOpenShift.api'
import { issueDocumentCloseShift } from './issueDocumentCloseShift/issueDocumentCloseShift.api'
import { issueDocumentCurrentSettlementReportAPI } from './issueDocumentCurrentSettlementReport/issueDocumentCurrentSettlementReport.api'
import { refillAPI } from './refill/refill.api'
import { subjectsAPI } from './subjects/subjects.api'

export const API = {
  single: singleAPI,
  subjects: subjectsAPI,
  encashment: encashmentAPI,
  refill: refillAPI,
  document: {
    cheque: issueDocumentChequeAPI,
    currentSettlementReport: issueDocumentCurrentSettlementReportAPI,
    openShift: issueDocumentOpenShift,
    closeShift: issueDocumentCloseShift
  },
  commitSubjects: commitSubjectsAPI,
  report: flowStatementReportAPI,
}

export type API = typeof API
