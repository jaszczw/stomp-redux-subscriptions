import { put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import _isEqual from 'lodash/isEqual'

import {fetchProcesses} from './actions';
import {
  getProcessesSubscriptions
} from './reducer';

import {subscriptionsService} from 'stomp-subscriptions';
import { createSubscriptionWatcher } from 'redux-saga-subscriptions';

import {
  actionsIDs
} from './constants';

const selector = getProcessesSubscriptions;
const errorType = actionsIDs.PROCESSES_SERVICE_ERROR;
const aliveType = actionsIDs.PROCESSES_SERVICE_ALIVE;

const serviceErrored = (payload) => ({type: errorType, payload});
const serviceIsAlive = (payload) => ({type: aliveType, payload});

const handleServiceStatus = (payload, message, emit) =>
    message.error ?
      emit(put(serviceErrored(payload))) :
      emit(put(serviceIsAlive(payload)));

const getHandler = (emit, payload) => (message) => {
  handleServiceStatus(payload, message, emit);

  const filter = payload && payload.filter;

  emit(put(fetchProcesses(filter || null) as any));
};

const createChannel = (payload?) => eventChannel((emit) => {
  const query = {
    entity: 'processes',
    filter: payload
  };

  const handler = getHandler(emit, payload);
  const subscription = subscriptionsService
    .createSubscription(query, handler);

  return () => {
    subscription.unsubscribe();
  };
});

export const watchSubscribeProcesses = createSubscriptionWatcher({
  subIdentifier: actionsIDs.PROCESSES_SUBSCRIPTION,
  selector,
  errorType,
}, createChannel);


