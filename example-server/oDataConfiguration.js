var ODataServer = require("simple-odata-server");
var db = require('./database');
var host = process.env.npm_config_host || 'http://localhost';
var port = Number(process.env.npm_config_port) || 1337;

module.exports = (app) => {
    var model = {
        namespace: "Showcase",
        entityTypes: {
            "Process": {
                "_id": {"type": "Edm.String", key: true},
                "processName": {"type": "Edm.String"},
                "processNumber": {"type": "Edm.String"},
                "locationName": {"type": "Edm.String"},
                "status": {"type": "Edm.Decimal"},
                "active": {"type": "Edm.Boolean"},
                "cpuUsage": {"type": "Edm.Decimal"},
            },
        },
        entitySets: {
            "processes": {
                entityType: "Showcase.Process"
            }
        }
    };

    var odataServer = ODataServer(`${host}:${port}`)
        .model(model)
        .onNeDB(function (es, cb) {
            cb(null, db.processesDb)
        });

    app.use("/processes*", function (req, res) {
        odataServer.handle(req, res);
    });

};

// const query = {status: {$gte: 2}};
// ===> GraphQL on Appolo.js

//Mongoose => feathers