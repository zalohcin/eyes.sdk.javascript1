'use strict'

const {GeneralUtils} = require('@applitools/eyes-common')
const {EyesRunner} = require('./EyesRunner')
const {TestResultsSummary} = require('./TestResultsSummary')

class VisualGridRunner extends EyesRunner {
  /**
   * @param {number} [concurrentSessions]
   */
  constructor(concurrentSessions) {
    super()
    this._concurrentSessions = concurrentSessions
  }

  /**
   * @return {number}
   */
  getConcurrentSessions() {
    return this._concurrentSessions
  }

  makeGetVisualGridClient(makeVisualGridClient) {
    if (!this._getVisualGridClient) {
      this._getVisualGridClient = GeneralUtils.cachify(makeVisualGridClient)
    }
  }

  async getVisualGridClientWithCache(config) {
    if (this._getVisualGridClient) {
      return this._getVisualGridClient(config)
    } else {
      throw new Error(
        'VisualGrid runner could not get visual grid client since makeGetVisualGridClient was not called before',
      )
    }
  }

  /**
   * @param {boolean} [throwEx=true]
   * @return {Promise<TestResultsSummary>}
   */
  async getAllTestResults(throwEx = true) {
    await this._closeAllBatches()
    if (this._eyesInstances.length === 1) {
      const [eyes] = this._eyesInstances
      return eyes.closeAndReturnResults(throwEx)
    } else if (this._eyesInstances.length > 1) {
      const results = await Promise.all(
        this._eyesInstances.map(async eyes => eyes.closeAndReturnResults(false)),
      )

      const allResults = []
      for (const result of results) {
        allResults.push(...result.getAllResults())
      }

      if (throwEx === true) {
        for (const result of allResults) {
          if (result.getException()) throw result.getException()
        }
      }
      return new TestResultsSummary(allResults)
    }

    return null
  }
}

exports.VisualGridRunner = VisualGridRunner
