"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.custom = exports.instanceOf = exports.isEnumValue = exports.isObject = exports.isArray = exports.isNumeric = exports.isAlpha = exports.isAlphanumeric = exports.isString = exports.isGreaterThenOrEqual = exports.isGreaterThen = exports.isLessThenOrEqual = exports.isLessThen = exports.isInteger = exports.isNumber = exports.isBoolean = exports.notNull = void 0;
const TypeUtils = require("./TypeUtils");
function notNull(value, { name }) {
    if (TypeUtils.isNull(value)) {
        throw new Error(`IllegalArgument: ${name} is null or undefined`);
    }
}
exports.notNull = notNull;
function isBoolean(value, { name, strict = true }) {
    if (strict)
        notNull(value, { name });
    if (!TypeUtils.isBoolean(value)) {
        throw new Error(`IllegalType: ${name} is not a boolean`);
    }
}
exports.isBoolean = isBoolean;
function isNumber(value, { name, strict = true, lt, lte, gt, gte }) {
    if (strict)
        notNull(value, { name });
    if (!TypeUtils.isNumber(value)) {
        throw new Error(`IllegalArgument: ${name} is not a number`);
    }
    if (!TypeUtils.isNull(lt))
        isLessThen(value, lt, { name });
    else if (!TypeUtils.isNull(lte))
        isLessThenOrEqual(value, lt, { name });
    else if (!TypeUtils.isNull(gt))
        isGreaterThenOrEqual(value, lt, { name });
    else if (!TypeUtils.isNull(gte))
        isGreaterThen(value, lt, { name });
}
exports.isNumber = isNumber;
function isInteger(value, { name, strict = true, lt, lte, gt, gte }) {
    if (strict)
        notNull(value, { name });
    if (!TypeUtils.isInteger(value)) {
        throw new Error(`IllegalArgument: ${name} is not an integer`);
    }
    if (!TypeUtils.isNull(lt))
        isLessThen(value, lt, { name });
    else if (!TypeUtils.isNull(lte))
        isLessThenOrEqual(value, lt, { name });
    else if (!TypeUtils.isNull(gt))
        isGreaterThenOrEqual(value, lt, { name });
    else if (!TypeUtils.isNull(gte))
        isGreaterThen(value, lt, { name });
}
exports.isInteger = isInteger;
function isLessThen(value, limit, { name }) {
    if (!(value < limit)) {
        throw new Error(`IllegalArgument: ${name} must be < ${limit}`);
    }
}
exports.isLessThen = isLessThen;
function isLessThenOrEqual(value, limit, { name }) {
    if (!(value <= limit)) {
        throw new Error(`IllegalArgument: ${name} must be <= ${limit}`);
    }
}
exports.isLessThenOrEqual = isLessThenOrEqual;
function isGreaterThen(value, limit, { name }) {
    if (!(value > limit)) {
        throw new Error(`IllegalArgument: ${name} must be > ${limit}`);
    }
}
exports.isGreaterThen = isGreaterThen;
function isGreaterThenOrEqual(value, limit, { name }) {
    if (!(value >= limit)) {
        throw new Error(`IllegalArgument: ${name} must be >= ${limit}`);
    }
}
exports.isGreaterThenOrEqual = isGreaterThenOrEqual;
function isString(value, { name, strict = true, alpha, numeric }) {
    if (strict)
        notNull(value, { name });
    if (!TypeUtils.isString(value)) {
        throw new Error(`IllegalArgument: ${name} is not a string`);
    }
    if (alpha && numeric)
        isAlphanumeric(value, { name });
    else if (alpha)
        isAlpha(value, { name });
    else if (numeric)
        isNumeric(value, { name });
}
exports.isString = isString;
function isAlphanumeric(value, { name }) {
    if (!/^[a-z0-9]+$/i.test(value)) {
        throw new Error(`IllegalArgument: ${name} is not alphanumeric`);
    }
}
exports.isAlphanumeric = isAlphanumeric;
function isAlpha(value, { name }) {
    if (!/^[a-z]+$/i.test(value)) {
        throw new Error(`IllegalArgument: ${name} is not alphabetic`);
    }
}
exports.isAlpha = isAlpha;
function isNumeric(value, { name }) {
    if (!/^[0-9]+$/.test(value)) {
        throw new Error(`IllegalArgument: ${name} is not numeric`);
    }
}
exports.isNumeric = isNumeric;
function isArray(value, { name, strict = true }) {
    if (strict)
        notNull(value, { name });
    if (!TypeUtils.isArray(value)) {
        throw new Error(`IllegalArgument: ${name} is not an array`);
    }
}
exports.isArray = isArray;
function isObject(value, { name, strict = true }) {
    if (strict)
        notNull(value, { name });
    if (!TypeUtils.isObject(value)) {
        throw new Error(`IllegalArgument: ${name} is not an object`);
    }
}
exports.isObject = isObject;
function isEnumValue(value, enumeration, { name, strict = true }) {
    if (strict)
        notNull(value, { name });
    const values = new Set(Object.values(enumeration));
    if (!values.has(value)) {
        throw new Error(`IllegalArgument: ${name} should be one of [${Array.from(values, (value) => JSON.stringify(value)).join(', ')}]`);
    }
}
exports.isEnumValue = isEnumValue;
function instanceOf(value, ctor, { name, strict = true }) {
    if (strict)
        notNull(value, { name });
    if (!TypeUtils.instanceOf(value, ctor)) {
        throw new Error(`IllegalType: ${name} is not an instance of ${ctor.name}`);
    }
}
exports.instanceOf = instanceOf;
function custom(value, check, { name, strict = true, message }) {
    if (strict)
        notNull(value, { name });
    if (!check(value)) {
        throw new Error(`IllegalType: ${name} ${message || 'is unknown type'}`);
    }
}
exports.custom = custom;
//# sourceMappingURL=ArgumentGuard.js.map