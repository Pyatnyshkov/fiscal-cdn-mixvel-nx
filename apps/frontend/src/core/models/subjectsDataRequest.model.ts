import { AgentRole, SignsMethod, SignsSubject, Taxes } from '@consts'
import { SubjectsDataResponse } from './subjectsDataResponse.model'

export interface SubjectsDataRequest extends Required<SubjectsDataResponse> {
  amount: string
}
