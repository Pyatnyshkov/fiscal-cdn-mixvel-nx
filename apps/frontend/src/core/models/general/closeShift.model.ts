import { Instructions } from './instructions.model'
import { ShiftState } from './shiftState.model'

export interface CloseShift {
  state: ShiftState
  cashier: {
    fullName: string
    tin: string
  }
  deviceRouting: Instructions['deviceRouting']
  responseDelivery: Instructions['responseDelivery']
  guid: string
}
