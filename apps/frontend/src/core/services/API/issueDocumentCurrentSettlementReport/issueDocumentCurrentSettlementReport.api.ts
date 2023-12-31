import { HttpRequest } from '../HttpRequest'

import { ShiftError } from '@error'

import { issueDocumentTransformResponseDataXML } from '../issueDocument/issueDocument.api.transformResponseDataXML'
import { AxiosError } from 'axios'
import { issueDocumentCurrentSettlementReportPrepareRequestDataXML } from './issueDocumentCurrentSettlementReport.api.prepareRequestDataXML'
import { DocumentCurrentSettlementReportData } from '@models/data/documentCurrentSettlementReport.data.model'
import { XMLParser } from '@utils/XMLParser'

export const issueDocumentCurrentSettlementReportAPI = {
  post: async (url: string, document: DocumentCurrentSettlementReportData) => {
    try {
      const response = await new HttpRequest(url).post(
        issueDocumentCurrentSettlementReportPrepareRequestDataXML(document)
      )

      // return singleTransformResponseDataXML(XMLParser(response.data))
      return issueDocumentTransformResponseDataXML(XMLParser(response.data))
    } catch (error) {
      throw new ShiftError({
        code: 'issueDocumentChequeAPI',
        description: 'issueDocumentChequeAPI',
      })
    }
  },
}
