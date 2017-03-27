import { createSelector } from 'reselect';
import _isEqual from 'lodash/isEqual';
import { PatientsStateModel } from './models';
import { selectors } from './reducers/byIds'
import { getPatientsState } from '../../store/selectors'

const getPatientsByIds = createSelector(
  getPatientsState,
  (patientState) => patientState.patientsByIds
);

const getPatientsByAllIds = createSelector(
  getPatientsState,
  (patientState) => patientState.patientsAllIds
);

const getPatientsSubscriptionsState = createSelector(
  getPatientsState,
  (patientState) => patientState.patientsSubscriptions
);

export const getAllPatients = createSelector(  
  getPatientsByIds,
  getPatientsByAllIds,
    (byIds, allIds) : PatientsStateModel[] => {
      return  allIds.map((id) => selectors.getPatient(byIds, id));      
    } 
  );

export const getFilteredPatientsSubscriptions = createSelector(
  getPatientsSubscriptionsState,
  (state, filter) => filter,
  (patientsList, filter) =>  patientsList.filter((p) => _isEqual(filter, p))
);
