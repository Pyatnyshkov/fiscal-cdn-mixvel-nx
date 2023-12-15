import { HttpRequest } from '../HttpRequest'

import { ShiftError } from '@error'

import { AxiosError } from 'axios'
import { SubjectsEditorDataRequest } from '@models/data/subjectsEditor.data.request.model'
import { commitSubjectsPrepareRequestDataXML } from './commitSubjects.api.prepareRequestDataXML'
import { commitSubjectsTransformResponseDataXML } from './commitSubjects.api.transformResponseDataXML'

export const commitSubjectsAPI = {
  // editorModel.subjectsSOAPEndpoint
  // editorModel.identification.guid, editorModel.subjects
  post: async (url: string, identificationGUID: string, subjects: SubjectsEditorDataRequest[]) => {
    try {
      const response = await new HttpRequest(url).post(
        commitSubjectsPrepareRequestDataXML(identificationGUID, subjects)
      )

      // return singleTransformResponseDataXML(XMLParser(response.data))
      return commitSubjectsTransformResponseDataXML(response.data)
    } catch (error) {

      throw new ShiftError({
        code: 'issueDocumentChequeAPI',
        description: 'issueDocumentChequeAPI',
      })
    }
  },
}
