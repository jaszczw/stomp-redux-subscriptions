import {actionsIDs} from '../constants'
import { PatientsStateModel, FetchedPatientsAction} from '../models';

const handleFetchedPatients = (action : FetchedPatientsAction) : string[] => {
  return action.payload.patients.map((item) => item._id);
}

export default (state : string[] = [], action): string[] => {
  switch (action.type) {
  case actionsIDs.FETCHED_PATIENTS:
    return handleFetchedPatients(action);
  default:
    return state;
  }
};