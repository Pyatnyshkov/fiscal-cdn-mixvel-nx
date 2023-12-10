import { AppThunk } from '@store'

type AddSubject = (subjectName: string | null) => AppThunk
// type UpdateSubject = (id: EntityId, name: string, value: string) => AppThunk

export const commitSubject: AddSubject = (subjectName) => (dispatch, getState) => {}
