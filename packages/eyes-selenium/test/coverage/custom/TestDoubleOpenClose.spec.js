'use strict'
const assert = require('assert')
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {
  Target,
  ConsoleLogHandler,
  StitchMode,
  ClassicRunner,
  VisualGridRunner,
  Eyes,
} = require('../../../index')
const appName = 'Eyes Selenium SDK - Double Open Close'
const batch = getBatch()
describe(appName, () => {
  let webDriver, eyes

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await webDriver.quit()
  })
  describe('Classic', () => {
    let runner
    beforeEach(async () => {
      webDriver = await getDriver('CHROME')
      ;({eyes, runner} = await getEyes('classic', StitchMode.CSS))
      eyes.setBatch(batch)
      eyes.setLogHandler(new ConsoleLogHandler(true))
    })

    it('TestDoubleOpenCheckClose', async () => {
      await webDriver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
      await eyes.open(webDriver, appName, 'TestDoubleOpenCheckClose', {
        width: 1200,
        height: 800,
      })
      await eyes.check(
        'Step 1',
        Target.window()
          .fully()
          .ignoreDisplacements(false),
      )
      await eyes.close(false)

      await eyes.open(webDriver, appName, 'TestDoubleOpenCheckClose', {
        width: 1200,
        height: 800,
      })
      await eyes.check(
        'Step 2',
        Target.window()
          .fully()
          .ignoreDisplacements(false),
      )
      await eyes.close(false)

      let allTestResults = await runner.getAllTestResults(true)
      assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
    })

    it('TestDoubleOpenCheckCloseAsync', async () => {
      await webDriver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
      await eyes.open(webDriver, appName, 'TestDoubleOpenCheckCloseAsync', {
        width: 1200,
        height: 800,
      })
      await eyes.check(
        'Step 1',
        Target.window()
          .fully()
          .ignoreDisplacements(false),
      )
      await eyes.closeAsync(false)
      await eyes.open(webDriver, appName, 'TestDoubleOpenCheckCloseAsync', {
        width: 1200,
        height: 800,
      })
      await eyes.check(
        'Step 2',
        Target.window()
          .fully()
          .ignoreDisplacements(false),
      )
      await eyes.closeAsync(false)

      let allTestResults = await runner.getAllTestResults(false)
      assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
    })
  })

  describe('VG', () => {
    let runner
    beforeEach(async () => {
      webDriver = await getDriver('CHROME')
      ;({eyes, runner} = await getEyes('VG'))
      eyes.setBatch(batch)
      eyes.setLogHandler(new ConsoleLogHandler(true))
    })

    it('TestDoubleOpenCheckClose', async () => {
      await webDriver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
      await eyes.open(webDriver, appName, 'TestDoubleOpenCheckClose_VG', {
        width: 1200,
        height: 800,
      })
      await eyes.check(
        'Step 1',
        Target.window()
          .fully()
          .ignoreDisplacements(false),
      )
      await eyes.close(false)

      await eyes.open(webDriver, appName, 'TestDoubleOpenCheckClose_VG', {
        width: 1200,
        height: 800,
      })
      await eyes.check(
        'Step 2',
        Target.window()
          .fully()
          .ignoreDisplacements(false),
      )
      await eyes.close(false)

      let allTestResults = await runner.getAllTestResults(true)
      assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
    })

    it('TestDoubleCheckDontGetAllResults', async () => {
      await webDriver.get('https://applitools.com/helloworld')
      await eyes.open(webDriver, appName, 'TestDoubleCheckDontGetAllResults_VG', {
        width: 1200,
        height: 800,
      })
      await eyes.check('Step 1', Target.window())
      await eyes.check('Step 2', Target.window())
      await eyes.close(false)
    })
  })
})

describe(appName, () => {
  let webDriver
  beforeEach(async () => {
    webDriver = await getDriver('CHROME')
  })
  afterEach(async () => {
    await webDriver.quit()
  })
  it('TestDoubleOpenCheckCloseAsyncWithDifferentInstances', async () => {
    await webDriver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
    let runner = new ClassicRunner()

    let eyes1 = new Eyes(runner)
    eyes1.setBatch(batch)
    await eyes1.open(webDriver, appName, 'TestDoubleOpenCheckCloseAsyncWithDifferentInstances', {
      width: 1200,
      height: 800,
    })
    await eyes1.check(
      'Step 1',
      Target.window()
        .fully()
        .ignoreDisplacements(false),
    )
    await eyes1.closeAsync(false)

    let eyes2 = new Eyes(runner)
    eyes2.setBatch(batch)
    await eyes2.open(webDriver, appName, 'TestDoubleOpenCheckCloseAsyncWithDifferentInstances', {
      width: 1200,
      height: 800,
    })
    await eyes2.check(
      'Step 1',
      Target.window()
        .fully()
        .ignoreDisplacements(false),
    )
    await eyes2.closeAsync(false)

    let allTestResults = await runner.getAllTestResults(false)
    assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
  })

  it('TestDoubleOpenCheckCloseAsyncWithDifferentInstances_VG', async () => {
    await webDriver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
    let runner = new VisualGridRunner()

    let eyes1 = new Eyes(runner)
    eyes1.setBatch(batch)
    await eyes1.open(webDriver, appName, 'TestDoubleOpenCheckCloseAsyncWithDifferentInstances_VG', {
      width: 1200,
      height: 800,
    })
    await eyes1.check(
      'Step 1',
      Target.window()
        .fully()
        .ignoreDisplacements(false),
    )
    await eyes1.closeAsync(false)

    let eyes2 = new Eyes(runner)
    eyes2.setBatch(batch)
    await eyes2.open(webDriver, appName, 'TestDoubleOpenCheckCloseAsyncWithDifferentInstances_VG', {
      width: 1200,
      height: 800,
    })
    await eyes2.check(
      'Step 1',
      Target.window()
        .fully()
        .ignoreDisplacements(false),
    )
    await eyes2.closeAsync(false)

    let allTestResults = await runner.getAllTestResults(false)
    assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
  })
})
