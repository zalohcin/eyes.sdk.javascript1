'use strict';

const ArgumentGuard = require('../ArgumentGuard');
const TestResultsStatus = require('./TestResultsStatus');

/**
 * Eyes test results.
 */
class TestResults {

    constructor() {
        /** @type {TestResultsStatus} */
        this.status = null;

        /** @type {Object} */
        this.appUrls = null;
        /** @type {Object} */
        this.apiUrls = null;
        /** @type {Object} */
        this.stepsInfo = null;

        this.steps = null;
        this.matches = null;
        this.mismatches = null;
        this.missing = null;
        this.exactMatches = null;
        this.strictMatches = null;
        this.contentMatches = null;
        this.layoutMatches = null;
        this.noneMatches = null;

        /** @type {String} */
        this.url = null;

        /** @type {Boolean} */
        this.isNew = null;
        /** @type {Boolean} */
        this.isDifferent = null;
        /** @type {Boolean} */
        this.isAborted = null;
    }

    /**
     * @return {Boolean} Whether or not this test passed.
     */
    isPassed() {
        return this.status === TestResultsStatus.Passed;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {TestResultsStatus}
     */
    getStatus() {
        return this.status;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {TestResultsStatus} value
     */
    setStatus(value) {
        this.status = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Object}
     */
    getAppUrls() {
        return this.appUrls;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {Object} value
     */
    setAppUrls(value) {
        this.appUrls = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Object}
     */
    getApiUrls() {
        return this.apiUrls;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {Object} value
     */
    setApiUrls(value) {
        this.apiUrls = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Object}
     */
    getStepsInfo() {
        return this.stepsInfo;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {Object} value
     */
    setStepsInfo(value) {
        this.stepsInfo = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {int} The total number of test steps.
     */
    getSteps() {
        return this.steps;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {int} value The number of visual checkpoints in the test.
     */
    setSteps(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "steps");
        this.steps = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {int} The total number of test steps that matched the baseline.
     */
    getMatches() {
        return this.matches;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param value {int} The number of visual matches in the test.
     */
    setMatches(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "matches");
        this.matches = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {int} The total number of test steps that did not match the baseline.
     */
    getMismatches() {
        return this.mismatches;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {int} value The number of mismatches in the test.
     */
    setMismatches(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "mismatches");
        this.mismatches = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {int} The total number of baseline test steps that were missing in the test.
     */
    getMissing() {
        return this.missing;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {int} value The number of visual checkpoints that were available in the baseline but were not found in the current test.
     */
    setMissing(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "missing");
        this.missing = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {int} The total number of test steps that exactly matched the baseline.
     */
    getExactMatches() {
        return this.exactMatches;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {int} value The number of matches performed with match level set to {@link MatchLevel#Exact}
     */
    setExactMatches(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "exactMatches");
        this.exactMatches = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {int} The total number of test steps that strictly matched the
     * baseline.
     */
    getStrictMatches() {
        return this.strictMatches;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {int} value The number of matches performed with match level set to {@link MatchLevel#Strict}
     */
    setStrictMatches(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "strictMatches");
        this.strictMatches = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {int} The total number of test steps that matched the baseline by
     * content.
     */
    getContentMatches() {
        return this.contentMatches;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {int} value The number of matches performed with match level set to {@link MatchLevel#Content}
     */
    setContentMatches(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "contentMatches");
        this.contentMatches = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {int} The total number of test steps that matched the baseline by layout.
     */
    getLayoutMatches() {
        return this.layoutMatches;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {int} value The number of matches performed with match level set to {@link MatchLevel#Layout}
     */
    setLayoutMatches(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "layoutMatches");
        this.layoutMatches = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {int} The total number of test steps that matched the baseline without performing any comparison.
     */
    getNoneMatches() {
        return this.noneMatches;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {int} value The number of matches performed with match level set to {@link MatchLevel#None}
     */
    setNoneMatches(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "noneMatches");
        this.noneMatches = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {String} The URL where test results can be viewed.
     */
    getUrl() {
        return this.url;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {String} value The URL of the test results.
     */
    setUrl(value) {
        this.url = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Boolean} Whether or not this is a new test.
     */
    getIsNew() {
        return this.isNew;
    }

    /**
     * @param {Boolean} value Whether or not this test has an existing baseline.
     */
    setIsNew(value) {
        this.isNew = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Boolean}
     */
    getIsDifferent() {
        return this.isDifferent;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {Boolean} value
     */
    setIsDifferent(value) {
        this.isDifferent = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Boolean}
     */
    getIsAborted() {
        return this.isAborted;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {Boolean} value
     */
    setIsAborted(value) {
        this.isAborted = value;
    }

    /** @override */
    toString() {
        const isNewTestStr = this.isNew ? "New test" : "Existing test";
        return `${isNewTestStr} [steps: ${this.steps}, matches: ${this.matches}, mismatches: ${this.mismatches}, missing: ${this.missing}] , URL: ${this.url}, status: ${this.status}`;
    }
}

module.exports = TestResults;
