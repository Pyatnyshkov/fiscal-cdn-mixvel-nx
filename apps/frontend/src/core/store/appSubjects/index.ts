import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { initialState } from './initialState'
import { AppThunk } from '@store'
import { SubjectsData } from '@services/API/subjects/subjects.api.transformResponseDataXML'
import { selectEditorSubjectsDepartmentsByCode } from '@store/editorSubjects/selectors'
import { EditorSubjects } from '@models/editorSubjects.model'

export const extractDepartmentsByCode: AppThunk = async (dispatch, getState, { API }) => {
  const departmentsByCode = selectEditorSubjectsDepartmentsByCode(getState())

  dispatch(appSubjectsSlice.actions.departmentsByCode(departmentsByCode))
}

type PayloadSuccess = PayloadAction<SubjectsData>

export const appSubjectsSlice = createSlice({
  name: 'app:subjects',
  initialState,
  reducers: {
    departmentsByCode: (state, { payload }: PayloadAction<EditorSubjects['departmentsByCode']>) => {
      state.subjects.forEach((el) => {
        if (el.departmentCode) {
          el.department = payload[el.departmentCode]
        }
      })
    },
    failed: (state) => {
      // $("#subjectListStatusFailSpan").prop("title", err ? err.description : "No Error");
      state.nextReloadSeconds = 120
      // setTimeout(fetchSubjectsCountdown, 1000);
      state.loadFailed = true
      state.subjectsLoaded = false
    },
    success: (state, { payload }: PayloadSuccess) => {
      state.requestStarted = false
      state.nextReloadSeconds = 0
      state.loadFailed = false
      state.subjectsLoaded = true

      state.identification = payload.identification

      state.subjects = payload.subjects
    },
  },
})
