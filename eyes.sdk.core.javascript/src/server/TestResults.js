'use strict';

const ArgumentGuard = require('../ArgumentGuard');

/**
 * Eyes test results.
 */
class TestResults {

    constructor() {
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
    }

    /**
     * @return {Boolean} Whether or not this test passed.
     */
    isPassed() {
        return (!this.isNew && this.mismatches === 0 && this.missing === 0);
    }

    /**
     * @return {int} The total number of test steps.
     */
    getSteps() {
        return this.steps;
    }

    /**
     * @param {int} value The number of visual checkpoints in the test.
     */
    setSteps(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "steps");
        this.steps = value;
    }

    /**
     * @return {int} The total number of test steps that matched the baseline.
     */
    getMatches() {
        return this.matches;
    }

    /**
     * @param value {int} The number of visual matches in the test.
     */
    setMatches(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "matches");
        this.matches = value;
    }

    /**
     * @return {int} The total number of test steps that did not match the baseline.
     */
    getMismatches() {
        return this.mismatches;
    }

    /**
     * @param {int} value The number of mismatches in the test.
     */
    setMismatches(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "mismatches");
        this.mismatches = value;
    }

    /**
     * @return {int} The total number of baseline test steps that were missing in the test.
     */
    getMissing() {
        return this.missing;
    }

    /**
     * @param {int} value The number of visual checkpoints that were available in the baseline but were not found in the current test.
     */
    setMissing(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "missing");
        this.missing = value;
    }

    /**
     * @return {int} The total number of test steps that exactly matched the baseline.
     */
    getExactMatches() {
        return this.exactMatches;
    }

    /**
     * @param {int} value The number of matches performed with match level set to {@link MatchLevel#Exact}
     */
    setExactMatches(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "exactMatches");
        this.exactMatches = value;
    }

    /**
     * @return {int} The total number of test steps that strictly matched the
     * baseline.
     */
    getStrictMatches() {
        return this.strictMatches;
    }

    /**
     * @param {int} value The number of matches performed with match level set to {@link MatchLevel#Strict}
     */
    setStrictMatches(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "strictMatches");
        this.strictMatches = value;
    }

    /**
     * @return {int} The total number of test steps that matched the baseline by
     * content.
     */
    getContentMatches() {
        return this.contentMatches;
    }

    /**
     * @param {int} value The number of matches performed with match level set to {@link MatchLevel#Content}
     */
    setContentMatches(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "contentMatches");
        this.contentMatches = value;
    }

    /**
     * @return {int} The total number of test steps that matched the baseline by layout.
     */
    getLayoutMatches() {
        return this.layoutMatches;
    }

    /**
     * @param {int} value The number of matches performed with match level set to {@link MatchLevel#Layout}
     */
    setLayoutMatches(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "layoutMatches");
        this.layoutMatches = value;
    }

    /**
     * @return {int} The total number of test steps that matched the baseline without performing any comparison.
     */
    getNoneMatches() {
        return this.noneMatches;
    }

    /**
     * @param {int} value The number of matches performed with match level set to {@link MatchLevel#None}
     */
    setNoneMatches(value) {
        ArgumentGuard.greaterThanOrEqualToZero(value, "noneMatches");
        this.noneMatches = value;
    }

    /**
     * @return {String} The URL where test results can be viewed.
     */
    getUrl() {
        return this.url;
    }

    /**
     * @param {String} value The URL of the test results.
     */
    setUrl(value) {
        this.url = value;
    }

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

    toString() {
        const isNewTestStr = this.isNew ? "New test" : "Existing test";
        return `${isNewTestStr} [steps: ${this.steps}, matches: ${this.matches}, mismatches:${this.mismatches}, missing: ${this.missing}] , URL: ${this.url}`;
    }
}

module.exports = TestResults;
