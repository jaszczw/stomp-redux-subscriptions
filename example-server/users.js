const Datastore = require('nedb');
const users = [
    {
        id : 'polishUserID',
        username: 'userPL@gmail.com',
        password: '123456',
        language: 'pl',
    },
    {
        id : 'englishUserID',
        username: 'userEN@gmail.com',
        password: '123456',
        language: 'en',
    }
];

const usersDb = new Datastore({inMemoryOnly: true});
usersDb.insert(users);

module.exports = {
    usersDb,
    users
};
