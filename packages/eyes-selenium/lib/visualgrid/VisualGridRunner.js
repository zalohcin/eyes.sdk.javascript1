'use strict';

class VisualGridRunner {
  // this class is just a mock for compatibility with Java

  /**
   * @param {number} [concurrentSessions]
   */
  constructor(concurrentSessions) {
    this._concurrentSessions = concurrentSessions;

    /** @type {EyesVisualGrid} */
    this._eyes = undefined;
  }

  /**
   * @return {number}
   */
  getConcurrentSessions() {
    return this._concurrentSessions;
  }

  /**
   * @param {boolean} [throwEx=true]
   * @return {Promise<TestResultSummary>}
   */
  async getAllTestResults(throwEx = true) {
    return this._eyes.closeAndReturnResults(throwEx);
  }
}

exports.VisualGridRunner = VisualGridRunner;
