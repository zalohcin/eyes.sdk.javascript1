'use strict'

require('chromedriver')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
const path = require('path')
const {Builder} = require('selenium-webdriver')
const {getCaptureDomAndPollScript} = require('@applitools/dom-capture')

const {
  Logger,
  ConsoleLogHandler,
  FileLogHandler,
  DateTimeUtils,
  EyesError,
} = require('@applitools/eyes-common')
const {DomCapture} = require('../../index')

describe('DomCapture', function() {
  this.timeout(5 * 60 * 1000)
  let /** @type {Logger} */ logger
  let /** @type {WebDriver} */ driver

  before(function() {
    logger = new Logger()
    if (process.env.CI == null && process.env.APPLITOOLS_LOGS_PATH != null) {
      const dateString = DateTimeUtils.toLogFileDateTime()
      const extendedTestName = `${this.test.parent.title}_${dateString}`
      const logsPath = process.env.APPLITOOLS_LOGS_PATH || '.'
      const pathName = path.join(logsPath, 'JavaScript', extendedTestName)
      logger.setLogHandler(new FileLogHandler(true, path.join(pathName, 'log.log')))
      logger.getLogHandler().open()
    } else {
      logger.setLogHandler(new ConsoleLogHandler(false))
    }
  })

  /*beforeEach(async function() {
    driver = await new Builder()
      .forBrowser('chrome')
      // .setChromeOptions(new ChromeOptions().headless())
      .build()

    await driver
      .manage()
      .window()
      .setRect({x: 0, y: 0, width: 800, height: 600})
  })*/

  it('TestPollingTimeout', async function() {
    let domCapture = new DomCapture(logger, driver)
    await driver.get('https://applitools-dom-capture-origin-1.surge.sh/test.html')
    let script = () => {
      return JSON.stringify({status: 'WIP'})
    }
    await expect(domCapture.getFrameDom(script, await driver.getCurrentUrl())).to.be.rejectedWith(
      EyesError,
      'DomCapture Timed out',
    )
  })

  it('TestPollingError', async function() {
    let domCapture = new DomCapture(logger, driver)
    await driver.get('https://applitools-dom-capture-origin-1.surge.sh/test.html')
    let script = () => {
      return JSON.stringify({status: 'ERROR', error: 'Test Error'})
    }
    await expect(domCapture.getFrameDom(script, await driver.getCurrentUrl())).to.be.rejectedWith(
      EyesError,
      `Error during capture dom and pull script: 'Test Error'`,
    )
  })

  it('TestPollingSuccess', async function() {
    let domCapture = new DomCapture(logger, driver)
    await driver.get('https://applitools-dom-capture-origin-1.surge.sh/test.html')
    let script = () => {
      if (!window.testNamespace) {
        window.testNamespace = {value: 1}
      } else {
        window.testNamespace.value++
      }
      return window.testNamespace.value > 9
        ? JSON.stringify({status: 'SUCCESS', value: `${window.testNamespace.value}`})
        : JSON.stringify({status: 'WIP'})
    }
    let result = await domCapture.getFrameDom(script, await driver.getCurrentUrl())
    expect(result).to.be.equal('10')
  })

  it('TestPollingScript', async function() {
    driver = await new Builder()
      .withCapabilities({
        browserName: 'chrome',
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
      })
      .usingServer('https://ondemand.saucelabs.com:443/wd/hub')
      .build()
    const captureDomScript = await getCaptureDomAndPollScript()
    let script = `${captureDomScript} return __captureDomAndPoll();`
    await driver.get('https://www.polygon.com/')
    let result
    logger.log('Check script')
    const firstRun = await driver.executeScript(script)
    result = JSON.parse(firstRun)
    await expect(result.status).to.be.equal('WIP')
    // await GeneralUtils.sleep(1000)
    const secondRun = await driver.executeScript(script)
    console.log(secondRun)
    result = JSON.parse(secondRun)
    await expect(result.status).to.be.equal('SUCCESS')
    logger.log('Check script end')
  })

  it('TestPollingScript2', async function() {
    driver = await new Builder()
      .withCapabilities({
        browserName: 'chrome',
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
      })
      .usingServer('https://ondemand.saucelabs.com:443/wd/hub')
      .build()
    let domCapture = new DomCapture(logger, driver)
    await driver.get('https://www.polygon.com/')
    await domCapture.getWindowDom()
    console.log('done')
  })

  afterEach(async function() {
    await driver.quit()
  })

  after(async function() {
    logger.getLogHandler().close()
  })
})
