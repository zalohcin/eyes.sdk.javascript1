const {Logger} = require('@applitools/eyes-common')
const {EyesWrappedDriver} = require('../../../index')
const FakeJsExecutor = require('./FakeJsExecutor')
const FakeElementFinder = require('./FakeElementFinder')
const FakeBrowsingContext = require('./FakeBrowsingContext')

class FakeWrappedDriver extends EyesWrappedDriver {
  constructor(logger = new Logger(false)) {
    super()
    this._logger = logger
    this._executor = new FakeJsExecutor(logger, this)
    this._finder = new FakeElementFinder(logger, this)
    this._context = new FakeBrowsingContext(logger, this)
  }

  get executor() {
    return this._executor
  }

  get finder() {
    return this._finder
  }

  get context() {
    return this._context
  }
}

module.exports = FakeWrappedDriver
