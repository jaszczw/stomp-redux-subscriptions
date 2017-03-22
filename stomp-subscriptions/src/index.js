"use strict";
exports.__esModule = true;
var v1_1 = require("uuid/v1");
var stomp_1 = require("./stomp");
var handlersManager_1 = require("./handlersManager");
var timeout = 8000;
var getConnectionErrorTimeout = function (emitter) { return setTimeout(function () {
    return emitter({ error: 'Connection-error' });
}, timeout); };
var createHandler = function (emitter) {
    var timer = getConnectionErrorTimeout(emitter);
    return function (stomp) {
        return function (message) {
            var data = JSON.parse(message.body);
            if (!data.heartBeat) {
                emitter(data);
                return;
            }
            if (timer) {
                clearTimeout(timer);
            }
            timer = getConnectionErrorTimeout(emitter);
            var target = message.headers['reply-to'];
            stomp.send(target, '');
        };
    };
};
var createSubscription = function (data, emitter) {
    var subId = v1_1["default"]();
    var replyTo = "/temp-queue/" + subId;
    var dataPayload = JSON.stringify({ payload: data, subId: subId });
    var headers = {
        'content-type': 'application/json',
        'reply-to': replyTo
    };
    //Handler is created first - as we may need to notify about connection-error
    var handler = createHandler(emitter);
    stomp_1.getStompClient().then(function (stomp) {
        stomp.send('/topic/create_subscription', dataPayload, headers);
        handlersManager_1.addHandler(replyTo, handler(stomp));
    })["catch"](function (err) {
        console.error('Failed to subscribe via stomp', err);
    });
    return {
        unsubscribe: function () {
            handlersManager_1.removeHandler(replyTo);
        }
    };
};
exports.subscriptionsService = {
    createSubscription: createSubscription
};
