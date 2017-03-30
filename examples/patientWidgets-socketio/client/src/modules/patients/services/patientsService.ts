import o from 'odata';
import {PatientsDomainModel} from './patientsDomainModel'

// Hardcoded the address just for the sake of sample simplicity
const processesEndPoint = () => o(`http://localhost:1337/patients`);

export function getPatients(payload) : Promise<PatientsDomainModel[]> {
  let query = processesEndPoint();

  if (payload && payload._id) {
    query = query.find(payload._id)
  }

  return query
    .get()
    .then((result) => result.data)
    .catch((err) => [])
}
