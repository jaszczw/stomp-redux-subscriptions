import _keyBy from 'lodash/keyBy';
import {actionsIDs} from '../constants'
import { PatientsStateModel, FetchedPatientsAction} from '../models';

const handleFetchedPatients = (action : FetchedPatientsAction) : {[id : string] : any} => {
  return _keyBy(action.payload.patients, '_id');
};

export default (state : {[id : string] : PatientsStateModel} = {}, action): {[id : string] : PatientsStateModel} => {
  switch (action.type) {
  case actionsIDs.FETCHED_PATIENTS:
    return {
      ...state,
      ...handleFetchedPatients(action)
    };
  default:
    return state;
  }
};

export const selectors = {
  getPatient: (state : {[id : string] : any}, id : string) => state[id],
};

