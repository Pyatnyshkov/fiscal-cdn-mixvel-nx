export const TaxationSystemsNames = {
  0: 'общая СН',
  1: 'упрощенная СН(доходы)',
  2: 'упрощенная СН (доходы минус расходы)',
  3: 'единый налог на вмененный доход',
  4: 'единый сельскохозяйственный налог',
  5: 'патентная СН',
} as const

export type TaxationSystemsNames = (typeof TaxationSystemsNames)[keyof typeof TaxationSystemsNames]
