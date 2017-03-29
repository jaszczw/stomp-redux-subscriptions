import findIndex from 'lodash/findIndex';
import _isEqual from 'lodash/fp/isEqual';

import {SUBSCRIPTIONS_SUBSCRIBE} from './constants';

let getIndexOfSubscription = (currentSubscriptionState, payload) =>
  findIndex(
    currentSubscriptionState,
    _isEqual(payload)
  );

const getStateAfterUnsub = (state, payload) => {
  const index = getIndexOfSubscription(state, payload);

  return [
    ...state.slice(0, index),
    ...state.slice(index + 1),
  ];
};

const getStateAfterSub = (state, payload) => {
  return state.concat(payload);
};

const handleSubscriptions = (state, {payload, method}) =>
  method === SUBSCRIPTIONS_SUBSCRIBE ?
    getStateAfterSub(state, payload) :
    getStateAfterUnsub(state, payload);

export const createReducer = (SUBSCRIPTION_TYPE) => (state = [], action) =>
  action.type === SUBSCRIPTION_TYPE ?
  handleSubscriptions(state, action) :
  state;

export const getSubscriptions = <T, S extends Array<T>>(state: S, payload: T) =>
  state.filter((subscribedPayloads) => _isEqual(payload, subscribedPayloads));
