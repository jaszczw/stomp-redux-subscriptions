var _ = require('lodash');
var patientsDb = require('./patientsDb');

const each5Second = 5000;
const getRandomPatientId = (patientsList) => ({_id: patientsList[_.random(0, patientsList.length -1)]._id});

function getRandomInt(lower, upper) {
    //to create an even sample distribution
    return Math.floor(lower + (Math.random() * (upper - lower + 1)));
}

function getRandomDouble(lower, upper) {
    return lower + (Math.random() * (upper - lower + 1));
}

module.exports = (cb) => {
    setInterval(() => {
        patientsDb.find({}, (err, patientsList) => {
            const query = getRandomPatientId(patientsList);
            const value = {$set: {hearthRate: getRandomInt(60, 130)}};

            patientsDb.update(query, value);

            cb(query);
        });
    }, each5Second);

    setInterval(() => {
        patientsDb.find({}, (err, patientsList) => {
            const query = getRandomPatientId(patientsList);
            const value = {$set: {bodyTemperature: getRandomDouble(35, 39).toFixed(2)}};

            patientsDb.update(query, value);

            cb(query);
        });
    }, each5Second);
};
