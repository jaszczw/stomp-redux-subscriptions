var express = require('express');
var cors = require('cors');
var app = express();
var db = require('./database');
var attachOdata =  require('./oDataConfiguration');
var stomp = require('./stomp-subscriptions');

app.use(cors({origin: true, credentials: true}));

//Hack for any CRUD action notify that 'processes' entity has changed. Could be properly resolved in handler
app.use("/processes*", function (req, res, next) {
    const crudMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if(crudMethods.includes(req.method)) {
        stomp.then(client => client.send(`/topic/${'processes'}`));
    }
    next();
});

attachOdata(app);

var port = Number(process.env.npm_config_port) || 1338;

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
});
