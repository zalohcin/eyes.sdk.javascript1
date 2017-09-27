'use strict';

/**
 * Argument validation utilities.
 */
class ArgumentGuard {

    //noinspection JSUnusedGlobalSymbols
    /**
     * Fails if the input parameter equals the input value.
     *
     * @param {Object} param The input parameter.
     * @param {Object} value The input value.
     * @param {String} paramName The input parameter name.
     */
    static notEqual(param, value, paramName) {
        if (param === value) {
            throw new Error(`IllegalArgument: ${paramName} === ${value}`);
        }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Fails if the input parameter is null.
     *
     * @param {Object} param The input parameter.
     * @param {String} paramName The input parameter name.
     */
    static notNull(param, paramName) {
        if (param === null || param === undefined) {
            throw new Error(`IllegalArgument: ${paramName} is null or undefined`);
        }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Fails if the input parameter is not null.
     *
     * @param {Object} param The input parameter.
     * @param {String} paramName The input parameter name.
     */
    static isNull(param, paramName) {
        if (param !== null && param !== undefined) {
            throw new Error(`IllegalArgument: ${paramName} is not null or undefined`);
        }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Fails if the input parameter string is null or empty.
     *
     * @param {Object} param The input parameter.
     * @param {String} paramName The input parameter name.
     */
    static notNullOrEmpty(param, paramName) {
        if (!param) {
            throw new Error(`IllegalArgument: ${paramName} is null or empty`);
        }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Fails if the input integer parameter is negative.
     *
     * @param {Number} param The input parameter.
     * @param {String} paramName The input parameter name.
     * @param {Boolean} isInteger Whether or not, the number should be en integer
     */
    static greaterThanOrEqualToZero(param, paramName, isInteger = false) {
        if (isInteger) {
            ArgumentGuard.isInteger(param, paramName);
        }

        if (param < 0) {
            throw new Error(`IllegalArgument: ${paramName} < 0`);
        }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Fails if the input integer parameter is smaller than 1.
     *
     * @param {Number} param The input parameter.
     * @param {String} paramName The input parameter name.
     * @param {Boolean} isInteger Whether or not, the number should be en integer
     */
    static greaterThanZero(param, paramName, isInteger = false) {
        if (isInteger) {
            ArgumentGuard.isInteger(param, paramName);
        }

        if (param <= 0) {
            throw new Error(`IllegalArgument: ${paramName} < 1`);
        }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Fails if the input integer parameter is equal to 0.
     * @param param The input parameter.
     * @param paramName The input parameter name.
     * @param {Boolean} isInteger Whether or not, the number should be en integer
     */
    static notZero(param, paramName, isInteger = false) {
        if (isInteger) {
            ArgumentGuard.isInteger(param, paramName);
        }

        if (param === 0) {
            throw new Error(`IllegalArgument: ${paramName} === 0`);
        }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Fails if the input number is not integer
     *
     * @param {Number} param The input parameter.
     * @param {String} paramName The input parameter name.
     */
    static isInteger(param, paramName) {
        if (!Number.isInteger(param)) {
            throw new Error(`IllegalArgument: ${paramName} is not integer`);
        }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Fails if isValid is false.
     *
     * @param {Boolean} isValid Whether the current state is valid.
     * @param {String} errMsg A description of the error.
     */
    static isValidState(isValid, errMsg) {
        if (!isValid) {
            throw new Error(`IllegalState: ${errMsg}`);
        }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Fails if isValid is false.
     *
     * @param {Object} param The input parameter.
     * @param {Object} type The expected param type
     */
    static isValidType(param, type) {
        if (!(param instanceof type)) {
            throw new Error(`IllegalType: ${param} is not instance of ${type}`);
        }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Fails if isValid is false.
     *
     * @param {*} value The input value.
     * @param {Object} enumObject The required enum object
     */
    static isValidEnumValue(value, enumObject) {
        if (!(enumObject.hasOwnProperty(value))) {
            throw new Error(`IllegalType: ${value} is not member of ${enumObject}`);
        }
    };
}

module.exports = ArgumentGuard;
