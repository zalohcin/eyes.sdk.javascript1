const {EyesJsExecutor} = require('../../../index')

class FakeJsExecutor extends EyesJsExecutor {
  constructor(logger, driver) {
    super()
    this._logger = logger
    this._driver = driver
    this._mock = new Map()
  }

  addMockScript(comparator, result) {
    this._mock.set(comparator, result)
  }

  getMockResult(script, ...args) {
    for (const [comparator, result] of this._mock.entries()) {
      if (typeof comparator === 'function' ? comparator(script) : script === comparator) {
        return result(...args)
      }
    }
  }

  async executeScript(script, ...args) {
    return this.getMockResult(script, ...args)
  }

  async executeAsyncScript(script, ...args) {
    return this.getMockResult(script, ...args)
  }
}

module.exports = FakeJsExecutor
