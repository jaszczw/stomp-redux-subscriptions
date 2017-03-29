import {combineReducers} from 'redux';
import {createSelector} from 'reselect';

import {actionsIDs} from './constants';
import {createReducer} from '../redux-subscriptions/subscriptionsReducer';
import {getSubscriptions} from '../redux-subscriptions/subscriptionsReducer';

const processesReducer = (state, action) =>
  action.type === actionsIDs.FETCHED_PROCESSES ?
    action.payload :
    state;

export default combineReducers({
  processesSubscription: createReducer(actionsIDs.PROCESSES_SUBSCRIPTION),
  processessList: processesReducer
});

export const getSubscriptionsState = (state) => state.processesSubscription;
export const getProcessesList = (state) => state.processessList;

export const getProcessesSubscriptions = createSelector(
  getSubscriptionsState,
  (state, payload) => payload,
  getSubscriptions
);
