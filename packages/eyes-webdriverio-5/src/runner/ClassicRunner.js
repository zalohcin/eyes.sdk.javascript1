'use strict'

const {EyesRunner} = require('./EyesRunner')
const {TestResultSummary} = require('./TestResultSummary')
const {GeneralUtils} = require('@applitools/eyes-common')

class ClassicRunner extends EyesRunner {
  constructor() {
    super()

    /** @type {TestResults[]} */
    this._allTestResult = []
    this._getRenderingInfo = undefined
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

  /**
   * @param {boolean} [shouldThrowException=true]
   * @return {Promise<TestResultSummary>}
   */
  async getAllTestResults(shouldThrowException = true) {
    const testResultSummary = new TestResultSummary(this._allTestResult)

    if (shouldThrowException === true) {
      testResultSummary.getAllResults().forEach(result => {
        if (result.getException()) {
          throw result.getException()
        }
      })
    }

    await this._closeAllBatches()
    return testResultSummary
  }
}

exports.ClassicRunner = ClassicRunner
