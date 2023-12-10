import { SelectOptions } from './convertToSelectOptions'

type GetDefaultOptionIndex = (selectOptions: SelectOptions, value: string | number) => number

export const getDefaultOptionIndex: GetDefaultOptionIndex = (selectOptions, value) =>
  selectOptions.findIndex((el) => el.value === value.toString()) || 0
