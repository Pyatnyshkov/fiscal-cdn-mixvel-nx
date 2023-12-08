export const InputView = {
  tableCol: 'tableCol',
} as const

export type InputView = (typeof InputView)[keyof typeof InputView]
