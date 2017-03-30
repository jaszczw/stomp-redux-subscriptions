export interface PatientsDomainModel {
  _id : string;
  patient : string;
  room : string;
  bodyTemperature : number;
  hearthRate : number;
  hiBloodPressure : number;
  loBloodPressure : number;
  floor : number;
}

export default PatientsDomainModel;
