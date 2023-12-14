import { TaxationSystems } from '@consts'
import { TaxationSystemsType } from '@models/general/taxationSystem.model'

export type SelectOption = { value: string; label: string }
export type SelectOptions = SelectOption[]

export const convertToSelectOptions = (data: Record<string, string> | TaxationSystemsType) => {
  if (Array.isArray(data)) {
    return data.reduce<SelectOptions>((acc, el) => {
      //@ts-ignore
      acc.push({ value: el.$value.toString(), label: TaxationSystems[el.$value] })
      return acc
    }, [])
  }

  return Object.entries(data).reduce<SelectOptions>((acc, [key, value]) => {
    acc.push({ value: key.toString(), label: value })
    return acc
  }, [])
}
