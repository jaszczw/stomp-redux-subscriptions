import {put} from 'redux-saga/effects'
import _isEqual from 'lodash/isEqual';
import { eventChannel } from 'redux-saga';
import { actionsIDs } from '../constants'
import { fetchPatients } from './fetchPatients';
import { createSubscriptionWatcher } from 'redux-saga-subscriptions-manager';
import socket from '../../../socketIo/socket';
import {getFilteredPatientsSubscriptions} from '../selectors';

const msgChannel = 'patients-modified';
const getFetchEmit = (emit, payload) => () => Promise.resolve(fetchPatients(payload)).then(emit);
const emitSocketFailing = (emit) => () => emit(put({type: 'socket-failing'}));

let shouldExecuteFetch = function (payload, notificationPayload) {
  const query = notificationPayload && JSON.parse(notificationPayload);
  const singleSub = payload && payload._id;
  const singleUpdate = query && query._id;

  return !singleSub || !singleUpdate || _isEqual(query, payload);
};

const createChannel = (payload?) => eventChannel((emit) => {
  const fetch = getFetchEmit(emit, payload);
  fetch();

  socket.emit('subscribe','patients', payload, () => {
    socket.on(msgChannel, (query) => {
      if (shouldExecuteFetch(payload, query)) {
        fetch();
      }
    });
  });

  socket.on('disconnect',emitSocketFailing(emit));

  return () => {
    socket.emit('unsubscribe','patients', payload);
    socket.off(msgChannel, fetch);
  };
});

export const watchPatientsSubscription = createSubscriptionWatcher({
    subIdentifier: actionsIDs.PATIENTS_SUBSCRIPTIONS,
    selector: getFilteredPatientsSubscriptions,
    errorType: 'socket-failing'
  }, createChannel);
