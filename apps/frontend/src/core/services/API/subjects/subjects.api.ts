import { HttpRequest } from '../HttpRequest'

import {
  SubjectsData,
  subjectsTransformResponseDataXML,
} from './subjects.api.transformResponseDataXML'
import { XMLParser } from '@utils/XMLParser'
import { subjectsMockDataXML } from './subjects.api.mockDataXML'
import {
  SubjectsDeviceRouting,
  subjectsPrepareRequestDataXML,
} from './subjects.api.prepareRequestDataXML'
import { AxiosError } from 'axios'

export const subjectsAPI = {
  // subjectsSOAPEndpoint

  post: async (url: string, dataRequest: SubjectsDeviceRouting) => {
    try {
      const { data } = await new HttpRequest(url).post<SubjectsData>(
        subjectsPrepareRequestDataXML(dataRequest)
      )

      if (data) {
        return subjectsTransformResponseDataXML(data)
      }

      return subjectsTransformResponseDataXML(XMLParser(subjectsMockDataXML))
    } catch (error) {
      if (error instanceof Error) {
        console.error('subjectsAPI', error.message)
      }
      return subjectsTransformResponseDataXML(XMLParser(subjectsMockDataXML))
    }
  },
}
