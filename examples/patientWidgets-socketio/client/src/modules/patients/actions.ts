import { subscriptionActions } from 'redux-subscriptions-manager';
import { actionsIDs } from './constants';
import { PatientsStateModel, FetchedPatientsAction } from './models'

export const fetchedPatients = (patients: PatientsStateModel[], queryObject?): FetchedPatientsAction => ({
  type: actionsIDs.FETCHED_PATIENTS,
  payload: {patients, queryObject},
});

export const patientsSubscriptions = subscriptionActions(actionsIDs.PATIENTS_SUBSCRIPTIONS);
