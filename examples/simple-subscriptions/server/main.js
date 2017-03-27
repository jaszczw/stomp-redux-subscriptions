var express = require('express');
var cors = require('cors');
var app = express();
var server = require('http').Server(app);
var db = require('./database');
var attachOdata =  require('./oDataConfiguration');
var io = require('socket.io')(server);
var connectSocket = require('./socketIo');
var simulateHeartRates = require('./simulateHeartRates');

app.use(cors({origin: true, credentials: true}));

var port = Number(process.env.npm_config_port) || 1337;

server.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
});

const sockets = connectSocket(io);

//Notify on crud actions
app.use("/patients*", function (req, res, next) {
    const crudMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (crudMethods.includes(req.method)) {
        sockets.notifyRoom('patients', 'patients-modified');
    }
    next();
});

simulateHeartRates(() => sockets.notifyRoom('patients', 'patients-modified'));
attachOdata(app);
