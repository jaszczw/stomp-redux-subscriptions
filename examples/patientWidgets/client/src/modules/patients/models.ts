export interface PatientsStateModel {
  _id : string;
  patient : string;
  room : string;
  bodyTemperature : number;
  hearthRate : number;
  hiBloodPressure : number;
  loBloodPressure : number;
  floor: number;
}

export interface FetchedPatientsAction {
  payload: {
    patients: PatientsStateModel[];
    queryObject: any;
  };
  type: string;
}