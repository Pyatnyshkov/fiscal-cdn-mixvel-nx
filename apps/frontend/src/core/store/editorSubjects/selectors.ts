import { RootState } from '..'

export const selectEditorSubjects = (state: RootState) => state.editorSubjects

export const selectEditorSubjectsDepartmentsByCode = (state: RootState) =>
  selectEditorSubjects(state).departmentsByCode

export const selectEditorSubjectsGUID = (state: RootState) =>
  selectEditorSubjects(state).identification.guid
