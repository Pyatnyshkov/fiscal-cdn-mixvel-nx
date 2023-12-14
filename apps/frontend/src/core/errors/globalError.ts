import { GlobalErrorType } from '@store/ui/const'

export class GlobalError extends Error {
  reason: string
  type: GlobalErrorType

  constructor(type: GlobalErrorType, reason: string) {
    super(reason)
    this.name = this.constructor.name
    this.type = type
    this.reason = reason
  }
}
