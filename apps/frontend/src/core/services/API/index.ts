import { singleAPI } from './app/single.api'
import { encashmentAPI } from './encashment/encashment.api'
import { refillAPI } from './refill/refill.api'
import { subjectsAPI } from './subjects/subjects.api'

export const API = {
  single: singleAPI,
  subjects: subjectsAPI,
  encashment: encashmentAPI,
  refill: refillAPI,
}

export type API = typeof API
