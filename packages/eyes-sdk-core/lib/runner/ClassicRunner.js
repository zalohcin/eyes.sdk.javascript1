'use strict'

const {GeneralUtils} = require('@applitools/eyes-common')
const {EyesRunner} = require('./EyesRunner')
const {TestResultsSummary} = require('./TestResultsSummary')

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
   * @param {boolean} [throwEx=true]
   * @return {Promise<TestResultsSummary>}
   */
  async getAllTestResults(throwEx = true) {
    const summary = new TestResultsSummary(this._allTestResult)

    if (throwEx === true) {
      for (let result of summary.getAllResults()) {
        if (result.getException()) {
          throw result.getException()
        }
      }
    }

    await this._closeAllBatches()
    return summary
  }
}

exports.ClassicRunner = ClassicRunner
