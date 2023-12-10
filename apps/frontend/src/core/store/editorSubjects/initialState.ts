import { EditorSubjects } from '@models/editorSubjects.model'

export const initialState: EditorSubjects = {
  subjectsSOAPEndpoint: process.env.NX_SUBJECTS_SOAP_ENDPOINT || '',
  loadFailed: false,
  subjectsLoaded: false,
  identification: {
    guid: '',
  },

  restrictions: [],
  dictionaries: {
    taxes: {
      tax: '',
    },
    taxationSystems: {
      taxationSystem: '',
    },
  },
  departments: [],
  departmentsByCode: {},
}
