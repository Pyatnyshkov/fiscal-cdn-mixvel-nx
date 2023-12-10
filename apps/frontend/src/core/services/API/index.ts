import { singleAPI } from './app/single.api'
import { commitSubjectsAPI } from './commitSubjects/commitSubjects.api'
import { encashmentAPI } from './encashment/encashment.api'
import { issueDocumentChequeAPI } from './issueDocumentCheque/issueDocumentCheque.api'
import { refillAPI } from './refill/refill.api'
import { subjectsAPI } from './subjects/subjects.api'

export const API = {
  single: singleAPI,
  subjects: subjectsAPI,
  encashment: encashmentAPI,
  refill: refillAPI,
  document: issueDocumentChequeAPI,
  commitSubjects: commitSubjectsAPI,
}

export type API = typeof API
