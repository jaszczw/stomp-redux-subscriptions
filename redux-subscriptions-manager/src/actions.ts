import {SUBSCRIPTIONS_SUBSCRIBE, SUBSCRIPTIONS_UNSUBSCRIBE} from './constants';

export const subscriptionActions = (type) => {
  const subscribe = (payload) => ({
    type: type,
    method: SUBSCRIPTIONS_SUBSCRIBE,
    payload
  });

  const unsubscribe = (payload) => ({
    type: type,
    method: SUBSCRIPTIONS_UNSUBSCRIBE,
    payload
  });

  return {
    subscribe,
    unsubscribe
  };
};
