"use strict";
exports.__esModule = true;
var handlersHash = {};
var addHandler = function (subscription, handler) {
    handlersHash[subscription] = handler;
};
exports.addHandler = addHandler;
var getHandler = function (subscription) {
    return handlersHash[subscription];
};
exports.getHandler = getHandler;
var removeHandler = function (subscription) {
    return delete handlersHash[subscription];
};
exports.removeHandler = removeHandler;
