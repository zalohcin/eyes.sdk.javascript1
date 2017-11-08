'use strict';

const EyesError = require('./EyesError');

/**
 * Encapsulates an error converting between two coordinate types.
 */
class CoordinatesTypeConversionError extends EyesError {

    /**
     * Represents an error trying to convert between two coordinate types.
     *
     * @param {CoordinatesType} from The source coordinates type.
     * @param {CoordinatesType} to The target coordinates type.
     * @param [params...] Other params for Error constructor
     */
    constructor(from, to, ...params) {
        super(`Cannot convert from '${from}' to '${to}'`, ...params);
    }
}

module.exports = CoordinatesTypeConversionError;
