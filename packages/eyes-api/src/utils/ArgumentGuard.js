"use strict";
exports.__esModule = true;
exports.custom = exports.instanceOf = exports.isEnumValue = exports.isObject = exports.isArray = exports.isNumeric = exports.isAlpha = exports.isAlphanumeric = exports.isString = exports.isGreaterThenOrEqual = exports.isGreaterThen = exports.isLessThenOrEqual = exports.isLessThen = exports.isInteger = exports.isNumber = exports.isBoolean = exports.notNull = void 0;
var TypeUtils = require("./TypeUtils");
function notNull(value, _a) {
    var name = _a.name;
    if (TypeUtils.isNull(value)) {
        throw new Error("IllegalArgument: " + name + " is null or undefined");
    }
}
exports.notNull = notNull;
function isBoolean(value, _a) {
    var name = _a.name, _b = _a.strict, strict = _b === void 0 ? true : _b;
    if (strict)
        notNull(value, { name: name });
    if (!TypeUtils.isBoolean(value)) {
        throw new Error("IllegalType: " + name + " is not a boolean");
    }
}
exports.isBoolean = isBoolean;
function isNumber(value, _a) {
    var name = _a.name, _b = _a.strict, strict = _b === void 0 ? true : _b, lt = _a.lt, lte = _a.lte, gt = _a.gt, gte = _a.gte;
    if (strict)
        notNull(value, { name: name });
    if (!TypeUtils.isNumber(value)) {
        throw new Error("IllegalArgument: " + name + " is not a number");
    }
    if (!TypeUtils.isNull(lt))
        isLessThen(value, lt, { name: name });
    else if (!TypeUtils.isNull(lte))
        isLessThenOrEqual(value, lt, { name: name });
    else if (!TypeUtils.isNull(gt))
        isGreaterThenOrEqual(value, lt, { name: name });
    else if (!TypeUtils.isNull(gte))
        isGreaterThen(value, lt, { name: name });
}
exports.isNumber = isNumber;
function isInteger(value, _a) {
    var name = _a.name, _b = _a.strict, strict = _b === void 0 ? true : _b, lt = _a.lt, lte = _a.lte, gt = _a.gt, gte = _a.gte;
    if (strict)
        notNull(value, { name: name });
    if (!TypeUtils.isInteger(value)) {
        throw new Error("IllegalArgument: " + name + " is not an integer");
    }
    if (!TypeUtils.isNull(lt))
        isLessThen(value, lt, { name: name });
    else if (!TypeUtils.isNull(lte))
        isLessThenOrEqual(value, lt, { name: name });
    else if (!TypeUtils.isNull(gt))
        isGreaterThenOrEqual(value, lt, { name: name });
    else if (!TypeUtils.isNull(gte))
        isGreaterThen(value, lt, { name: name });
}
exports.isInteger = isInteger;
function isLessThen(value, limit, _a) {
    var name = _a.name;
    if (!(value < limit)) {
        throw new Error("IllegalArgument: " + name + " must be < " + limit);
    }
}
exports.isLessThen = isLessThen;
function isLessThenOrEqual(value, limit, _a) {
    var name = _a.name;
    if (!(value <= limit)) {
        throw new Error("IllegalArgument: " + name + " must be <= " + limit);
    }
}
exports.isLessThenOrEqual = isLessThenOrEqual;
function isGreaterThen(value, limit, _a) {
    var name = _a.name;
    if (!(value > limit)) {
        throw new Error("IllegalArgument: " + name + " must be > " + limit);
    }
}
exports.isGreaterThen = isGreaterThen;
function isGreaterThenOrEqual(value, limit, _a) {
    var name = _a.name;
    if (!(value >= limit)) {
        throw new Error("IllegalArgument: " + name + " must be >= " + limit);
    }
}
exports.isGreaterThenOrEqual = isGreaterThenOrEqual;
function isString(value, _a) {
    var name = _a.name, _b = _a.strict, strict = _b === void 0 ? true : _b, alpha = _a.alpha, numeric = _a.numeric;
    if (strict)
        notNull(value, { name: name });
    if (!TypeUtils.isString(value)) {
        throw new Error("IllegalArgument: " + name + " is not a string");
    }
    if (alpha && numeric)
        isAlphanumeric(value, { name: name });
    else if (alpha)
        isAlpha(value, { name: name });
    else if (numeric)
        isNumeric(value, { name: name });
}
exports.isString = isString;
function isAlphanumeric(value, _a) {
    var name = _a.name;
    if (!/^[a-z0-9]+$/i.test(value)) {
        throw new Error("IllegalArgument: " + name + " is not alphanumeric");
    }
}
exports.isAlphanumeric = isAlphanumeric;
function isAlpha(value, _a) {
    var name = _a.name;
    if (!/^[a-z]+$/i.test(value)) {
        throw new Error("IllegalArgument: " + name + " is not alphabetic");
    }
}
exports.isAlpha = isAlpha;
function isNumeric(value, _a) {
    var name = _a.name;
    if (!/^[0-9]+$/.test(value)) {
        throw new Error("IllegalArgument: " + name + " is not numeric");
    }
}
exports.isNumeric = isNumeric;
function isArray(value, _a) {
    var name = _a.name, _b = _a.strict, strict = _b === void 0 ? true : _b;
    if (strict)
        notNull(value, { name: name });
    if (!TypeUtils.isArray(value)) {
        throw new Error("IllegalArgument: " + name + " is not an array");
    }
}
exports.isArray = isArray;
function isObject(value, _a) {
    var name = _a.name, _b = _a.strict, strict = _b === void 0 ? true : _b;
    if (strict)
        notNull(value, { name: name });
    if (!TypeUtils.isObject(value)) {
        throw new Error("IllegalArgument: " + name + " is not an object");
    }
}
exports.isObject = isObject;
function isEnumValue(value, enumeration, _a) {
    var name = _a.name, _b = _a.strict, strict = _b === void 0 ? true : _b;
    if (strict)
        notNull(value, { name: name });
    var values = new Set(Object.values(enumeration));
    if (!values.has(value)) {
        throw new Error("IllegalArgument: " + name + " should be one of [" + Array.from(values, function (value) { return JSON.stringify(value); }).join(', ') + "]");
    }
}
exports.isEnumValue = isEnumValue;
function instanceOf(value, ctor, _a) {
    var name = _a.name, _b = _a.strict, strict = _b === void 0 ? true : _b;
    if (strict)
        notNull(value, { name: name });
    if (!TypeUtils.instanceOf(value, ctor)) {
        throw new Error("IllegalType: " + name + " is not an instance of " + ctor.name);
    }
}
exports.instanceOf = instanceOf;
function custom(value, check, _a) {
    var name = _a.name, _b = _a.strict, strict = _b === void 0 ? true : _b, message = _a.message;
    if (strict)
        notNull(value, { name: name });
    if (!check(value)) {
        throw new Error("IllegalType: " + name + " " + (message || 'is unknown type'));
    }
}
exports.custom = custom;
