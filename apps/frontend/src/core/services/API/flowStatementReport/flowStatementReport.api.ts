import { HttpRequest } from '../HttpRequest'

import { ShiftError } from '@error'

import { issueDocumentTransformResponseDataXML } from '../issueDocument/issueDocument.api.transformResponseDataXML'
import { AxiosError } from 'axios'

import { flowStatementReportRequestDataXML } from './flowStatementReport.api.prepareRequestDataXML'
import { Instructions } from '@models/general/instructions.model'

export const flowStatementReportAPI = {
  post: async (url: string, deviceRouting: Instructions['deviceRouting']) => {
    try {
      const response = await new HttpRequest(url).post(
        flowStatementReportRequestDataXML(deviceRouting)
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
