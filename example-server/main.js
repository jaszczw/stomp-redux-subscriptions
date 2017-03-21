var express = require('express');
var cors = require('cors');
var app = express();
var db = require('./database');
var randomize = require('./randomize');
var switchIssues = require('./switchIssues');
var attachOdata =  require('./oDataConfiguration');
var attachOAuth =  require('./oAuthConfiguration');
var stomp = require('./stomp');

app.use(cors({origin: true, credentials: true}));

app.post('/randomize-processes', function (req, res) {
    randomize(db.processesDb, res);

    stomp.then(client => client.send(`/topic/${'processes'}`));
});

app.post('/switch-issues', function (req, res) {
    switchIssues(db.processesDb, res);

    stomp.then(client => client.send(`/topic/${'processes'}`));
});

//Where it should lay?
app.use("/processes*", function (req, res, next) {
    const crudMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if(crudMethods.includes(req.method)) {
        stomp.then(client => client.send(`/topic/${'processes'}`));
    }
    next();
});

//My intervaled changes are not reflected hence pusher - but not needed.
const pusher = () =>
    setTimeout(()=> {
        stomp.then(client => client.send(`/topic/${'processes'}`));
        pusher();
    },
    4000
);

pusher();

const modulesPusher = () =>
    setTimeout(()=> {
            stomp.then(client => client.send(`/topic/${'modules'}`));
            modulesPusher();
        },
        8000
    );
modulesPusher();


attachOAuth(app);
attachOdata(app);

var port = Number(process.env.npm_config_port) || 1337;

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
});