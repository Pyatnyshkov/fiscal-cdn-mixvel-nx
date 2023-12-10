import { AgentRoleValue, SignsSubjectValue, TaxesValue } from '@consts'
import { TaxationSystemModel } from './general/taxationSystem.model'

export interface SubjectElement {
  id: string
  name: string
  price: string
  quantity: string
  measure: string
  taxes: TaxesValue
  department: unknown[]
  signsSubject: SignsSubjectValue
  agentRole: AgentRoleValue
  supplierTin: string
  supplierName: string
  restrictionsTaxationSystems: RestrictionsTaxationSystems[] | unknown[]
}

export type RestrictionsTaxationSystems = { type: TaxationSystemModel }

export const isTaxationSystem = (
  taxationSystems: unknown
): taxationSystems is RestrictionsTaxationSystems => {
  const el = taxationSystems as RestrictionsTaxationSystems
  return el.type.$value ? true : false
}
