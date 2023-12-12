import { getFaultFromResponse, getErrorFromResponse, getTextFromElement } from '../utils'
import { ShiftError } from '@error'

type Status = {
  status: string
}

type IssueDocumentTransformResponseDataXML = (data: any) => Status

export const issueDocumentTransformResponseDataXML: IssueDocumentTransformResponseDataXML = (
  res
) => {
  console.log(res)
  const fault = getFaultFromResponse(res)
  if (fault) throw new ShiftError(fault)
  const error = getErrorFromResponse(res)
  if (error) throw new ShiftError(error)
  const status = res.getElementsByTagName('soap:Envelope')[0].getElementsByTagName('tns:status')
  if (status && status.length) {
    return {
      status: getTextFromElement(status[0]),
    }
  } else {
    return {
      status: '',
    }
  }
}
