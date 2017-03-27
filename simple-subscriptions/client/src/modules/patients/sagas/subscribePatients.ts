
import { takeLatest, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { actionsIDs } from '../constants'
import { fetchPatients } from './fetchPatients';
import { createSubscriptionWatcher } from 'redux-saga-subscriptions';
import socket, {createServiceHeartbeat} from '../../../socketIo/socket';
import {getPatientsSubscriptions} from '../../../store/reducer';

//If channel was created per filter/or gave information what was changed could be much more extensive.
const msgChannel = 'patients-modified';
const getFetchEmit = (emit, payload) => () => Promise.resolve(fetchPatients(payload)).then(emit);

const createChannel = (payload?) => eventChannel((emit) => {
  const fetch = getFetchEmit(emit, payload);

  fetch();

  socket.on(msgChannel, fetch);

  const emitSocketFailing = () => emit(put({type: 'socket-failing'}));
  const emitSocketAlive = () => emit(put({type: 'socket-alive'}));

  const emitServiceFailing = () => emit(put({type: 'service-failing'}));
  const emitServiceAlive = () => emit(put({type: 'service-alive'}));

  socket.on('disconnect',emitSocketFailing);
  socket.on('connect', emitSocketAlive);
  createServiceHeartbeat('patients', emitServiceAlive, emitServiceFailing);

  return () => {
    socket.off(msgChannel, fetch);
  };
});

export const watchPatientsSubscription = createSubscriptionWatcher({
    subIdentifier: actionsIDs.SUBSCRIPTIONS,
    selector: getPatientsSubscriptions
  }, createChannel);
