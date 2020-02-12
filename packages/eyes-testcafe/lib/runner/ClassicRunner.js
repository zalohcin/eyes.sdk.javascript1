'use strict'

const {GeneralUtils} = require('@applitools/eyes-common')
const {EyesRunner} = require('./EyesRunner')
const {TestResultsSummary} = require('./TestResultsSummary')
const {TestResultContainer} = require('./TestResultContainer')

class ClassicRunner extends EyesRunner {
  constructor() {
    super()

    /** @type {TestResults[]} */
    this._allTestResult = []
    this._getRenderingInfo = undefined
  }

  /**
   * @param {boolean} [shouldThrowException=true]
   * @return {Promise<TestResultsSummary>}
   */
  async getAllTestResults(_shouldThrowException = true) {
    // eslint-disable-line no-unused-vars
    const allResults = []
    for (const testResults of this._allTestResult) {
      allResults.push(new TestResultContainer(testResults))
    }

    await this._closeAllBatches()
    return new TestResultsSummary(allResults)
  }

  makeGetRenderingInfo(getRenderingInfo) {
    if (!this._getRenderingInfo) {
      this._getRenderingInfo = GeneralUtils.cachify(getRenderingInfo)
    }
  }

  async getRenderingInfoWithCache() {
    if (this._getRenderingInfo) {
      return this._getRenderingInfo()
    } else {
      throw new Error(
        'Eyes runner could not get rendering info since makeGetRenderingInfo was not called before',
      )
    }
  }
}

exports.ClassicRunner = ClassicRunner
