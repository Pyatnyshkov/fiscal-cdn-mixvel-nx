import { Instructions } from '@models/general/instructions.model'
import { HttpRequest } from '../HttpRequest'

import { XMLParser } from '@utils/XMLParser'
import { ShiftError } from '@error'
import { operationsTransformResponseDataXML } from '../operations/operations.api.transformResponseDataXML'
import { issueDocumentChequePrepareRequestDataXML } from './issueDocumentCheque.api.prepareRequestDataXML'
import { DocumentModel } from '@models/general/document.mode'
import { issueDocumentTransformResponseDataXML } from '../issueDocument/issueDocument.api.transformResponseDataXML'
import { AxiosError } from 'axios'

export const issueDocumentChequeAPI = {
  post: async (url: string, document: DocumentModel) => {
    try {
      const response = await new HttpRequest(url).post(
        issueDocumentChequePrepareRequestDataXML(document)
      )

      // return singleTransformResponseDataXML(XMLParser(response.data))
      return issueDocumentTransformResponseDataXML(response.data)
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
