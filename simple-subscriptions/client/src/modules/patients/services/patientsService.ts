import o from 'odata';
import {PatientsDomainModel} from './patientsDomainModel'

// Hardcoded the address just for the sake of sample simplicity
const processesEndPoint = () => o(`http://localhost:1337/patients`);


export function getPatients() : Promise<PatientsDomainModel[]> {
  return processesEndPoint()
    .get()
    .then((result) => result.data); //Probably here I would stop
}






