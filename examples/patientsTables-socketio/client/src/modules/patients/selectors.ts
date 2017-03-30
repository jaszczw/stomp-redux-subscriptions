import { createSelector } from 'reselect';
import { getSubscriptions } from 'redux-subscriptions-manager';
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
  (byIds, allIds): PatientsStateModel[] =>
    allIds.map((id) => selectors.getPatient(byIds, id))
);

export const getFilteredPatientsSubscriptions = createSelector(
  getPatientsSubscriptionsState,
  (state, payload) => payload,
  getSubscriptions
);
