var patientsDb = require('./patientsDb');

const each5Second = 5000;
const getRandomPatientId = (patientsList) => ({_id: patientsList[_.random(0, patientsList.length -1)]._id});

function getRandomInt(lower, upper) {
    //to create an even sample distribution
    return Math.floor(lower + (Math.random() * (upper - lower + 1)));
}

module.exports = (cb) => {
    setInterval(() => {
        patientsDb.find({}, (err, patientsList) => {
            patientsList.forEach((patient) => {
                const query = {_id: patient._id};
                const value = {$set: {hearthRate: getRandomInt(60, 130)}};

                patientsDb.update(query, value);
            });

            cb();
        });
    }, each5Second);
};
