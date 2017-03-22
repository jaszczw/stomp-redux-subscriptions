"use strict";
exports.__esModule = true;
// import SockJS from 'sockjs-client';
var webstomp_client_1 = require("webstomp-client");
var handlersManager_1 = require("./handlersManager");
var retryCount = 0;
var pendingConnection = false;
var retryIncrement = 5000; // 5seconds
var getRetryTimer = function () {
    return Math.min(retryIncrement * 6, retryIncrement * (retryCount + 1));
};
var connect = function () { return new Promise(function (resolve, reject) {
    if (pendingConnection) {
        console.log('I shouldnt land here');
        reject();
    }
    pendingConnection = true;
    var wsclient = webstomp_client_1.client('ws://127.0.0.1:15674/ws', {
        binary: false,
        debug: true,
        heartbeat: { incoming: 5000, outgoing: 5000 }
    });
    var retryTimer = getRetryTimer();
    var errorCallback = function () {
        reject();
        console.log("We will retry connection in " + retryTimer + " seconds");
        setTimeout(function () {
            pendingConnection = false;
            localStompPromise = connect();
        }, retryTimer);
    };
    var connectCallback = function () {
        retryCount = 0;
        pendingConnection = false;
        var extStompClient = wsclient;
        extStompClient.onreceive = unhandledHandler;
        resolve(wsclient);
    };
    return wsclient.connect({
        login: 'guest',
        passcode: 'guest'
    }, connectCallback, errorCallback);
}); };
var localStompPromise = connect();
var unhandledHandler = function (message) {
    var subscription = message.headers.subscription;
    var handler = handlersManager_1.getHandler(subscription);
    if (handler) {
        handler(message);
    }
};
exports.getStompClient = function () { return localStompPromise; };
