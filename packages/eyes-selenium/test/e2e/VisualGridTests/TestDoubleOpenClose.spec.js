'use strict'

const assert = require('assert')
const {ReportingTestSuite} = require('../ReportingTestSuite')
const {TestUtils} = require('../Utils/TestUtils')
const {SeleniumUtils} = require('../Utils/SeleniumUtils')
const {TestDataProvider} = require('../TestDataProvider')
const {Eyes, Target, RectangleSize, VisualGridRunner, ClassicRunner} = require('../../../index')

describe('TestDoubleOpenClose', function() {
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
    describe(`useVisualGrid: ${useVisualGrid}`, async function() {
      testSetup._suiteArgs.set('useVisualGrid', useVisualGrid)

      it('TestDoubleOpenCheckClose', async function() {
        const {driver, runner, eyes} = SeleniumUtils.initEyes(useVisualGrid, this.test.title)
        await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')

        const suffix = useVisualGrid ? '_VG' : ''
        try {
          eyes.open(
            driver,
            'Applitools Eyes DotNet SDK',
            `TestDoubleOpenCheckClose${suffix}`,
            new RectangleSize(1200, 800),
          )
          eyes.check(
            null,
            Target.window()
              .fully()
              .ignoreDisplacements(false)
              .withName('Step 1'),
          )
          eyes.close(false)

          eyes.open(
            driver,
            'Applitools Eyes DotNet SDK',
            `TestDoubleOpenCheckClose${suffix}`,
            new RectangleSize(1200, 800),
          )
          eyes.check(
            null,
            Target.window()
              .fully()
              .ignoreDisplacements(false)
              .withName('Step 2'),
          )
          eyes.close(false)
        } finally {
          driver.quit()
        }

        const allTestResults = await runner.getAllTestResults(false)
        assert.strictEqual(2, allTestResults.getAllResults().length)
      })

      it('TestDoubleOpenCheckCloseAsync', async function() {
        const {driver, runner, eyes} = SeleniumUtils.initEyes(useVisualGrid, this.test.title)
        await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')

        const suffix = useVisualGrid ? '_VG' : ''

        try {
          await eyes.open(
            driver,
            'Applitools Eyes DotNet SDK',
            `TestDoubleOpenCheckCloseAsync${suffix}`,
            new RectangleSize(1200, 800),
          )
          await eyes.check(
            null,
            Target.window()
              .fully()
              .ignoreDisplacements(false)
              .withName('Step 1'),
          )
          await eyes.closeAsync()

          await eyes.open(
            driver,
            'Applitools Eyes DotNet SDK',
            `TestDoubleOpenCheckCloseAsync${suffix}`,
            new RectangleSize(1200, 800),
          )
          await eyes.check(
            null,
            Target.window()
              .fully()
              .ignoreDisplacements(false)
              .withName('Step 2'),
          )
          await eyes.closeAsync()
        } finally {
          await driver.quit()
        }
        const allTestResults = await runner.getAllTestResults(false)
        assert.strictEqual(2, allTestResults.getAllResults().length)
      })

      it('TestDoubleOpenCheckCloseWithDifferentInstances', async function() {
        const driver = SeleniumUtils.createChromeDriver()
        await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')

        const runner = useVisualGrid ? new VisualGridRunner(10) : new ClassicRunner()
        runner.setLogHandler(TestUtils.initLogHandler())

        const suffix = useVisualGrid ? '_VG' : ''
        try {
          const eyes1 = new Eyes(runner)
          eyes1.setBatch(TestDataProvider.BatchInfo)
          await eyes1.open(
            driver,
            'Applitools Eyes DotNet SDK',
            `TestDoubleOpenCheckCloseWithDifferentInstances${suffix}`,
            new RectangleSize(1200, 800),
          )
          await eyes1.check(
            null,
            Target.window()
              .fully()
              .ignoreDisplacements(false)
              .withName('Step 1'),
          )
          await eyes1.close(false)

          const eyes2 = new Eyes(runner)
          eyes2.setBatch(TestDataProvider.BatchInfo)
          await eyes2.open(
            driver,
            'Applitools Eyes DotNet SDK',
            `TestDoubleOpenCheckCloseWithDifferentInstances${suffix}`,
            new RectangleSize(1200, 800),
          )
          await eyes2.check(
            null,
            Target.window()
              .fully()
              .ignoreDisplacements(false)
              .withName('Step 2'),
          )
          await eyes2.close(false)
        } finally {
          await driver.quit()
        }
        const allTestResults = await runner.getAllTestResults(false)
        assert.strictEqual(2, allTestResults.getAllResults().length)
      })

      it('TestDoubleOpenCheckCloseAsyncWithDifferentInstances', async function() {
        const driver = SeleniumUtils.createChromeDriver()
        await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')

        const runner = useVisualGrid ? new VisualGridRunner(10) : new ClassicRunner()
        runner.setLogHandler(TestUtils.initLogHandler())

        const suffix = useVisualGrid ? '_VG' : ''
        try {
          const eyes1 = new Eyes(runner)
          eyes1.setBatch(TestDataProvider.BatchInfo)
          await eyes1.open(
            driver,
            'Applitools Eyes DotNet SDK',
            `TestDoubleOpenCheckCloseAsyncWithDifferentInstances${suffix}`,
            new RectangleSize(1200, 800),
          )
          await eyes1.check(
            null,
            Target.window()
              .fully()
              .ignoreDisplacements(false)
              .withName('Step 1'),
          )
          await eyes1.closeAsync()

          const eyes2 = new Eyes(runner)
          eyes2.setBatch(TestDataProvider.BatchInfo)
          await eyes2.open(
            driver,
            'Applitools Eyes DotNet SDK',
            `TestDoubleOpenCheckCloseAsyncWithDifferentInstances${suffix}`,
            new RectangleSize(1200, 800),
          )
          await eyes2.check(
            null,
            Target.window()
              .fully()
              .ignoreDisplacements(false)
              .withName('Step 2'),
          )
          await eyes2.closeAsync()
        } finally {
          driver.quit()
        }

        const allTestResults = await runner.getAllTestResults(false)
        assert.strictEqual(2, allTestResults.getAllResults().length)
      })

      it('TestDoubleCheckDontGetAllResults', async function() {
        const driver = SeleniumUtils.createChromeDriver()
        await driver.get('https://applitools.com/helloworld')

        const runner = useVisualGrid ? new VisualGridRunner(10) : new ClassicRunner()
        // TODO: this is not implemented in JS
        // runner.setLogHandler(TestUtils.initLogHandler());

        const suffix = useVisualGrid ? '_VG' : ''
        try {
          const eyes1 = new Eyes(runner)
          eyes1.setBatch(TestDataProvider.BatchInfo)
          await eyes1.open(
            driver,
            'Applitools Eyes DotNet SDK',
            `TestDoubleCheckDontGetAllResults${suffix}`,
            new RectangleSize(1200, 800),
          )
          await eyes1.check(null, Target.window().withName('Step 1'))
          await eyes1.check(null, Target.window().withName('Step 2'))
          await eyes1.close(false)
        } finally {
          await driver.quit()
        }
      })
    })
  })
})
