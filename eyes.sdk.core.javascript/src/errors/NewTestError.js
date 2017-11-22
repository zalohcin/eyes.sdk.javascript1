'use strict';

const TestFailedError = require('./TestFailedError');

/**
 * Indicates that a new test (i.e., a test for which no baseline exists) ended.
 */
class NewTestError extends TestFailedError {

    /**
     * Creates a new NewTestError instance.
     *
     * @param {TestResults} testResults The results of the current test if available, {@code null} otherwise.
     * @param {String} message The error description string
     * @param [params...] Other params for Error constructor
     */
    constructor(testResults, message, ...params) {
        super(testResults, message, ...params);
    }
}

module.exports = NewTestError;
