import { actionsIDs } from './constants';
import { PatientsStateModel, FetchedPatientsAction } from './models'
import {SUBSCRIPTIONS_SUBSCRIBE, SUBSCRIPTIONS_UNSUBSCRIBE} from 'redux-subscriptions';

export const fetchedPatients = (patients: PatientsStateModel[], queryObject?): FetchedPatientsAction => ({
  type: actionsIDs.FETCHED_PATIENTS,
  payload: {patients},
});

export const subscribePatients = (payload) => ({
  type: actionsIDs.SUBSCRIPTIONS,
  method: SUBSCRIPTIONS_SUBSCRIBE,
  payload
});

export const unsubscribePatients = (payload) => ({
  type: actionsIDs.SUBSCRIPTIONS,
  method: SUBSCRIPTIONS_UNSUBSCRIBE,
  payload
});

