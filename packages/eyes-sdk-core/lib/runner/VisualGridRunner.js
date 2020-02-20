'use strict'
const {TestResultsSummary} = require('./TestResultsSummary')
const {EyesRunner} = require('./EyesRunner')

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
