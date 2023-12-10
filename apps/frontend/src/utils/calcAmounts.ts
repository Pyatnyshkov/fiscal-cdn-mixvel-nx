import { calcVatAmount } from './calcTaxes'

export const calcAmounts = (price: string, quantity: string, taxesType: string) => {
  // const taxesType = (subject && subject.taxes.vat[0].type.$value) || ''

  const calcAmount = (price: string, quantity: string) => {
    if (!price || !quantity) {
      return ''
    }
    return (parseFloat(price) * parseFloat(quantity)).toString()
  }

  const amount = calcAmount(price, quantity)
  const taxesAmount = calcVatAmount(taxesType, amount).amount

  return { amount, taxesAmount }
}
