import { Instructions } from '@models/general/instructions.model'
import { HttpRequest } from '../HttpRequest'

import { XMLParser } from '@utils/XMLParser'
import { ShiftError } from '@error'

import { DocumentModel } from '@models/general/document.mode'
import { issueDocumentTransformResponseDataXML } from '../issueDocument/issueDocument.api.transformResponseDataXML'
import { AxiosError } from 'axios'
import { issueDocumentChequePrepareRequestDataXML } from '../issueDocumentCheque/issueDocumentCheque.api.prepareRequestDataXML'
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
      if (error instanceof AxiosError) {
        console.log(error.config?.data)
      }
      throw new ShiftError({
        code: 'issueDocumentChequeAPI',
        description: 'issueDocumentChequeAPI',
      })
    }
  },
}
