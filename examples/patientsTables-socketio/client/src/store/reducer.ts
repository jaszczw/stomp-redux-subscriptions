import { combineReducers} from 'redux';
import { createSelector } from 'reselect';

import { ReduxState } from './reduxState'
import {default as patients} from '../modules/patients/reducers';

export const rootReducers = combineReducers<ReduxState>({
  patients
});
