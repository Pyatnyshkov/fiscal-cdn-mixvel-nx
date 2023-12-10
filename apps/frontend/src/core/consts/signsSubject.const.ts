import { convertToSelectOptions } from '@utils/convertToSelectOptions'

export const SignsSubject = {
  '1': 'Товар',
  '2': 'Подакцизный Товар',
  '3': 'Работа',
  '4': 'Услуга',
  '5': 'Ставка Игры',
  '6': 'Выигрыш Аи',
  '7': 'Лотерейный Билет',
  '8': 'Выигрыш Лотереи',
  '9': 'Предоставление Рид',
  '10': 'Выплата',
  '11': 'Агентское Вознаграждение',
  '12': 'Составной Предмет Расчета',
  '13': 'Иной Предмет Расчета',
} as const

export const SignsSubjectSelectOptions = convertToSelectOptions(SignsSubject)

export type SignsSubjectValue = keyof typeof SignsSubject | ''
