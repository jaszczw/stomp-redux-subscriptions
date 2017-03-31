import _uniq from 'lodash/uniq';
import _filter from 'lodash/filter';
import {actionsIDs} from '../constants'
import { PatientsStateModel, FetchedPatientsAction} from '../models';

const handleFetchedPatients = (action : FetchedPatientsAction) : string[] => {
  return action.payload.patients.map((item) => item._id);
};

export default (state : string[] = [], action): string[] => {
  switch (action.type) {
  case actionsIDs.FETCHED_PATIENTS:
    const {queryObject} = action.payload;
    const newIds = handleFetchedPatients(action);
    if (queryObject) {
      return _uniq(newIds.concat(state));
    }
    return newIds;
  default:
    return state;
  }
};