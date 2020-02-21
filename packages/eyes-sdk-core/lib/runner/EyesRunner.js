'use strict'

const {GeneralUtils} = require('@applitools/eyes-common')
const getScmInfo = require('../getScmInfo')
const {TestResultsSummary} = require('./TestResultsSummary')

class EyesRunner {
  constructor() {
    /** @type {Eyes[]} */
    this._eyesInstances = []
    /** @type {TestResults[]} */
    this._allTestResult = []
  }

  makeGetBatchInfo(fetchBatchInfo) {
    if (!this._getBatchInfo) {
      this._getBatchInfo = GeneralUtils.cachify(fetchBatchInfo)
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
   * @param {boolean} [throwEx=true]
   * @return {Promise<TestResultsSummary>}
   */
  async getAllTestResults(throwEx = true) {
    await this._closeAllBatches()

    const summary = new TestResultsSummary(this._allTestResult)

    if (throwEx === true) {
      for (let result of summary.getAllResults()) {
        if (result.getException()) {
          throw result.getException()
        }
      }
    }
    return summary
  }

  /**
   * @protected
   * @return {Promise<void>}
   */
  async _closeAllBatches() {
    if (this._eyesInstances.length > 0) {
      const promises = []
      const batchIds = new Set()
      for (const eyesInstance of this._eyesInstances) {
        const batchId = eyesInstance.getBatch().getId()
        if (!batchIds.has(batchId)) {
          batchIds.add(batchId)
          promises.push(eyesInstance.closeBatch())
        }
      }

      await Promise.all(promises)
    }
  }
}

exports.EyesRunner = EyesRunner
