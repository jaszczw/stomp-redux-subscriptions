import {PatientsState} from '../modules/patients/reducers';

export interface ReduxState {
  patients : PatientsState,
  patientsSubscriptions: any[]
}