import { convertToSelectOptions } from '@utils/convertToSelectOptions'

export const Taxes = {
  '1': '20%: НДС чека по ставке 20%',
  '2': '10%: НДС чека по ставке 10%',
  '3': '20/120: НДС чека по расчетной ставке 20/120',
  '4': '10/110: НДС чека по расчетной ставке 10/110',
  '5': '0%: НДС по ставке 0%',
  '6': 'без НДС',
} as const

export const TaxesSelectOptions = convertToSelectOptions(Taxes)

export type TaxesValue = keyof typeof Taxes | ''
