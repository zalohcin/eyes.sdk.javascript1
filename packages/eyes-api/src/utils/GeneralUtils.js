"use strict";
exports.__esModule = true;
exports.guid = exports.getEnvValue = void 0;
var TypeUtils = require("./TypeUtils");
function getEnvValue(name, type) {
    if (!process)
        return;
    var value = process.env["APPLITOOLS_" + name];
    if (value === undefined || value === 'null')
        return;
    if (type === 'boolean' && TypeUtils.isBoolean(value))
        return (value === 'true');
    if (type === 'number')
        return Number(value);
    return value;
}
exports.getEnvValue = getEnvValue;
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
exports.guid = guid;
