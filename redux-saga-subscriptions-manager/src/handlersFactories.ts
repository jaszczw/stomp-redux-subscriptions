import { select, cancel, fork, race, take, put, call} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import _isEqual from 'lodash/isEqual';

const SUB_RECONNECT_TIMEOUT = 5000;

import {
  SUBSCRIPTIONS_SUBSCRIBE,
  SUBSCRIPTIONS_UNSUBSCRIBE
} from 'redux-subscriptions-manager';

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

export const createStartHandler = (stopSubActions: string[]) => (createChannel) =>
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
  };

//TODO WJ: Opinionated about subscription storing, selection - very limiting approach, but simplifies things
export const createSubscriptionHandler = (selector: SubscriptionsSelector, startType: string, stopType: string) =>
  function *({payload, method}): any {
    const subscriptionsState = yield select(selector, payload);
    const subCount = subscriptionsState.length;

    let firstSub = subCount === 1 && method === SUBSCRIPTIONS_SUBSCRIBE;
    let lastUnSub = subCount === 0 && method === SUBSCRIPTIONS_UNSUBSCRIBE;

    if (firstSub) {
      yield put({type: startType, payload});
    }

    if (lastUnSub) {
      yield put({type: stopType, payload});
    }
  };

export const createErrorHandler = (startType, stopType, reconnectTimeout = SUB_RECONNECT_TIMEOUT) =>
  function *({payload}): any {
    console.info(`'Will restart subscription in ${SUB_RECONNECT_TIMEOUT/1000} seconds`);

    //Stop current sub
    yield put({type: stopType, payload});

    //Race between state induced STOP - meaning we no longer subscribe and reconnect timeout
    const {retry} = yield race({
      retry: call(delay, SUB_RECONNECT_TIMEOUT),
      stop: take(stopType)
    });

    if (retry) {
      yield put({payload, type: startType});
    }
  };

type SubscriptionsSelector = (state: any, payload: any) => any[];