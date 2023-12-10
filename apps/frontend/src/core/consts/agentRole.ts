import { convertToSelectOptions } from '@utils/convertToSelectOptions'

export const AgentRole = {
  '1': 'Банковский платежный агент',
  '2': 'Банковский платежный субагент',
  '4': 'Платежный агент',
  '8': 'Платежный субагент',
  '16': 'Поверенный',
  '32': 'Комиссионер',
  '64': 'Агент',
} as const

export const AgentRoleSelectOptions = convertToSelectOptions(AgentRole)

export type AgentRoleValue = keyof typeof AgentRole | ''
