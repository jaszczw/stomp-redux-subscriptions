import { put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { actionsIDs } from '../constants'
import { fetchPatients } from './fetchPatients';
import { createSubscriptionWatcher } from 'redux-saga-subscriptions-manager';
import {getFilteredPatientsSubscriptions} from '../selectors';
import { subscriptionsService } from 'stomp-subscriptions';

const msgChannel = 'patients-modified';
const getFetchEmit = (emit, payload) => () => Promise.resolve(fetchPatients(payload)).then(emit);

const emitServiceFailing = (emit, payload) => (message) => emit(put({type: 'service-failing',payload}));
const emitServiceAlive = (emit, payload) => (message) => emit(put({type: 'service-alive',payload}));

const handleServiceStatus = (payload, emit, message) =>
  message.error ?
    emitServiceFailing(emit, payload)(message):
    emitServiceAlive(emit, payload)(message);

const getHandler = (emit, payload, fetch) => (message) => {
  handleServiceStatus(payload, emit, message);
  fetch();
};

const createChannel = (payload?) => eventChannel((emit) => {
  const fetch = getFetchEmit(emit, payload);
  let channel = null, heartBeat;
  fetch();

  const sub = subscriptionsService.createSubscription({
    entity: 'patients',
    ...payload
  },  getHandler(emit, payload, fetch));

  return () => {
    sub.unsubscribe();
  };
});

export const watchPatientsSubscription = createSubscriptionWatcher({
    subIdentifier: actionsIDs.PATIENTS_SUBSCRIPTIONS,
    selector: getFilteredPatientsSubscriptions
  }, createChannel);
