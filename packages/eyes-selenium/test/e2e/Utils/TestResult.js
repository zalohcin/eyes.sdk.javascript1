'use strict'

const {GeneralUtils} = require('@applitools/eyes-common')

class TestResult {
  /**
   * @param {string} testName
   * @param {boolean} passed
   * @param {Map<string, object>} parameters
   */
  constructor(testName, passed, parameters) {
    this._testName = testName
    this._passed = passed
    this._parameters = parameters
  }

  /**
   * @return {string}
   */
  getTestName() {
    return this._testName
  }

  /**
   * @param {string} value
   */
  setTestName(value) {
    this._testName = value
  }

  /**
   * @return {boolean}
   */
  getPassed() {
    return this._passed
  }

  /**
   * @param {boolean} value
   */
  setPassed(value) {
    this._passed = value
  }

  /**
   * @return {Map<object, object>}
   */
  getParameters() {
    return this._parameters
  }

  /**
   * @param {Map<string, object>} value
   */
  setParameters(value) {
    this._parameters = value
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this)
  }
}

exports.TestResult = TestResult
