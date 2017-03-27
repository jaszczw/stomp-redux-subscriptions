import _isEqual from 'lodash/isEqual';
import { combineReducers} from 'redux';
import { createSelector } from 'reselect';
import { ReduxState } from './reduxState'
import {default as patients} from '../modules/patients/reducers';
import {createReducer} from 'redux-subscriptions';
import {actionsIDs} from '../modules/patients/constants';

export const rootReducers = combineReducers<ReduxState>({
  patients,
  patientsSubscriptions : createReducer(actionsIDs.SUBSCRIPTIONS)
});

export const getPatientsSubscriptions = createSelector(
  (state: ReduxState) => state.patientsSubscriptions,
  (state, payload) => payload,
  (patientsList, payload) =>  patientsList.filter((p) => _isEqual(payload, p))
);
