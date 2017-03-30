const Datastore = require('nedb');
const _  = require('lodash/fp');

const patients = [
    {
      _id: "1",   
      patient: "Peter Grant", 
      room: "225", 
      bodyTemperature: 38.5, 
      hearthRate: 120,
      floor: 2,
      hiBloodPressure: 15,
      loBloodPressure: 10
    },    
    {
      _id: "2",   
      patient: "John Doe", 
      room: "123",
      floor: 1,
      bodyTemperature: 36.8, 
      hearthRate: 90, 
      hiBloodPressure: 12,
      loBloodPressure: 8
    },
    {
      _id: "3",   
      patient: "Mary Wien", 
      room: "126",
      floor: 1,
      bodyTemperature: 37.0, 
      hearthRate: 95, 
      hiBloodPressure: 13,
      loBloodPressure: 9
    },
    {
        _id: "4",
        patient: "Clark Kent",
        room: "165",
        floor: 1,
        bodyTemperature: 36.6,
        hearthRate: 95,
        hiBloodPressure: 11,
        loBloodPressure: 7
    },
    {
        _id: "5",
        patient: "Bruce Willis",
        room: "268",
        floor: 2,
        bodyTemperature: 37.0,
        hearthRate: 96,
        hiBloodPressure: 10,
        loBloodPressure: 8
    },
];

const patientsDb = new Datastore({inMemoryOnly: true});
patientsDb.insert(patients);

module.exports = patientsDb;
