'use strict';

const TestFailedError = require('./TestFailedError');

/**
 * Indicates that a test did not pass (i.e., test either failed or is a new test).
 */
class DiffsFoundError extends TestFailedError {

    /**
     * Creates a new DiffsFoundError instance.
     *
     * @param {TestResults} [testResults] The results of the current test if available, {@code null} otherwise.
     * @param {String} [msg]
     * @param [id]
     */
    constructor(testResults, msg, id) {
        super(testResults, msg, id);

        if (new.target === DiffsFoundError) {
            Error.captureStackTrace(this, DiffsFoundError);
        }
    }
}

module.exports = DiffsFoundError;
