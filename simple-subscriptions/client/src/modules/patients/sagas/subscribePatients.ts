
import { takeLatest, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { actionsIDs } from '../constants'
import { fetchPatients } from './fetchPatients';
import { createSubscriptionWatcher } from 'redux-saga-subscriptions';
import socket from '../../../socketIo/socket';
import {getPatientsSubscriptions} from '../../../store/reducer';

//If channel was created per filter/or gave information what was changed could be much more extensive.
const msgChannel = 'patients-modified';
const getFetchEmit = (emit, payload) => () => Promise.resolve(fetchPatients(payload)).then(emit);

const createChannel = (payload?) => eventChannel((emit) => {
  const fetch = getFetchEmit(emit, payload);

  fetch();

  socket.on(msgChannel, fetch);

  socket.on('disconnect', () => emit(put({type: 'failing-socket'})));
  socket.on('connect', () => emit(put({type: 'socket-alive'})));

  return () => {
    socket.off(msgChannel, fetch);
  };
});

export const watchPatientsSubscription = createSubscriptionWatcher({
    subIdentifier: actionsIDs.SUBSCRIPTIONS,
    selector: getPatientsSubscriptions
  }, createChannel);
