import { Instructions } from '@models/general/instructions.model'

import { singleTransformResponseDataXML } from './single.api.transformResponseDataXML'

import { HttpRequest } from '../HttpRequest'
import { singlePrepareRequestDataXML } from './single.api.prepareRequestDataXML'
import { XMLParser } from '@utils/XMLParser'

export const singleAPI = {
  post: async (url: string, dataRequest: Instructions['deviceRouting']) => {
    try {
      const response = await new HttpRequest(url).post(singlePrepareRequestDataXML(dataRequest))
      console.log('data', response.data)
      console.log('response', response)
      if (!response.data) {
        return
      }
      return singleTransformResponseDataXML(XMLParser(response.data))

    } catch (error) {
      console.log(error)
    }
  },
}
