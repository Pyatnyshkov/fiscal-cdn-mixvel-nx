import { Instructions } from '@models/general/instructions.model'

import { singleTransformResponseDataXML } from './single.api.transformResponseDataXML'

import { HttpRequest } from '../HttpRequest'
import { singlePrepareRequestDataXML } from './single.api.prepareRequestDataXML'
import { XMLParser } from '@utils/XMLParser'
import { mockSingle } from '../_mokc'

export const singleAPI = {
  post: async (url: string, dataRequest: Instructions['deviceRouting']) => {
    try {
      const response = await new HttpRequest(url).post(singlePrepareRequestDataXML(dataRequest))
      if (!response.data) {
        return
      }
      return singleTransformResponseDataXML(XMLParser(response.data))
    } catch (error) {
      // return singleTransformResponseDataXML(XMLParser(mockSingle))
    }
  },
}
