import { HttpRequest } from '../HttpRequest'

import { ShiftError } from '@error'
import { issueDocumentOpenShiftPrepareRequestDataXML } from './issueDocumentOpenShift.api.prepareRequestDataXML'
import { DocumentOpenShift } from '@models/general/documentOpenShift.model'
import { issueDocumentTransformResponseDataXML } from '../issueDocument/issueDocument.api.transformResponseDataXML'
import { AxiosError } from 'axios'
import { XMLParser } from '@utils/XMLParser'

export const issueDocumentOpenShift = {
  post: async (url: string, document: DocumentOpenShift) => {
    try {
      const response = await new HttpRequest(url).post(
        issueDocumentOpenShiftPrepareRequestDataXML(document)
      )

      return issueDocumentTransformResponseDataXML(XMLParser(response.data))
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.config?.data)
      }
      console.log(error)
      throw new ShiftError({
        code: 'issueDocumentOpenShift',
        description: 'issueDocumentOpenShift',
      })
    }
  },
}
