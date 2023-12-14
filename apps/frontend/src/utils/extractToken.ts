import { GlobalError } from 'core/errors/globalError'
import { Token } from '../core/models/token.model'
import { pako } from './pako'
import { GlobalErrorType } from '@store/ui/const'

export const extractToken = (): Token | undefined => {
  const url = new URL(window.location.href)
  const tokenParam = url.searchParams.get('token')

  if (!tokenParam) {
    throw new GlobalError(GlobalErrorType.token, 'invalid token')
  }

  try {
    if (tokenParam) {
      const decodedToken = window.atob(tokenParam) as any
      return JSON.parse(pako().inflateRaw(decodedToken, { to: 'string' }))
    }
  } catch (error) {
    throw new GlobalError(GlobalErrorType.token, 'decoded token')
  }
}
