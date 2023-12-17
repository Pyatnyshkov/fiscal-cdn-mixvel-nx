import { TaxationSystems } from '@consts'

export interface EditorSubjects {
  subjectsSOAPEndpoint: string
  loadFailed: boolean
  subjectsLoaded: boolean
  identification: {
    guid: string // отличный от апп
  }

  restrictions: { [key in keyof typeof TaxationSystems]: boolean }[]
  dictionaries: {
    taxes: {
      tax: string //config.taxes
    }
    taxationSystems: {
      taxationSystem: string // config.taxationSystems
    }
  }
  departments: { code: string; title: string }[]
  departmentsByCode: {
    [key: string]: {
      code: string
      title: string
    }
  }
}
