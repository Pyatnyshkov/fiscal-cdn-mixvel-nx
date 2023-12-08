import { AgentRoleOptions } from '@consts/agentRole'
import { SignsMethodOptions } from '@consts/signsMethod.const'
import { TaxesOptions } from '@consts/taxes.const'

export type NumberToString<N extends number> = `${N}`

export interface ChequeItem {
  id: string
  name: string
  price: string
  quantity: string
  amount: string
  measure: string
  taxes: keyof typeof TaxesOptions
  taxesAmount: string
  department: any[]
  signsSubject: keyof typeof SignsMethodOptions
  signsMethod: keyof typeof SignsMethodOptions
  agentRole: keyof typeof AgentRoleOptions
  supplierTin: string
  supplierName: string
}
