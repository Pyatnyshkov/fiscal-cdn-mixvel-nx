import { calcVatAmount } from './calcTaxes'

export const calcPrice = (price: string, quantity: string, taxesType: string) => {
  const getAmount = (price: string, quantity: string) => {
    return (parseFloat(price) * parseFloat(quantity)).toString()
  }

  const amount = getAmount(price, quantity)

  const taxesAmount = calcVatAmount(taxesType, amount).amount

  return { amount, taxesAmount: '' }
}
