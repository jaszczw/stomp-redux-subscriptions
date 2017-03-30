import { call, put } from 'redux-saga/effects';
import { getPatients } from '../services/patientsService'
import { fetchedPatients } from '../actions'


export const fetchPatients = function *(payload) {
  const patients = yield call(getPatients, payload);
  yield put(fetchedPatients(patients, payload));
};