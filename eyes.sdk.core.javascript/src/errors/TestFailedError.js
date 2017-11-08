'use strict';

const EyesError = require('./EyesError');

/**
 * Indicates that a test did not pass (i.e., test either failed or is a new test).
 */
class TestFailedError extends EyesError {

    /**
     * Creates a new TestFailedError instance.
     *
     * @param {TestResults} [testResults] The results of the current test if available, {@code null} otherwise.
     * @param {String} [message] The error description string
     * @param [params...] Other params for Error constructor
     */
    constructor(testResults, message, ...params) {
        super(message, ...params);

        this._testResults = testResults;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {TestResults} The failed test results, or {@code null} if the test has not yet ended (e.g., when thrown due to {@link FailureReports#IMMEDIATE} settings).
     */
    getTestResults() {
        return this._testResults;
    }
}

module.exports = TestFailedError;
