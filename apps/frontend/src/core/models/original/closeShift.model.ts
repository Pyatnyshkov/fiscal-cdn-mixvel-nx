import { ShiftState } from '@models/general/shiftState.model'

export interface ICloseShiftModel {
  state: ShiftState
  cashier: {
    fullName: string
    tin: string
  }
  deviceRouting: undefined
  responseDelivery: undefined
  guid: string
}
