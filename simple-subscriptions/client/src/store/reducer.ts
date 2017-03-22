import { combineReducers} from 'redux';
import { ReduxState } from './reduxState'
import {default as patients} from '../modules/patients/reducers';

export const rootReducers = combineReducers<ReduxState>({
  patients
});
