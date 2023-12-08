import { GeneralError } from '@models/general/generalError.model'

type ShiftErrorMessage = Omit<GeneralError, 'deviceErrorState'>

export class ShiftError extends Error {
  reason: ShiftErrorMessage
  constructor(message: ShiftErrorMessage) {
    super(message.description)
    this.name = this.constructor.name
    this.reason = {
      type: message?.type || '',
      code: message?.code || '',
      description: message.description,
    }
  }
}
