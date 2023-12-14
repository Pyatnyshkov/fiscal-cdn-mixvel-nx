import { HttpRequest } from '../HttpRequest'

import { ShiftError } from '@error'
import { issueDocumentChequePrepareRequestDataXML } from './issueDocumentCheque.api.prepareRequestDataXML'
import { DocumentModel } from '@models/general/document.mode'
import { issueDocumentTransformResponseDataXML } from '../issueDocument/issueDocument.api.transformResponseDataXML'
import { AxiosError } from 'axios'
import { XMLParser } from '@utils/XMLParser'

export const issueDocumentChequeAPI = {
  post: async (url: string, document: DocumentModel) => {
    try {
      const response = await new HttpRequest(url).post(
        issueDocumentChequePrepareRequestDataXML(document)
      )

      return issueDocumentTransformResponseDataXML(XMLParser(response.data))
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error)
      }
      throw new ShiftError({
        code: 'issueDocumentChequeAPI',
        description: 'issueDocumentChequeAPI',
      })
    }
  },
}
