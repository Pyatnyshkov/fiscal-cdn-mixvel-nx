export const SelectViewVarinant = {
  inTable: 'inTable',
} as const

export type SelectViewVarinant = (typeof SelectViewVarinant)[keyof typeof SelectViewVarinant]
