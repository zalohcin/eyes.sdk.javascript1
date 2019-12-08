'use strict'

const {By} = require('selenium-webdriver')
const {ReportingTestSuite} = require('../ReportingTestSuite')
const {TestUtils} = require('../Utils/TestUtils')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')
const {TestDataProvider} = require('../TestDataProvider')
const {
  Eyes,
  Target,
  RectangleSize,
  Region,
  VisualGridRunner,
  ClassicRunner,
  BrowserType,
} = require('../../../index')

describe('HelloWorldTest', function() {
  this.timeout(5 * 60 * 1000)

  const /** @type {ReportingTestSuite} */ testSetup = new ReportingTestSuite()
  before(async function() {
    await testSetup.oneTimeSetup()
  })
  beforeEach(async function() {
    await testSetup.setup(this)
  })
  afterEach(async function() {
    await testSetup.tearDown(this)
  })
  after(async function() {
    await testSetup.oneTimeTearDown()
  })
  ;[{useVisualGrid: true}, {useVisualGrid: false}].forEach(({useVisualGrid}) => {
    it(`HelloWorldTest {useVisualGrid: ${useVisualGrid}}`, async function() {
      testSetup.setTestArguments({useVisualGrid})

      const webDriver = SeleniumUtils.createChromeDriver()
      await webDriver.get('https://applitools.com/helloworld')

      const runner = useVisualGrid ? new VisualGridRunner(10) : new ClassicRunner()

      const eyes = new Eyes(runner)
      eyes.setLogHandler(TestUtils.initLogHandler())

      const sconf = eyes.getConfiguration()

      const suffix = useVisualGrid ? '_VG' : ''
      // Set test name
      sconf.setTestName(`Hello World Demo${suffix}`)

      // Set app name
      sconf.setAppName('Hello World Demo')

      // Add browsers
      sconf.addBrowser(800, 600, BrowserType.CHROME)
      sconf.addBrowser(700, 500, BrowserType.FIREFOX)
      sconf.addBrowser(1200, 800, BrowserType.IE_10)
      sconf.addBrowser(1200, 800, BrowserType.IE_11)
      sconf.addBrowser(1600, 1200, BrowserType.EDGE)

      // Set the configuration object to eyes
      eyes.setConfiguration(sconf)

      try {
        // Call Open on eyes to initialize a test session
        await eyes.open(webDriver)

        // Add 2 checks
        await eyes.check(
          null,
          Target.window()
            .withName('Step 1 - Viewport')
            .ignoreRegions(By.css('.primary')),
        )
        await eyes.check(
          null,
          Target.window()
            .fully()
            .withName('Step 1 - Full Page')
            .floatingRegions(By.css('.primary'), new Region(10, 20, 30, 40))
            .floatingRegions(By.css('button'), new Region(1, 2, 3, 4)),
        )

        await webDriver.findElement(By.css('button')).click()

        // Add 2 checks
        await eyes.check(null, Target.window().withName('Step 2 - Viewport'))
        await eyes.check(
          null,
          Target.window()
            .fully()
            .withName('Step 2 - Full Page'),
        )

        // Close eyes and collect results
        await eyes.close()
      } finally {
        await eyes.abort()
        await webDriver.quit()
      }
    })
  })
})
