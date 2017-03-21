import findIndex from 'lodash/findIndex';
import _isEqual from 'lodash/isEqual';


import {SUBSCRIPTIONS_SUBSCRIBE} from './constants';

const getUnsubscriptionResult = (currentSubscriptionState = [], payload) => {
  const index = findIndex(
    currentSubscriptionState,
    (subPayload) => _isEqual(payload, subPayload)
  );

  return [
    ...currentSubscriptionState.slice(0, index),
    ...currentSubscriptionState.slice(index + 1),
  ];
};

const getSubscriptionResult = (currentSubscriptionState = [], payload) => {
  return currentSubscriptionState.concat(payload);
};

export const createReducer = (SUBSCRIPTION_TYPE) => (state = [], action) => {
  if (action.type !== SUBSCRIPTION_TYPE) {
    return state;
  }

  let newState;

  const payload = action.payload;

  if (action.method === SUBSCRIPTIONS_SUBSCRIBE) {
    newState = getSubscriptionResult(state, payload);
  } else {
    newState = getUnsubscriptionResult(state, payload);
  }

  return newState || [];
};

export const getSubscriptions = (state, payload)=>
  state.filter((subscribedPayloads) => _isEqual(payload, subscribedPayloads))
