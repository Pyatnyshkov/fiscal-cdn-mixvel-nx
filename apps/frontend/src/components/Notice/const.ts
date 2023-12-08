export const NoticeStatuses = {
  available: 'available',
  waiting: 'waiting',
  failed: 'failed',
  unavailable: 'unavailable',
} as const

export const NoticeMessages = {
  subscriptionChecks: 'Подписка на чеки',
  productDirectory: 'Справочник товаров',
  fiscalRegistrar: 'Фискальный регистратор',
} as const

export type NoticeMessages = (typeof NoticeMessages)[keyof typeof NoticeMessages]
export type NoticeStatuses = (typeof NoticeStatuses)[keyof typeof NoticeStatuses]
