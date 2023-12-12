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
import { mockSubjects } from '../_mokc'

export const subjectsAPI = {
  post: async (url: string, dataRequest: SubjectsDeviceRouting) => {
    try {
      // const { data } = await new HttpRequest(url).post<SubjectsData>(
      //   subjectsPrepareRequestDataXML(dataRequest)
      // )

      // if (data) {
      //   return subjectsTransformResponseDataXML(XMLParser(data))
      // }
      return subjectsTransformResponseDataXML(XMLParser(mockSubjects))
    } catch (error) {
      if (error instanceof Error) {
        console.error('subjectsAPI', error.message)
      }
    }
  },
}
