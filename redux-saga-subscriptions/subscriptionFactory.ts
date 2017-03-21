import { takeEvery} from 'redux-saga/effects';

import {
  createSubscriptionHandler,
  createStartHandler,
  creatErrorHandler
} from './handlersFactories';

const parseOptions = (options: SubscriptionOptions) => ({
  ...options,
  startType: options.startType || `${options.subIdentifier}/START`,
  stopType: options.stopType || `${options.subIdentifier}/STOP`,
});

export const createSubscriptionWatcher = (options : SubscriptionOptions, createChannel) => function *() {
  if (!options.subIdentifier) throw new Error('OursubIdentifier is required');

  const {subIdentifier, startType, stopType, errorType, selector} = parseOptions(options);

  const startSubscriptionHandler = createStartHandler([stopType, errorType])(createChannel);
  const restartHandler = creatErrorHandler(startType, stopType);
  const subscribeHandler = createSubscriptionHandler(selector, startType, stopType);

  yield takeEvery(startType, startSubscriptionHandler);
  yield takeEvery(errorType, restartHandler);
  yield takeEvery(subIdentifier, subscribeHandler);
};

interface SubscriptionOptions {
  subIdentifier: string;
  startType?: string;
  stopType?: string;
  errorType: string;
  selector: (state, payload) => any[]
}
