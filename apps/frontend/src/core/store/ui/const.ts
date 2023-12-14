export const GlobalErrorType = {
  network: 'network',
  token: 'token',
} as const

export type GlobalErrorType = (typeof GlobalErrorType)[keyof typeof GlobalErrorType]
