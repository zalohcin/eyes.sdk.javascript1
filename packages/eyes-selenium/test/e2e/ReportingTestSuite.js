'use strict'

const {TestResultReportSummary} = require('./Utils/TestResultReportSummary')
const {TestResult} = require('./Utils/TestResult')
const {TestUtils} = require('./Utils/TestUtils')

class ReportingTestSuite {
  constructor() {
    this._reportSummary = new TestResultReportSummary()
    this._suiteArgs = new Map()
    this._testArgs = {}
  }

  /**
   * Identifies a method that is called once to perform setup before any child tests are run.
   *
   * @return {Promise}
   */
  async oneTimeSetup() {
    // do nothing
  }

  /**
   * Identifies a method to be called immediately before each test is run.
   *
   * Should be called like this:
   * ```
   * beforeEach(function() {
   *   testSuite.setup(this);
   * });
   *
   * @param {Context} context
   * @return {Promise}
   */
  async setup(context) {
    // TestContext tc = TestContext.CurrentContext;
  }

  /**
   * Identifies a method to be called immediately after each test is run.
   *
   * Should be called like this:
   * ```
   * afterEach(function() {
   *   testSuite.tearDown(this);
   * });
   * ```
   *
   * @param {Context} context
   * @return {Promise}
   */
  async tearDown(context) {
    const testResult = this._getTestResult(context)
    this._reportSummary.getResults().push(testResult)
    this._testArgs = {}
  }

  /**
   * Identifies a method to be called once after all the child tests have run.
   *
   * @return {Promise}
   */
  async oneTimeTearDown() {
    await TestUtils.sendReport(this._reportSummary)
  }

  /**
   * @return {object}
   */
  getTestArguments() {
    return this._testArgs
  }

  /**
   * @param {object} value
   */
  setTestArguments(value) {
    this._testArgs = value
  }

  /**
   * @param {Context} context
   * @return {TestResult}
   * @private
   */
  _getTestResult(context) {
    const passed = context.currentTest.state === 'passed'
    return new TestResult(context.currentTest.title, passed, this._getTestParameters(context))
  }

  /**
   * @param {Context} context
   * @return {Map<string, object>}
   * @private
   */
  _getTestParameters(context) {
    const result = new Map()
    for (const [key, value] of this._suiteArgs) {
      result.set(key, value)
    }

    const testArgs = this.getTestArguments()
    if (testArgs && Object.keys(testArgs).length > 0) {
      for (const [key, value] of Object.entries(testArgs)) {
        result.set(key, value)
      }
    }
    return result
  }

  /**
   * @param {string} sb
   * @param {object[]} args
   * @param {string} prefix
   * @param {string} postfix
   * @return {string}
   * @private
   */
  static _appendArguments(sb, args, prefix, postfix) {
    for (const arg of args) {
      sb += prefix
      sb += arg
      sb += postfix
    }
    return sb
  }
}

exports.ReportingTestSuite = ReportingTestSuite
