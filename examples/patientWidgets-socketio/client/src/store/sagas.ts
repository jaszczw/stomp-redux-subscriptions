import patientsSagas from '../modules/patients/sagas'

function* rootSaga() : IterableIterator<any> {
  yield [
    patientsSagas()
  ];
}

export default rootSaga;