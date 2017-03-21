const Datastore = require('nedb');
const _  = require('lodash/fp');

let id = 1;
const zeroPad = _.padCharsStart('0')(2);

const numbers = _.range(0, 20);
const getProcessNumber = _.flow([
    _.sampleSize(6),
    _.chunk(2),
    (v) => v.map((x) => x.join('')),
    (v) => v.join('-'),
]);

const getProcessDomainObject = (processNumber) => ({
    active: true,
    locationName: "Server 1",
    processName: `Process ${zeroPad(String(id++))}`,
    processNumber: processNumber || getProcessNumber(numbers),
    status: 1,
    cpuUsage: 0
});

const processes = [
    getProcessDomainObject('1416-1918-1711'),
    getProcessDomainObject(),
    getProcessDomainObject(),
    getProcessDomainObject(),
];

//TODO WJ:
const eachSecond = 1000;
const each10Seconds = eachSecond * 50;
const getRandomProcessId = (processesList) => ({_id: processesList[_.random(0, processesList.length -1)]._id});

//Could be written much more concisely
setInterval(() => {
    processesDb.find({}, (err, processesList) => {
        const query = getRandomProcessId(processesList);
        const value = {$set: {status: Math.round(Math.random() * 2)}};

        processesDb.update(query, value);
    });
}, each10Seconds);


setInterval(() => {
    processesDb.find({}, function (err, processesList) {
        const query = getRandomProcessId(processesList);
        const value = {$set: {cpuUsage : Math.round(Math.random() * 100)}};

        processesDb.update(query, value);
    });
//TODO WJ: notify entity did change
}, eachSecond);

const processesDb = new Datastore({inMemoryOnly: true});

processesDb.insert(processes);
module.exports = processesDb;
