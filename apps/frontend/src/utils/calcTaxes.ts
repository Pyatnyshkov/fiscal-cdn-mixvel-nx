const getVatMult = (type: number) => {
  var d = new Date()
  var y = d.getFullYear()
  var mult = 0
  /* Цифры в кейсах 1-2 не перепутаны с кейсами 3-4! Нам известна сумма с налогом и мы вычисляем сумму налога */
  switch (type) {
    case 1:
      if (y >= 2019) mult = 20 / 120
      else mult = 18 / 118
      break
    case 2:
      mult = 10 / 110
      break
    case 3:
      if (y >= 2019) mult = 0.2
      else mult = 0.18
      break
    case 4:
      mult = 0.1
      break
    case 5:
      break
    case 6:
      break
  }
  return mult
}

const toNum = (s: string) => {
  if (!s) return 0
  try {
    if (typeof s !== 'string') return s
    return +s.replace(/,/g, '.')
  } catch (e) {}
  return +s
}

const formatNum = (n: number) => {
  if (+n < 0) n = 0
  var v = (+n).toFixed(2)
  while (v[v.length - 1] == '0') {
    v = v.slice(0, -1)
  }
  if (v[v.length - 1] == '.') v = v.slice(0, -1)
  return v
}

export const calcVatAmount = (vat: string, itemAmount: string) => {
  var type = +(vat || 0)
  var mult = getVatMult(type)
  if (mult === 0)
    return {
      amount: toNum(itemAmount).toString(),
      type: type,
      isTaxAmount: false,
    }
  return {
    amount: formatNum(toNum(itemAmount) * mult),
    type: type,
    isTaxAmount: true,
  }
}
