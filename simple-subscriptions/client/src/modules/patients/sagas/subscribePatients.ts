import { takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { actionsIDs } from '../constants'
import { fetchPatients } from './fetchPatients';
import { createStartHandler } from 'redux-saga-subscriptions';
import socket from '../../../socketIo/socket';

const msgChannel = 'patients-modified';
const getFetchEmit = (emit) => () => Promise.resolve(fetchPatients()).then(emit);

const createChannel = (payload?) => eventChannel((emit) => {
  const fetch = getFetchEmit(emit);

  fetch();

  socket.on(msgChannel, fetch);

  return () => {
    socket.off(msgChannel);
  };
});

export const watchPatientsSubscription = function *() {
  const startHandler = createStartHandler([actionsIDs.STOP_SUBSCRIBE]);
  yield takeLatest(actionsIDs.START_SUBSCRIBE, startHandler(createChannel));
};
