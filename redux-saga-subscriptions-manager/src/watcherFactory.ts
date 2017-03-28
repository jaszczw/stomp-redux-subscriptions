import { takeEvery} from 'redux-saga/effects';

import {
  createSubscriptionHandler,
  createStartHandler,
  createErrorHandler
} from './handlersFactories';

const parseOptions = (options: SubscriptionOptions) => ({
  ...options,
  startType: options.startType || `${options.subIdentifier}/START`,
  stopType: options.stopType || `${options.subIdentifier}/STOP`,
  errorType: options.errorType || ''
});

export const createSubscriptionWatcher = (options : SubscriptionOptions, createChannel) => function *() {
  if (!options.subIdentifier) throw new Error('OursubIdentifier is required');

  const { subIdentifier, startType, stopType, errorType, selector } = parseOptions(options);

  const startSubscriptionHandler = createStartHandler([stopType, errorType])(createChannel);
  const restartHandler = createErrorHandler(startType, stopType);
  const subscribeHandler = createSubscriptionHandler(selector, startType, stopType);

  yield takeEvery(startType, startSubscriptionHandler);
  yield takeEvery(subIdentifier, subscribeHandler);

  if (errorType) {
    yield takeEvery(errorType, restartHandler);
  }
};

interface SubscriptionOptions {
  subIdentifier: string;
  selector: ((state, payload) => any[]) | ((state) => any[]);
  startType?: string;
  stopType?: string;
  errorType?: string;
}
