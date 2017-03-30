var express = require('express');
var cors = require('cors');
var app = express();
var server = require('http').Server(app);
var db = require('./database');
var attachOdata =  require('./oDataConfiguration');
var simulateHeartRates = require('./simulateHeartRates');
var stomp = require('./stomp');

app.use(cors({origin: true, credentials: true}));

var port = Number(process.env.npm_config_port) || 1337;

server.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
});

//Notify on crud actions
app.use("/patients*", function (req, res, next) {
    const crudMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (crudMethods.includes(req.method)) {
        stomp.then(client => client.send(`/topic/${'patients'}`));
    }
    next();
});

simulateHeartRates(() => stomp.then(client => client.send(`/topic/${'patients'}`)));
attachOdata(app);
