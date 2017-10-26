'use strict';

const FailedTestError = require('./FailedTestError');

/**
 * Indicates that a new test (i.e., a test for which no baseline exists) ended.
 */
class NewTestError extends FailedTestError {

    /**
     * Creates a new NewTestError instance.
     *
     * @param {TestResults} [testResults] The results of the current test if available, {@code null} otherwise.
     * @param {String} [msg]
     * @param [id]
     */
    constructor(testResults, msg, id) {
        super(testResults, msg, id);

        if (new.target === NewTestError) {
            Error.captureStackTrace(this, NewTestError);
        }
    }
}

module.exports = NewTestError;
