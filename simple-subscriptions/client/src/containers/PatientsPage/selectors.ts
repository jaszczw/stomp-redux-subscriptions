import { createSelector } from 'reselect';
import { getAllPatients } from '../../modules/patients/selectors';
import { PatientsStateModel } from '../../modules/patients/models';
import { PatientsViewModel } from './viewModels'
import _ from 'lodash/fp';

const omitDomainOnlyFields = _.omit('_id');

const getViewModelFields = (patient : PatientsStateModel) => ({
  id: patient._id
});

const mapPatientToViewModel = (patient : PatientsStateModel) : PatientsViewModel => ({
  ...omitDomainOnlyFields(patient),
  ...getViewModelFields(patient),  
});

export const getAllPatientsViewModels = createSelector(
  getAllPatients,  
  (patients) : PatientsViewModel[] => {      
      return patients.map(mapPatientToViewModel);
    } 
  );

export const getPatientsOnFloorViewModels = createSelector(
  getAllPatientsViewModels,
  (state, props) => props.floor,
  (patientsVMs, floor) : PatientsViewModel[] => {
    return patientsVMs.filter((p) => floor ? p.floor === floor : true);
  }
);

