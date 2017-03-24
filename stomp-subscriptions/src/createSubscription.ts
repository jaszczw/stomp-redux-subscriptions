import uuidV1 from 'uuid/v1';

import {getStompClient} from './stomp';
import {addHandler, removeHandler} from './handlersManager';
import {createStateHandlerFactory} from './stateHandler';
import {createSubscriptionInitializer} from './subscriptionFactory';

const DEFAULT_TIMEOUT = 8000;

const createEventHandler = (emitter, stateHandler) =>
  (message) => {
    const data = JSON.parse(message.body);

    if (data.heartBeat) {
      stateHandler(message);
      return;
    }

    emitter(data);
  };

export const createSubscription = (data : {entity}, emitter, timeout = DEFAULT_TIMEOUT) => {
  const subId = uuidV1();
  const replyTarget = `/temp-queue/${subId}`;
  const initializeSubscription = createSubscriptionInitializer(replyTarget, data, subId);
  const stateHandlerFactory = createStateHandlerFactory(emitter, timeout);

  const connectViaStomp = (stomp) => {
    initializeSubscription(stomp);

    const stateHandler = stateHandlerFactory(stomp);
    const eventHandler = createEventHandler(emitter, stateHandler);
    addHandler(replyTarget, eventHandler);
  };

  getStompClient().then(connectViaStomp).catch((err) => {
    console.error('Failed to subscribe with stomp', err);
  });

  return {
    unsubscribe: () => {
      removeHandler(replyTarget);
    }
  };
};
