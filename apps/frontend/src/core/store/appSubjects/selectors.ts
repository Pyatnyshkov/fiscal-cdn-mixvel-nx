import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '..'

export const selectAppSubjects = (state: RootState) => state.appSubjects
export const selectAppSubjectsList = (state: RootState) => selectAppSubjects(state).subjects

export const selectAppSubjectsSelectOptions = createSelector(
  [selectAppSubjectsList],
  (subjectsList) =>
    subjectsList.reduce<{ value: string; label: string }[]>((acc, { name }) => {
      acc.push({ value: name, label: name })
      return acc
    }, [])
)

export const selectSubjectByName = (subjectName: string | null) => (state: RootState) => {
  if (!subjectName) {
    return null
  }
  const subject = selectAppSubjectsList(state).find((subject) => subject.name === subjectName)

  if (!subject) {
    return null
  }

  return subject
}
