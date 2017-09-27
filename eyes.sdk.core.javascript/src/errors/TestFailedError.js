'use strict';

/**
 * Indicates that a test did not pass (i.e., test either failed or is a new test).
 */
class TestFailedError extends Error {

    /**
     * Creates a new TestFailedError instance.
     *
     * @param {TestResults} [testResults] The results of the current test if available, {@code null} otherwise.
     * @param {String} [msg]
     * @param [id]
     */
    constructor(testResults, msg, id) {
        super(msg, id);
        this._testResults = testResults;

        if (new.target === TestFailedError) {
            Error.captureStackTrace(this, TestFailedError);
        }
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
