'use strict'

const assert = require('assert')
const {ReportingTestSuite} = require('../ReportingTestSuite')
const {TestUtils} = require('../Utils/TestUtils')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')
const {TestDataProvider} = require('../TestDataProvider')
const {Eyes, Target, RectangleSize, VisualGridRunner, Configuration} = require('../../../index')

describe('TestCounts', function() {
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

  /**
   * @param testName
   * @return {Promise<{webDriver: WebDriver, runner: VisualGridRunner, eyes: EyesFactory}>}
   * @private
   */
  async function _initEyes(testName) {
    const webDriver = SeleniumUtils.createChromeDriver()
    await webDriver.get('https://applitools.com/helloworld')
    const runner = new VisualGridRunner(10)
    const eyes = new Eyes(runner)
    TestUtils.setupLogging(eyes, testName)
    eyes.setSendDom(false)
    return {webDriver, runner, eyes}
  }

  it('Test_VGTestsCount_1', async function() {
    const {webDriver, runner, eyes} = await _initEyes(this.test.title)
    eyes.setBatch(TestDataProvider.BatchInfo)
    try {
      await eyes.open(webDriver, 'Test Count', 'Test_VGTestsCount_1', new RectangleSize(640, 480))
      await eyes.check('Test', Target.window())
      await eyes.close()
      const resultsSummary = await runner.getAllTestResults()
      assert.strictEqual(1, resultsSummary.length)
    } finally {
      await webDriver.quit()
      await eyes.abort()
    }
  })

  it('Test_VGTestsCount_2', async function() {
    const {webDriver, runner, eyes} = await _initEyes(this.test.title)
    try {
      const conf = new Configuration()
      conf.setBatch(TestDataProvider.BatchInfo)
      conf.addBrowser(900, 600)
      conf.addBrowser(1024, 768)
      eyes.setConfiguration(conf)
      await eyes.open(webDriver, 'Test Count', 'Test_VGTestsCount_2')
      await eyes.check('Test', Target.window())
      await eyes.close()
      const resultsSummary = await runner.getAllTestResults()
      assert.strictEqual(2, resultsSummary.length)
    } finally {
      await webDriver.quit()
      await eyes.abort()
    }
  })

  it('Test_VGTestsCount_3', async function() {
    const {webDriver, runner, eyes} = await _initEyes(this.test.title)
    try {
      const conf = new Configuration()
      conf.setBatch(TestDataProvider.BatchInfo)
      conf.addBrowser(900, 600)
      conf.addBrowser(1024, 768)
      conf.setAppName('Test Count').setTestName('Test_VGTestsCount_3')
      eyes.setConfiguration(conf)
      await eyes.open(webDriver)
      await eyes.check('Test', Target.window())
      await eyes.close()
      const resultsSummary = await runner.getAllTestResults()
      assert.strictEqual(2, resultsSummary.length)
    } finally {
      await webDriver.quit()
      await eyes.abort()
    }
  })

  it('Test_VGTestsCount_4', async function() {
    const {webDriver, runner, eyes} = await _initEyes(this.test.title)
    try {
      const conf = new Configuration()
      conf.setBatch(TestDataProvider.BatchInfo)
      conf.setAppName('Test Count').setTestName('Test_VGTestsCount_4')
      eyes.setConfiguration(conf)
      await eyes.open(webDriver)
      await eyes.check('Test', Target.window())
      await eyes.close()
      const resultsSummary = await runner.getAllTestResults()
      assert.strictEqual(1, resultsSummary.length)
    } finally {
      await webDriver.quit()
      await eyes.abort()
    }
  })

  it('Test_VGTestsCount_5', async function() {
    const {webDriver, runner, eyes} = await _initEyes(this.test.title)
    try {
      const conf = new Configuration()
      conf.setBatch(TestDataProvider.BatchInfo)
      conf.addBrowser(900, 600)
      conf.addBrowser(1024, 768)
      eyes.setConfiguration(conf)
      await eyes.open(webDriver, 'Test Count', 'Test_VGTestsCount_5', new RectangleSize(640, 480))
      await eyes.check('Test', Target.window())
      await eyes.close()
      const resultsSummary = await runner.getAllTestResults()
      assert.strictEqual(2, resultsSummary.length)
    } finally {
      await webDriver.quit()
      await eyes.abort()
    }
  })
})
