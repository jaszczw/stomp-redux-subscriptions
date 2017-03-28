import o from 'odata';
import {PatientsDomainModel} from './patientsDomainModel'

// Hardcoded the address just for the sake of sample simplicity
const processesEndPoint = () => o(`http://localhost:1337/patients`);

export function getPatients(payload) : Promise<PatientsDomainModel[]> {
  let query = processesEndPoint();

  if(payload && payload.floor){
    query = query.filter(`floor eq ${payload.floor}`);
  }

  return query
    .get()
    .then((result) => result.data);
}
