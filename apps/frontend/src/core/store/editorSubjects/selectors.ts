import { RootState } from '..'

export const selectEditorSubjects = (state: RootState) => state.editorSubjects

export const selectEditorSubjectsDepartmentsByCode = (state: RootState) =>
  selectEditorSubjects(state).departmentsByCode

export const selectEditorSubjectsGUID = (state: RootState) =>
  selectEditorSubjects(state).identification.guid

export const selectEditorSubjectsSOAPEndpoint = (state: RootState) =>
  selectEditorSubjects(state).subjectsSOAPEndpoint

export const selectEditorSubjectsDepartments = (state: RootState) =>
  selectEditorSubjects(state).departments
