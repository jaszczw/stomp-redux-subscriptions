import o from 'odata';
import {PatientsDomainModel} from './patientsDomainModel'

// Hardcoded the address just for the sake of sample simplicity
const processesEndPoint = () => o(`http://localhost:1337/patients`);


export function getPatients(payload) : Promise<PatientsDomainModel[]> {
  if(payload){
    return processesEndPoint()
      .filter(`floor eq ${payload.floor}`)
      .get()
      .then((result) => result.data);
  }

  return processesEndPoint()
    .get()
    .then((result) => result.data);
}






