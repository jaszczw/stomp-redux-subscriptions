import { actionsIDs } from './constants';
import { PatientsDomainModel } from './services/patientsDomainModel'
import { PatientsStateModel, FetchedPatientsAction } from './models'
import { mapPatientToStateModel } from './mappers'
import { getPatients } from './services/patientsService';

export const fetchedPatients = (patients: PatientsStateModel[], queryObject?): FetchedPatientsAction => ({
  type: actionsIDs.FETCHED_PATIENTS,
  payload: {patients},
});

export const subscribePatients = () => ({
  type: actionsIDs.START_SUBSCRIBE,  
});

export const unsubscribePatients = () => ({
  type: actionsIDs.STOP_SUBSCRIBE,  
});

