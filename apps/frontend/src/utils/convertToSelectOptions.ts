export type SelectOptions = { value: string; label: string }[]

export const convertToSelectOptions = (data: Record<string, string>) =>
  Object.entries(data).reduce<SelectOptions>((acc, [key, value]) => {
    acc.push({ value: key, label: value })
    return acc
  }, [])
