import { takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { actionsIDs } from '../constants'
import { fetchPatients } from './fetchPatients';
import { createStartHandler } from 'redux-saga-subscriptions';
import qSocket from '../../../socketIo/socket';

const getFetchEmit = (emit) => () => Promise.resolve(fetchPatients()).then(emit);

const createChannel = (payload?) => eventChannel((emit) => {
  const fetch = getFetchEmit(emit);

  qSocket.then((socket) => {
    fetch();
    socket.on('patients-modified', fetch)
  });

  return () => {qSocket.then((socket) => {
    socket.off('patients-modified')
  })};
});


export const watchPatientsSubscription = function *() {
  const startHandler = createStartHandler([actionsIDs.STOP_SUBSCRIBE]);
  yield takeLatest(actionsIDs.START_SUBSCRIBE, startHandler(createChannel));
};
