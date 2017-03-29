import {actionsIDs} from './constants';
import {SUBSCRIPTIONS_SUBSCRIBE, SUBSCRIPTIONS_UNSUBSCRIBE} from '../redux-subscriptions/constants'

export const subscribeProcesses = (filter?) => ({
  type: actionsIDs.PROCESSES_SUBSCRIPTION,
  payload: filter ? {filter} : null,
  method: SUBSCRIPTIONS_SUBSCRIBE});

export const unsubscribeProcesses = (filter?) => ({
  type: actionsIDs.PROCESSES_SUBSCRIPTION,
  payload: filter ? {filter} : null,
  method: SUBSCRIPTIONS_UNSUBSCRIBE});
