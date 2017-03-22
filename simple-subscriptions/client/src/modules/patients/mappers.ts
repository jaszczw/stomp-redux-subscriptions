import _ from 'lodash/fp';
import { PatientsDomainModel } from './services/patientsDomainModel';
import { PatientsStateModel } from './models'

export const mapPatientToStateModel = (patient : PatientsDomainModel) : PatientsStateModel => ({
  ...patient,  
})