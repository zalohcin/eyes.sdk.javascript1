'use strict';

const TestFailedError = require('./TestFailedError');

/**
 * Indicates that an existing test ended, and that differences where found from the baseline.
 */
class DiffsFoundError extends TestFailedError {

    /**
     * Creates a new DiffsFoundError instance.
     *
     * @param {TestResults} testResults The results of the current test if available, {@code null} otherwise.
     * @param {String} message The error description string
     * @param [params...] Other params for Error constructor
     */
    constructor(testResults, message, ...params) {
        super(testResults, message, ...params);
    }
}

module.exports = DiffsFoundError;
