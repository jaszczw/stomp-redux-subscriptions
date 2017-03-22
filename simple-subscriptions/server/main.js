var express = require('express');
var cors = require('cors');
var app = express();
var db = require('./database');
var attachOdata =  require('./oDataConfiguration');

app.use(cors({origin: true, credentials: true}));

attachOdata(app);

var port = Number(process.env.npm_config_port) || 1337;

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
});