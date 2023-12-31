import { convertToSelectOptions } from '@utils/convertToSelectOptions'

export const SignsMethod = {
  '1': 'Предоплата 100%',
  '2': 'Предоплата',
  '3': 'Аванс',
  '4': 'Полный Расчет',
  '5': 'Частичный Расчет И Кредит',
  '6': 'Передача В Кредит',
  '7': 'Оплата Кредита',
} as const

export const SignsMethodSelectOptions = convertToSelectOptions(SignsMethod)

export type SignsMethodValue = keyof typeof SignsMethod | ''
