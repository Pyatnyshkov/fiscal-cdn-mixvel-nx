import { Cashier } from '@models/general/cashier.model'
import { Instructions } from '@models/general/instructions.model'
import { ShiftState } from '@models/general/shiftState.model'
import { Single2 } from '@models/general/single.model'

export interface IOpenShift {
  state: ShiftState
  cashier: Cashier
  single: Single2
  deviceRouting: Instructions['deviceRouting']
  responseDelivery: Instructions['responseDelivery']
  guid: string
}
