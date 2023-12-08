import { Subjects } from '@models/subjects.model'

export const initialState: Subjects = {
  loadFailed: false,
  requestStarted: false,
  nextReloadSeconds: 0,
  subjectsLoaded: false,
  identification: {
    guid: '07c99085-aabb-4ec1-ac25-3e21a95d020e',
  },
  subjects: [],
}
