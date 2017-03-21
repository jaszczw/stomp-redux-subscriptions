import { takeEvery, select, race, takeLatest,  take, put, call, fork, cancel} from 'redux-saga/effects';
import {delay, eventChannel} from 'redux-saga';
import _isEqual from 'lodash/isEqual'

const SUB_RECONNECT_TIMEOUT = 5000;

import {
  SUBSCRIPTIONS_SUBSCRIBE,
  SUBSCRIPTIONS_UNSUBSCRIBE
} from 'redux-subscriptions/constants';

export const createStartHandler =  (stopSubActions) => (createChannel) =>
  function* (action) {
    const channel = createChannel(action.payload);
    const stopPredicate = ({type}) =>
      stopSubActions.includes(type);

    try {
      while (true) {
        const {stopSub, result} = yield race({
          result: take(channel),
          stopSub: take(stopPredicate)
        });

        if (result) {
          yield result;
        }

        if (stopSub && _isEqual(stopSub.payload, action.payload)) {
          return;
        }
      }
    }
    finally {
      channel.close();
    }
  }

export const createSubscriptionHandler = (selector, startType, stopType) =>
  function* subscriber(action) {
    const subscriptionsState = yield select(selector, action.payload);
    const subCount = subscriptionsState.length;

    if (subCount === 1 && action.method === SUBSCRIPTIONS_SUBSCRIBE) {
      yield put({type: startType, payload: action.payload});
    }

    if (subCount === 0 && action.method === SUBSCRIPTIONS_UNSUBSCRIBE) {
      yield put({type: stopType, payload: action.payload});
    }
  }

export const creatErrorHandler = (startType, stopType, reconnectTimeout = SUB_RECONNECT_TIMEOUT) =>
  function * (action) {
    console.log(`'Will restart subscription in ${SUB_RECONNECT_TIMEOUT/1000} seconds`);
    yield put({type: stopType, payload: action.payload});
    yield call(delay, SUB_RECONNECT_TIMEOUT);
    yield put({payload: action.payload || null, type: startType});
  }
