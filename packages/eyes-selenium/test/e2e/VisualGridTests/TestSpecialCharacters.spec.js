'use strict'

const {Eyes, Target, VisualGridRunner, Configuration, BrowserType} = require('../../../index')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')
const {TestUtils} = require('../Utils/TestUtils')
const {TestDataProvider} = require('../TestDataProvider')

describe('TestSpecialCharacters', function() {
  this.timeout(5 * 60 * 1000)

  it('TestRenderSpecialCharacters', async function() {
    const runner = new VisualGridRunner(30)
    const eyes = new Eyes(runner)
    eyes.setLogHandler(TestUtils.initLogHandler())

    const sconf = new Configuration()
    sconf.setTestName('Special Characters')
    sconf.setAppName('Special Characters Test')

    sconf.addBrowser(800, 600, BrowserType.CHROME)
    sconf.setBatch(TestDataProvider.BatchInfo)

    eyes.setConfiguration(sconf)
    const driver = SeleniumUtils.createChromeDriver()
    await eyes.open(driver)
    await driver.get('https://applitools.github.io/demo/TestPages/SpecialCharacters/index.html')
    await eyes.check('Test Special Characters', Target.window().fully())
    await driver.quit()
    await eyes.close()
    // TODO: this throws an error "Eyes not open", because getAllTestResults calls .close again. If change close to closeAsync above all good
    const allResults = await runner.getAllTestResults()
  })
})
