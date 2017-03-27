import { createSelector } from 'reselect';
import { PatientsStateModel } from './models';
import { selectors } from './reducers/byIds'
import { getPatientsState } from '../../store/selectors'

const getPatientsByIds = createSelector(
  getPatientsState,
  (patientState) => patientState.patientsByIds
);

const getPatientsByAllIds = createSelector(
  getPatientsState,
  (patientState) => patientState.patientsAllIds
);

export const getAllPatients = createSelector(  
  getPatientsByIds,
  getPatientsByAllIds,
    (byIds, allIds) : PatientsStateModel[] => {
      return  allIds.map((id) => selectors.getPatient(byIds, id));      
    } 
  );
