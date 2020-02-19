'use strict'

const {GeneralUtils} = require('@applitools/eyes-common')
const {TestResultsSummary} = require('./TestResultsSummary')
const getScmInfo = require('../getScmInfo')

class EyesRunner {
  constructor() {
    /** @type {Eyes[]} */
    this._eyesInstances = []
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
    if (this._eyesInstances.length === 1) {
      const [eyes] = this._eyesInstances
      return eyes.closeAndReturnResults(throwEx)
    } else if (this._eyesInstances.length > 1) {
      const results = await Promise.all(
        this._eyesInstances.map(async eyes => eyes.closeAndReturnResults(false)),
      )

      console.log(results)

      const allResults = []
      for (const result of results) {
        allResults.push(...result.getAllResults())
      }

      if (throwEx === true) {
        for (const result of allResults) {
          if (result.getException()) throw result.getException()
        }
      }

      await this._closeAllBatches()
      return new TestResultsSummary(allResults)
    }

    return null
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
