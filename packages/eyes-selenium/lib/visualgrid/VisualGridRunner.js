'use strict';

const { TestResultSummary } = require('./TestResultSummary');

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
    try {
      const results = await this._eyes._closeCommand(throwEx);
      return new TestResultSummary(results);
    } finally {
      this._eyes._isOpen = false;
    }
  }
}

exports.VisualGridRunner = VisualGridRunner;
