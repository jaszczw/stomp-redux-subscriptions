import { select, cancel, fork, race, take, put, call} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import _isEqual from 'lodash/isEqual';

const SUB_RECONNECT_TIMEOUT = 5000;

import {
  SUBSCRIPTIONS_SUBSCRIBE,
  SUBSCRIPTIONS_UNSUBSCRIBE
} from 'redux-subscriptions';

function * channelHandling (createChannel, action) {
  const channel = yield call(createChannel, action.payload);

  try {
    while (true) {
      const result = yield take(channel);
      yield result;
    }
  } finally {
    channel.close();
  }
}

export const createStartHandler =  (stopSubActions: string[]) => (createChannel) =>
  function *(action): any {
    const task = yield fork(channelHandling, createChannel, action);

    const stopPredicate = ({type}) => {
      return stopSubActions.includes(type);
    };

    try {
      while (true) {
        const stopSub = yield take(stopPredicate);

        if (stopSub && _isEqual(stopSub.payload, action.payload)) {
          return;
        }
      }
    }
    finally {
      yield cancel(task);
    }
  }

export const createSubscriptionHandler = (selector: (state: any, payload: any) => any, startType, stopType) =>
  function *(action): any {
    const subscriptionsState = yield select(selector, action.payload);
    const subCount = subscriptionsState.length;

    if (subCount === 1 && action.method === SUBSCRIPTIONS_SUBSCRIBE) {
      yield put({type: startType, payload: action.payload});
    }

    if (subCount === 0 && action.method === SUBSCRIPTIONS_UNSUBSCRIBE) {
      yield put({type: stopType, payload: action.payload});
    }
  };


export const createErrorHandler = (startType, stopType, reconnectTimeout = SUB_RECONNECT_TIMEOUT) =>
  function *(action): any {
    console.info(`'Will restart subscription in ${SUB_RECONNECT_TIMEOUT/1000} seconds`);
    yield put({type: stopType, payload: action.payload});
    const {retry} = yield race({
      retry: call(delay, SUB_RECONNECT_TIMEOUT),
      stop: take(stopType)
    });

    if (retry) {
      yield put({payload: action.payload || null, type: startType});
    }
  } ;
