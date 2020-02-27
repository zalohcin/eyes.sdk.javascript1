'use strict'

const {GeneralUtils} = require('@applitools/eyes-common')

class EyesRunner {
  constructor() {
    /** @type {Eyes[]} */
    this._eyesInstances = []
    this._getBatchInfo = undefined
  }

  attachEyes(eyes, serverConnector) {
    this._eyesInstances.push(eyes)
    if (!this._getBatchInfo) {
      const fetchBatchInfo = serverConnector.batchInfo.bind(serverConnector)
      this._getBatchInfo = GeneralUtils.cachify(fetchBatchInfo)
    }
  }

  async getBatchInfoWithCache(batchId) {
    if (this._getBatchInfo) {
      return this._getBatchInfo(batchId)
    } else {
      throw new Error('Eyes runner could not get batch info since attachEyes was not called before')
    }
  }

  /**
   * @abstract
   * @param {boolean} [throwEx=true]
   * @return {Promise<TestResultsSummary>}
   */
  async getAllTestResults(_throwEx) {
    throw new TypeError('The method is not implemented!')
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
