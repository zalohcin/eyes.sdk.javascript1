'use strict'

require('chromedriver')
const assert = require('assert')
const assertRejects = require('assert-rejects')

const {Builder, Capabilities} = require('selenium-webdriver')
const {Options: ChromeOptions} = require('selenium-webdriver/chrome')

const fakeEyesServer = require('@applitools/sdk-fake-eyes-server')

const {Eyes, EyesWebDriver, Target, Configuration} = require('../../index')

let driver, eyes
describe('EyesSelenium', function() {
  this.timeout(60 * 1000)

  before(async function() {
    const chromeOptions = new ChromeOptions()
    chromeOptions.addArguments('disable-infobars')
    chromeOptions.headless()
    driver = await new Builder()
      .withCapabilities(Capabilities.chrome())
      .setChromeOptions(chromeOptions)
      .build()

    eyes = new Eyes()
  })

  describe('#open()', function() {
    it('should return EyesWebDriver', async function() {
      driver = await eyes.open(driver, this.test.parent.title, this.test.title, {
        width: 800,
        height: 560,
      })
      assert.strictEqual(driver instanceof EyesWebDriver, true)
      await eyes.close()
    })

    it('should throw IllegalState: Eyes not open', async function() {
      await assertRejects(eyes.check('test', Target.window()), /IllegalState: Eyes not open/)
    })
  })

  it('should wait before screenshots', async function() {
    const server = await fakeEyesServer()
    const config = new Configuration()
    config.setServerUrl(`http://localhost:${server.port}`)
    config.setApiKey('fakeApiKey')
    eyes.setConfiguration(config)
    eyes.setWaitBeforeScreenshots(1000)
    let startTime
    let duration
    const thrownScreenshotDone = Symbol()
    eyes.getScreenshot = function() {
      duration = Date.now() - startTime
      throw thrownScreenshotDone
    }
    await eyes.open(driver, this.test.parent.title, this.test.title)
    startTime = Date.now()
    try {
      await eyes.check('wait', Target.window().fully())
    } catch (catched) {
      if (catched === thrownScreenshotDone) {
        assert(duration >= 1000)
      } else {
        assert.fail()
      }
    }
    await eyes.close()
    await server.close()
  })

  afterEach(async function() {
    await eyes.abort()
  })

  after(async function() {
    await driver.quit()
  })
})
