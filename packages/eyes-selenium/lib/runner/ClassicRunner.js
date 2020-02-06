'use strict'

const {EyesRunner} = require('./EyesRunner')
const {TestResultsSummary} = require('./TestResultsSummary')
const {TestResultContainer} = require('./TestResultContainer')
const {makeGetRenderingInfo, makeGetBatchInfo, getScmInfo} = require('@applitools/eyes-sdk-core')

class ClassicRunner extends EyesRunner {
  constructor() {
    super()

    /** @type {TestResults[]} */
    this._allTestResult = []
    this._getRenderingInfo = undefined
  }

  makeGetRenderingInfo(getRenderingInfo) {
    if (!this._getRenderingInfo) {
      this._getRenderingInfo = makeGetRenderingInfo(getRenderingInfo)
    }
  }

  makeGetBatchInfo(fetchBatchInfo) {
    if (!this._getBatchInfo) {
      this._getBatchInfo = makeGetBatchInfo(fetchBatchInfo)
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

  async getBatchInfoWithCache(batchId) {
    if (this._getBatchInfo) {
      return this._getBatchInfo(batchId)
    } else {
      throw new Error(
        'Eyes runner could not get batch info since makeGetBatchInfo was not called before',
      )
    }
  }

  async getScmInfoWithCache(...args) {
    return getScmInfo(...args)
  }

  /**
   * @param {boolean} [shouldThrowException=true]
   * @return {Promise<TestResultsSummary>}
   */
  // https://trello.com/c/McCg97IK/214-getalltestresults-doesnt-throw-exceptions
  async getAllTestResults(_shouldThrowException = true) {
    const allResults = []
    for (const testResults of this._allTestResult) {
      allResults.push(new TestResultContainer(testResults))
    }

    await this._closeAllBatches()
    return new TestResultsSummary(allResults)
  }
}

exports.ClassicRunner = ClassicRunner
