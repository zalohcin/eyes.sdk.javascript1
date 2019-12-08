'use strict'

const {GeneralUtils} = require('@applitools/eyes-common')

class TestResultReportSummary {
  constructor() {
    this._sdk = 'js4'
    this._id = GeneralUtils.getEnvValue('APPLITOOLS_REPORT_ID') || '0000-0000'
    this._sandbox =
      GeneralUtils.getEnvValue('APPLITOOLS_REPORT_TO_SANDBOX', true) === true ||
      !GeneralUtils.getEnvValue('TRAVIS_TAG') ||
      !GeneralUtils.getEnvValue('TRAVIS_TAG').includes('RELEASE_CANDIDATE')

    /** @type {TestResult[]} */
    this._results = []
  }

  /**
   * @return {string}
   */
  getId() {
    return this._id
  }

  /**
   * @param {string} value
   */
  setId(value) {
    this._id = value
  }

  /**
   * @return {boolean}
   */
  getSandbox() {
    return this._sandbox
  }

  /**
   * @param {boolean} value
   */
  setSandbox(value) {
    this._sandbox = value
  }

  /**
   * @return {TestResult[]}
   */
  getResults() {
    return this._results
  }

  /**
   * @param {TestResult[]} value
   */
  setResults(value) {
    this._results = value
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this)
  }
}

exports.TestResultReportSummary = TestResultReportSummary
