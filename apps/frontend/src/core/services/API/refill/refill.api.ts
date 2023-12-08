import { Instructions } from '@models/general/instructions.model'
import { HttpRequest } from '../HttpRequest'

import { XMLParser } from '@utils/XMLParser'
import { ShiftError } from '@error'
import { EncashmentOperation } from '@models/general/encashment.model'
import { operationsTransformResponseDataXML } from '../operations/operations.api.transformResponseDataXML'
import { refillPrepareRequestDataXML } from './refill.api.prepareRequestDataXML'
import { RefillOperation } from '@models/general/refill.model'

export const refillAPI = {
  post: async (
    url: string,
    deviceRouting: Instructions['deviceRouting'],
    refillRequest: RefillOperation['request']
  ) => {
    try {
      const response = await new HttpRequest(url).post(
        refillPrepareRequestDataXML(deviceRouting, refillRequest)
      )

      // return singleTransformResponseDataXML(XMLParser(response.data))
      return operationsTransformResponseDataXML(XMLParser(response.data))
    } catch (error) {
      console.log(error)
      throw new ShiftError({ code: 'refillAPI', description: 'refillAPI' })
    }
  },
}
