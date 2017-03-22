import { combineReducers } from 'redux'
import { default as allIds } from './allIds'
import { default as byIds } from './byIds'

export default combineReducers<PatientsState>({
  patientsAllIds: allIds,
  patientsByIds: byIds
});

export interface PatientsState {
  patientsAllIds : string[],
  patientsByIds: {[id : string] : any}
}