'use strict'
const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const assert = require('assert')
const WDIOWrappedDriver = require('../../src/WDIOWrappedDriver')
const WDIOWrappedElement = require('../../src/WDIOWrappedElement')
const WDIOJsExecutor = require('../../src/WDIOJsExecutor')
const {Logger} = require('../../index')

describe('WDIOJsExecutor', function() {
  let logger, browser, driver, executor

  before(async () => {
    logger = new Logger(false)
    await chromedriver.start([], true)
    browser = await remote({
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['disable-infobars', 'headless'],
        },
      },
      logLevel: 'error',
      port: 9515,
      path: '/',
    })
    await browser.url('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  })

  beforeEach(async () => {
    driver = new WDIOWrappedDriver(logger, browser)
    executor = new WDIOJsExecutor(logger, driver)
  })

  after(async () => {
    await browser.deleteSession()
    chromedriver.stop()
  })

  it('executeScript(...args)', async () => {
    const element = await browser.findElement('css selector', '#overflowing-div-image')
    const extendedElement = await browser.$('#overflowing-div')
    const wrappedElement = await driver.finder.findElement('#modal1')
    const args = [element, extendedElement, wrappedElement]
    const results = await executor.executeScript('return arguments', ...args)
    args.forEach((arg, index) => {
      assert.strictEqual(
        WDIOWrappedElement.elementId(arg),
        WDIOWrappedElement.elementId(results[index]),
      )
    })
  })
})
