import { HttpRequest } from '../HttpRequest'

import { ShiftError } from '@error'
import { issueDocumentCloseShiftPrepareRequestDataXML } from './issueDocumentCloseShift.api.prepareRequestDataXML'
import { DocumentCloseShift } from '@models/general/documentCloseShift.model'
import { issueDocumentTransformResponseDataXML } from '../issueDocument/issueDocument.api.transformResponseDataXML'
import { AxiosError } from 'axios'
import { XMLParser } from '@utils/XMLParser'

export const issueDocumentCloseShift = {
  post: async (url: string, document: DocumentCloseShift) => {
    try {
      const response = await new HttpRequest(url).post(
        issueDocumentCloseShiftPrepareRequestDataXML(document)
      )

      return issueDocumentTransformResponseDataXML(XMLParser(response.data))
    } catch (error) {
      throw new ShiftError({
        code: 'issueDocumentCloseShift',
        description: 'issueDocumentCloseShift',
      })
    }
  },
}
