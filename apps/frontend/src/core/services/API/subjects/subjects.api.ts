import { Instructions } from '@models/general/instructions.model'
import { HttpRequest } from '../HttpRequest'

import { subjectsTransformResponseDataXML } from './subjects.api.transformResponseDataXML'
import { XMLParser } from '@utils/XMLParser'
import { subjectsMockDataXML } from './subjects.api.mockDataXML'
import {
  SubjectsDeviceRouting,
  subjectsPrepareRequestDataXML,
} from './subjects.api.prepareRequestDataXML'

export const subjectsAPI = {
  // subjectsSOAPEndpoint

  post: async (url: string, data: SubjectsDeviceRouting) => {
    try {
      // const response = await new HttpRequest(url).post(subjectsPrepareRequestDataXML(data))
      return subjectsTransformResponseDataXML(XMLParser(subjectsMockDataXML))
    } catch (error) {
      throw error
    }
  },
}
