import { getFaultFromResponse, getErrorFromResponse, getNumberFromElement } from '../utils'
import {ShiftError} from '@error'

type FlowStatementReportTransformResponseDataXML = (data: any)=> null

export const flowStatementReportTransformResponseDataXML: FlowStatementReportTransformResponseDataXML = (res) => {
  const fault = getFaultFromResponse(res);
  if (fault) throw new ShiftError(fault);
  const error = getErrorFromResponse(res);
  if (error) throw new ShiftError(error);
  const response = res.getElementsByTagName("soap:Envelope")[0]
      .getElementsByTagName("soap:Body")[0]
      .getElementsByTagName("tns:flowStatementReportResponse")[0];
  if (!response) throw new ShiftError({
    description: "No response"
  });
  return null
}
