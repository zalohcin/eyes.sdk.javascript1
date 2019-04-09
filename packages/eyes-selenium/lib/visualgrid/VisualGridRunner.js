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
   * @return {Promise<TestResults[]|Error[]>}
   */
  async getAllResults(throwEx = true) {
    try {
      return await this._eyes._closeCommand(throwEx);
    } finally {
      this._eyes._isOpen = false;
    }
  }
}

exports.VisualGridRunner = VisualGridRunner;
