import { call, put } from 'redux-saga/effects';
import { getPatients } from '../services/patientsService'
import { fetchedPatients } from '../actions'


export const fetchPatients = function *() {
  const patients = yield call(getPatients);
  yield put(fetchedPatients(patients));
};