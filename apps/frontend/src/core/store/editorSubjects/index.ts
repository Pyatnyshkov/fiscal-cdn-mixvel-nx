import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { initialState } from './initialState'
import { AppThunk } from '@store'
import { extractGUIDEditorSubjects } from '@utils/extractGUIDEditorSubjects'
import { extractTokenEditorSubjects } from '@utils/extractTokenEditorSubjects'
import { appSubjectsSlice, extractDepartmentsByCode } from '@store/appSubjects'
import { Department } from '@models/general/departments.model'

export const initEditorSubjects: AppThunk = async (dispatch, getState) => {
  try {
    const token = extractTokenEditorSubjects()
    const GUID = extractGUIDEditorSubjects()

    if (token) {
      dispatch(editorSubjectsSlice.actions.starting({ GUID, departments: token }))
      dispatch(fetchSubjects)
      dispatch(extractDepartmentsByCode)
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('ERROR', error.message)
      // dispatch(hasError({ code: '', description: error.message }))
    }
  }
}

export const fetchSubjects: AppThunk = async (dispatch, getState, { API }) => {
  const { editorSubjects } = getState()

  try {
    const subjectData = await API.subjects.post(
      editorSubjects.subjectsSOAPEndpoint,
      editorSubjects.identification.guid
    )
    if (subjectData) {
      dispatch(appSubjectsSlice.actions.success(subjectData))
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    }
  }
}

export const editorSubjectsSlice = createSlice({
  name: 'editorSubjects',
  initialState,
  reducers: {
    starting: (state, { payload }: PayloadAction<{ GUID: string; departments: any }>) => {
      state.identification.guid = payload.GUID
      state.departments = payload.departments
      if (state.departments.length > 0) {
        state.departments.forEach((el: Department) => {
          state.departmentsByCode[el.code] = el
        })
      }
    },
    // success: (state, { payload }: PayloadSuccess) => {
    //   state.requestStarted = false
    //   state.nextReloadSeconds = 0
    //   state.loadFailed = false
    //   state.subjectsLoaded = true
    //   state.identification = payload.identification
    //   state.subjects = payload.subjects
    // },
  },
})
