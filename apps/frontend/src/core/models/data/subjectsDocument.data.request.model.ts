import { SubjectsDataResponse } from './subjects.data.response.model'

export interface SubjectsDocumentDataRequest extends SubjectsDataResponse {
  amount: string
}
