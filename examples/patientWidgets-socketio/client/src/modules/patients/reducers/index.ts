import { combineReducers } from 'redux'
import { createReducer } from 'redux-subscriptions-manager';
import { actionsIDs } from '../constants';
import { default as allIds } from './allIds'
import { default as byIds } from './byIds'

export default combineReducers<PatientsState>({
  patientsAllIds: allIds,
  patientsByIds: byIds,
  patientsSubscriptions : createReducer(actionsIDs.PATIENTS_SUBSCRIPTIONS)
});

export interface PatientsState {
  patientsAllIds : string[],
  patientsByIds: {[id : string] : any}
  patientsSubscriptions: any[]
}
