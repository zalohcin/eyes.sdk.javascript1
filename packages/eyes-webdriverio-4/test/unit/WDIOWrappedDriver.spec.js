'use strict'
const assert = require('assert')
const WDIOWrappedDriver = require('../../src/WDIOWrappedDriver')
const {Logger} = require('../../index')

describe('WDIOWrappedDriver', function() {
  let logger

  before(async () => {
    logger = new Logger(false)
  })

  it('get executor', async () => {
    const browser = {}
    const driver = new WDIOWrappedDriver(logger, browser)
    assert.ok(driver.executor instanceof WDIOWrappedDriver.JsExecutor)
  })

  it('get context', async () => {
    const browser = {}
    const driver = new WDIOWrappedDriver(logger, browser)
    assert.ok(driver.context instanceof WDIOWrappedDriver.BrowsingContext)
  })

  it('get finder', async () => {
    const browser = {}
    const driver = new WDIOWrappedDriver(logger, browser)
    assert.ok(driver.finder instanceof WDIOWrappedDriver.ElementFinder)
  })

  it('preserve native API', async () => {
    const browser = {
      someField: Symbol('someField'),
      someMethod() {
        return this.someField
      },
      async someAsyncMethod() {
        return this.someField
      },
    }
    const driver = new WDIOWrappedDriver(logger, browser)
    Object.keys(browser).forEach(async propName => {
      if (typeof browser[propName] === 'function') {
        let browserResult = browser[propName]()
        let driverResult = driver[propName]()
        if (typeof browserResult.then === 'function') {
          browserResult = await browserResult
        }
        if (typeof driverResult.then === 'function') {
          driverResult = await driverResult
        }
        assert.strictEqual(browserResult, driverResult)
      } else {
        assert.strictEqual(browser[propName], driver[propName])
      }
    })
  })
})
