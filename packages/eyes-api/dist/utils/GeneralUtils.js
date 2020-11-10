"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvValue = void 0;
const TypeUtils = require("./TypeUtils");
function getEnvValue(name, type = 'string') {
    if (process === undefined)
        return;
    const value = process.env[`APPLITOOLS_${name}`];
    if (value === undefined || value === 'null')
        return;
    if (type === 'boolean' && !TypeUtils.isBoolean(value)) {
        return value === 'true';
    }
    else if (type === 'number') {
        return Number(value);
    }
    return value;
}
exports.getEnvValue = getEnvValue;
//# sourceMappingURL=GeneralUtils.js.map