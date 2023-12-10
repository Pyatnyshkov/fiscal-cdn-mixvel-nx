import { AgentRole, SignsMethod, SignsSubject, Taxes } from '@consts'
import { SubjectsDataResponse } from './subjectsDataResponse.model'
import { SubjectsDataRequest } from './subjectsDataRequest.model'

export interface Subjects {
  loadFailed: boolean
  requestStarted: boolean
  nextReloadSeconds: number
  subjectsLoaded: boolean
  identification: {
    guid: string
  }
  subjects: SubjectsDataResponse[]
  subjectsList?: '<select class="subjectsListSelect"><option value="0">Hellblade</option><option value="1">Pookmon</option></select>'
}

export interface SubjectsList extends SubjectsDataResponse {}
