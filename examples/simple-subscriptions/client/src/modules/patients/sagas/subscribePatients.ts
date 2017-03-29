import { put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { actionsIDs } from '../constants'
import { fetchPatients } from './fetchPatients';
import { createSubscriptionWatcher } from 'redux-saga-subscriptions-manager';
import socket, {createServiceHeartbeat} from '../../../socketIo/socket';
import {getFilteredPatientsSubscriptions} from '../selectors';

const msgChannel = 'patients-modified';
const getFetchEmit = (emit, payload) => () => Promise.resolve(fetchPatients(payload)).then(emit);

const emitSocketFailing = (emit) => () => emit(put({type: 'socket-failing'}));
const emitSocketAlive =  (emit) =>() => emit(put({type: 'socket-alive'}));

const emitServiceFailing = (emit) => () => emit(put({type: 'service-failing'}));
const emitServiceAlive = (emit) => () => emit(put({type: 'service-alive'}));

const createChannel = (payload?) => eventChannel((emit) => {
  const fetch = getFetchEmit(emit, payload);
  let channel = null, heartBeat;
  fetch();

  socket.emit('subscribe','patients', payload, () => {
    socket.on(msgChannel, fetch);
    heartBeat = createServiceHeartbeat('patients', emitServiceAlive(emit), emitServiceFailing(emit));
  });

  socket.on('disconnect',emitSocketFailing(emit));
  socket.on('connect', emitSocketAlive(emit));

  return () => {
    socket.emit('unsubscribe','patients', payload);
    socket.off(channel, fetch);
    heartBeat && heartBeat.clear();
  };
});

export const watchPatientsSubscription = createSubscriptionWatcher({
    subIdentifier: actionsIDs.PATIENTS_SUBSCRIPTIONS,
    selector: getFilteredPatientsSubscriptions
  }, createChannel);
