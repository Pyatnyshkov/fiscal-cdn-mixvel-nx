export interface ShiftState {
  closed: boolean
  dataLoaded: boolean
  status: 'opened' | 'closed' | 'scheduled'
  opened: boolean
}
