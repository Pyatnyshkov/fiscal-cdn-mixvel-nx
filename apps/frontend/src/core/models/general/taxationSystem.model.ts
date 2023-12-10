import { TaxationSystemsValue } from '@consts'

// export interface TaxationSystemModel {

//     attributes: {
//       codepage: 'fts-1.31_1#taxationSystem'
//     }
//     $value: TaxationSystemsValue

// }

export interface TaxationSystemModel {
  type: {
    attributes: {
      codepage: 'fts-1.31_1#taxationSystem'
    }
    $value: TaxationSystemsValue
  }
}
