import { Instructions } from '@models/general/instructions.model'
import { HttpRequest } from '../HttpRequest'

import { singleMockDataXML } from './single.api.mockDataXML'

import { XMLParser } from '@utils/XMLParser'
import { singlePrepareRequestDataXML } from './single.api.prepareRequestDataXML'
import {
  SingleDataSuccess,
  singleTransformResponseDataXML,
} from './single.api.transformResponseDataXML'
import { ShiftError } from '@error'

export const singleAPI = {
  post: async (url: string, data: Instructions['deviceRouting']) => {
    try {
      // const response = await new HttpRequest(url).post(singlePrepareRequestDataXML(data))

      // return singleTransformResponseDataXML(XMLParser(response.data))
      return singleTransformResponseDataXML(XMLParser(singleMockDataXML))
    } catch (error) {
      console.log(error)
      throw new ShiftError({ code: 'hello', description: 'huyak' })
    }
  },
}
