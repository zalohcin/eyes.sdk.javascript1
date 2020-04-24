'use strict'
const assert = require('assert')
const WDIODriver = require('../../src/wrappers/WDIODriver')
const WDIOElementFinder = require('../../src/wrappers/WDIOElementFinder')
const WDIOBrowsingContext = require('../../src/wrappers/WDIOBrowsingContext')
const WDIOJSExecutor = require('../../src/wrappers/WDIOJSExecutor')
const {Logger} = require('../../index')

describe('WDIODriver', function() {
  let logger

  before(async () => {
    logger = new Logger(false)
  })

  it('get executor', async () => {
    const browser = {}
    const driver = new WDIODriver(logger, browser)
    assert.ok(driver.executor instanceof WDIOJSExecutor)
  })

  it('get context', async () => {
    const browser = {}
    const driver = new WDIODriver(logger, browser)
    assert.ok(driver.context instanceof WDIOBrowsingContext)
  })

  it('get finder', async () => {
    const browser = {}
    const driver = new WDIODriver(logger, browser)
    assert.ok(driver.finder instanceof WDIOElementFinder)
  })

  it('preserve native API', async () => {
    const browser = {
      someField: Symbol('someField'),
      someMethod() {
        return this.someField
      },
    }
    const driver = new WDIODriver(logger, browser)
    Object.keys(browser).forEach(propName => {
      if (typeof browser[propName] === 'function') {
        assert.strictEqual(browser[propName](), driver[propName]())
      } else {
        assert.strictEqual(browser[propName], driver[propName])
      }
    })
  })
})
