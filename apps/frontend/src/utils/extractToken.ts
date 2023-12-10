import { Token } from '../core/models/token.model'
import { pako } from './pako'

export const extractToken = (): Token | undefined => {
  const url = new URL(location.href)
  const tokenParam = url.searchParams.get('token')

  if (!tokenParam) {
    throw new Error('invalid token')
  }

  try {
    if (tokenParam) {
      const decodedToken = window.atob(tokenParam) as any
      return JSON.parse(pako().inflateRaw(decodedToken, { to: 'string' }))
    }
  } catch (error) {
    throw new Error('decoded token')
  }
}
