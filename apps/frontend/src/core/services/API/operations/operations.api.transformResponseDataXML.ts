import { EncashmentOperation } from '@models/general/encashment.model'
import { getFaultFromResponse, getErrorFromResponse, getNumberFromElement } from '../utils'
import { ShiftError } from '@error'

type OperationsTransformResponseDataXML = (data: any) => EncashmentOperation['response']
export const operationsTransformResponseDataXML: OperationsTransformResponseDataXML = (res) => {
  const fault = getFaultFromResponse(res)
  if (fault) throw new ShiftError(fault)
  const error = getErrorFromResponse(res)
  if (error) throw new ShiftError(error)
  const response = res
    .getElementsByTagName('soap:Envelope')[0]
    .getElementsByTagName('soap:Body')[0]
    .getElementsByTagName('tns:encashmentResponse')[0]
  if (!response)
    throw new ShiftError({
      description: 'No response',
    })
  const resp = {
    amountBefore: getNumberFromElement(response.getElementsByTagName('amountBefore')[0]),
    amountAfter: getNumberFromElement(response.getElementsByTagName('amountAfter')[0]),
  }
  return resp
}
