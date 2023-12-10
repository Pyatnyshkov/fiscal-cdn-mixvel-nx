import { AgentRoleValue, SignsMethodValue, SignsSubjectValue, TaxesValue } from '@consts'

export type NumberToString<N extends number> = `${N}`

export interface DocumentSubject {
  id: string
  name: string
  price: string
  quantity: string
  amount: string
  measure: string
  taxes: TaxesValue
  taxesAmount: string
  department: any[]
  signsSubject: SignsSubjectValue
  signsMethod: SignsMethodValue
  agentRole: AgentRoleValue
  supplierTin: string
  supplierName: string
}

export type DocumentSubjectNames = keyof DocumentSubject
