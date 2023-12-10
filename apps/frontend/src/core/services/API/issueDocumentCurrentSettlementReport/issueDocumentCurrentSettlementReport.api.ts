import { HttpRequest } from '../HttpRequest'

import { ShiftError } from '@error'

import { DocumentModel } from '@models/general/document.mode'
import { issueDocumentTransformResponseDataXML } from '../issueDocument/issueDocument.api.transformResponseDataXML'
import { AxiosError } from 'axios'
import { issueDocumentCurrentSettlementReportPrepareRequestDataXML } from './issueDocumentCurrentSettlementReport.api.prepareRequestDataXML'
import { DocumentCurrentSettlementReportData } from '@models/data/documentCurrentSettlementReport.data.model'

export const issueDocumentCurrentSettlementReportAPI = {
  post: async (url: string, document: DocumentCurrentSettlementReportData) => {
    try {
      const response = await new HttpRequest(url).post(
        issueDocumentCurrentSettlementReportPrepareRequestDataXML(document)
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
