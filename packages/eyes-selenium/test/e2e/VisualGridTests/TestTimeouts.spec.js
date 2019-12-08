'use strict'

const assertRejects = require('assert-rejects')
const {
  Eyes,
  Target,
  VisualGridRunner,
  DeviceName,
  BrowserType,
  RectangleSize,
} = require('../../../index')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')
const {TestUtils} = require('../Utils/TestUtils')
const {TestDataProvider} = require('../TestDataProvider')

describe('TestTimeouts', function() {
  this.timeout(5 * 60 * 1000)

  let originalTimeout

  before(() => {
    // TODO: this is hardcoded in the SDK
    // originalTimeout = VisualGridEyes.CAPTURE_TIMEOUT;
  })

  after(() => {
    // VisualGridEyes.CAPTURE_TIMEOUT = originalTimeout;
  })

  it('TestTimeout', async function() {
    // RenderingTask.pollTimeout_ = TimeSpan.fromSeconds(100);
    const driver = SeleniumUtils.createChromeDriver()
    try {
      const runner = new VisualGridRunner(10)
      const eyes = new Eyes(runner)
      eyes.setLogHandler(TestUtils.initLogHandler())
      await driver.get('https://applitools.com/helloworld')
      eyes.setBatch(TestDataProvider.BatchInfo)
      await eyes.open(
        driver,
        'Timeout Test',
        'Visual Grid Timeout Test',
        new RectangleSize(1200, 800),
      )
      await eyes.check(null, Target.window().withName('Test'))
      await eyes.close()
      await runner.getAllTestResults()
    } finally {
      await driver.quit()
    }
  })

  it('TestTimeout2', async function() {
    const driver = SeleniumUtils.createChromeDriver()
    // VisualGridEyes.CAPTURE_TIMEOUT = TimeSpan.fromMilliseconds(1);
    try {
      const runner = new VisualGridRunner(10)
      const eyes = new Eyes(runner)
      eyes.setLogHandler(TestUtils.initLogHandler())
      await driver.get('https://applitools.com/helloworld')
      eyes.setBatch(TestDataProvider.BatchInfo)

      const configuration = eyes.getConfiguration()
      configuration
        .setAppName('Test Timeouts')
        .setTestName('Test Timeouts')
        .setBatch(TestDataProvider.BatchInfo)
      configuration.addBrowser(800, 600, BrowserType.CHROME)
      configuration.addBrowser(700, 500, BrowserType.FIREFOX)
      configuration.addBrowser(600, 400, BrowserType.EDGE)
      configuration.addBrowser(900, 700, BrowserType.IE_10)
      configuration.addBrowser(1000, 800, BrowserType.IE_11)
      configuration.addDeviceEmulation(DeviceName.Galaxy_S5)
      configuration.addDeviceEmulation(DeviceName.iPhone_6_7_8_Plus)
      configuration.addDeviceEmulation(DeviceName.Laptop_with_HiDPI_screen)
      eyes.setConfiguration(configuration)
      await eyes.open(driver)
      await assertRejects(
        (async () => {
          await eyes.check(null, Target.window().withName('Test'))
          await eyes.close()
          await runner.getAllTestResults()
        })(),
      )
    } finally {
      await driver.quit()
    }
  })
})
