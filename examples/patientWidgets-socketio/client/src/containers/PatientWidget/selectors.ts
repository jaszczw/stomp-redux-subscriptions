import { createSelector } from 'reselect';
import { PatientsStateModel } from '../../modules/patients/models';
import { PatientViewModel } from './viewModels'

import { getPatientById } from '../../modules/patients/selectors';

const getViewModelFields = (patient : PatientsStateModel) => ({
  id: patient._id,
  name: patient.patient
});

const mapPatientToViewModel = (patient : PatientsStateModel) : PatientViewModel => patient && ({
  ...patient,
  ...getViewModelFields(patient),
});

const getPatient = createSelector(
  (state) => state,
  (state, props: {id}) => ({id: props.id}),
  getPatientById
);

export const getPatientViewModel = createSelector(
  getPatient,
  mapPatientToViewModel
);
