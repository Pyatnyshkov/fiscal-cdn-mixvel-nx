import { convertToSelectOptions } from '@utils/convertToSelectOptions'

export const ChequeType = {
  credit: 'Приход',
  debit: 'Расход',
  creditReturn: 'Возврат прихода',
  debitReturn: 'Возврат расхода',
} as const

export const ChequeTypeSelectOptions = convertToSelectOptions(ChequeType)
