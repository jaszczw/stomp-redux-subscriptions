const Datastore = require('nedb');
const _  = require('lodash/fp');

let id = 1;
const zeroPad = _.padCharsStart('0')(2);

const getProcessDomainObject = (processNumber) => ({
    active: true,
    locationName: "Server 1",
    processName: `Process ${zeroPad(String(id++))}`,
    processNumber: processNumber,
    status: 1,
    cpuUsage: 0
});

const processes = [
    getProcessDomainObject('8416-1918-1711'),
    getProcessDomainObject('1096-2916-1214'),
    getProcessDomainObject('2486-5917-1712'),
    getProcessDomainObject('1116-3918-1871'),
];

const processesDb = new Datastore({inMemoryOnly: true});

processesDb.insert(processes);
module.exports = processesDb;
