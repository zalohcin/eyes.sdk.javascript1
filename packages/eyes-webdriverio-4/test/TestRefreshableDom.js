'use strict'

const assert = require('assert')
const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const {Eyes, ConsoleLogHandler, Target, By} = require('../index')

let browser, eyes, driver

describe('TestRefreshableDom', function() {
  before(async () => {
    await chromedriver.start([], true)

    eyes = new Eyes()
    eyes.setLogHandler(new ConsoleLogHandler(false))
  })

  beforeEach(async () => {
    const chrome = {
      port: 9515,
      path: '/',
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['disable-infobars'],
        },
      },
    }
    browser = remote(chrome)
    await browser.init()
    driver = await eyes.open(browser, 'AppName', this.title, {width: 600, height: 500})
    await driver.url('https://applitools.github.io/demo/TestPages/RefreshDomPage/')
  })

  afterEach(async () => {
    await browser.end()
    await eyes.abort()
  })

  after(async () => {
    chromedriver.stop()
  })

  it.only('refresh element after StaleElementReference if possible', async () => {
    await driver.switchTo().defaultContent()
    await driver.switchTo().frame('frame')
    const region = await driver.findElement(By.css('#inner-img'))
    const button = await driver.findElement(By.css('#refresh-button'))
    await button.click()
    await driver.switchTo().defaultContent()

    await eyes.check('Handle', Target.frame('frame').region(region))
    return eyes.close()
  })

  it.only('throw after unhandled StaleElementReference', async () => {
    await driver.switchTo().defaultContent()
    await driver.switchTo().frame('frame')
    const region = await driver.findElement(By.css('#inner-img'))
    const button = await driver.findElement(By.css('#invalidate-button'))
    await button.click()
    await driver.switchTo().defaultContent()
    try {
      await eyes.check('Throw', Target.frame('frame').region(region))
      assert.fail()
    } catch (err) {
      assert.strictEqual(err.seleniumStack && err.seleniumStack.type, 'StaleElementReference')
    } finally {
      return eyes.close(false)
    }
  })
})
