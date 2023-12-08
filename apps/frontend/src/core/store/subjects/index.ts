import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { initialState } from './initialState'
import { AppThunk } from '@store'
import { SubjectsData } from '@services/API/subjects/subjects.api.transformResponseDataXML'

export const fetchSubjects: AppThunk = async (dispatch, getState, { API }) => {}

type PayloadSuccess = PayloadAction<SubjectsData>

export const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
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
