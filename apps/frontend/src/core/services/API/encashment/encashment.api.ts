import { Instructions } from '@models/general/instructions.model'
import { HttpRequest } from '../HttpRequest'

import { XMLParser } from '@utils/XMLParser'
import { ShiftError } from '@error'
import { EncashmentOperation } from '@models/general/encashment.model'
import { encashmentPrepareRequestDataXML } from './encashment.api.prepareRequestDataXML'
import { operationsTransformResponseDataXML } from '../operations/operations.api.transformResponseDataXML'

export const encashmentAPI = {
  post: async (
    url: string,
    deviceRouting: Instructions['deviceRouting'],
    encashmentRequest: EncashmentOperation['request']
  ) => {
    try {
      const response = await new HttpRequest(url).post(
        encashmentPrepareRequestDataXML(deviceRouting, encashmentRequest)
      )

      // return singleTransformResponseDataXML(XMLParser(response.data))
      return operationsTransformResponseDataXML(XMLParser(response.data))
    } catch (error) {
      throw new ShiftError({ code: 'encashmentAPI', description: 'encashmentAPI' })
    }
  },
}
