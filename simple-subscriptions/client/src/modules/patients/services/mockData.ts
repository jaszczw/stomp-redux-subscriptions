import {PatientsDomainModel} from './patientsDomainModel';


export const patientsMockData : PatientsDomainModel[] =
[
    {
      _id: "1",   
      patient: "Peter Grant", 
      room: "225", 
      bodyTemperature: 38.5, 
      hearthRate: 120, 
      hiBloodPressure: 15,
      loBloodPressure: 10,
      floor: 1
    },  
    {
      _id: "2",   
      patient: "John Doe", 
      room: "223", 
      bodyTemperature: 36.8, 
      hearthRate: 90, 
      hiBloodPressure: 12,
      loBloodPressure: 8,
      floor: 1
    },
    {
      _id: "3",   
      patient: "Mary Wien", 
      room: "226", 
      bodyTemperature: 37.0, 
      hearthRate: 95, 
      hiBloodPressure: 13,
      loBloodPressure: 9,
      floor: 2
    },    
];