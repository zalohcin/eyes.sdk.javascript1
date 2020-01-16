'use strict'
const assert = require('assert')
const {Target, Configuration, BatchInfo} = require('../../../index')
const {getDriver, getEyes} = require('./util/TestSetup')

describe('TestCounts', () => {
  let driver, eyes, runner
  let batch = new BatchInfo('JS test')
  beforeEach(async () => {
    driver = await getDriver('CHROME')
    await driver.get('https://applitools.com/helloworld')
    let defaults = await getEyes('VG')
    eyes = defaults.eyes
    runner = defaults.runner
    await eyes.setSendDom(false)
  })

  it('Test_VGTestsCount_1', async () => {
    await eyes.setBatch(batch)
    await eyes.setBranchName('master')
    await eyes.open(driver, 'Test Count', 'Test_VGTestsCount_1', {width: 640, height: 480})
    await eyes.check('Test', Target.window())
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(1, results.getAllResults().length)
  })

  it('Test_VGTestsCount_2', async () => {
    let conf = new Configuration()
    conf.setBatch(batch)
    conf.addBrowser(900, 600)
    conf.addBrowser(1024, 768)
    conf.setBranchName('master')
    eyes.setConfiguration(conf)
    await eyes.open(driver, 'Test Count', 'Test_VGTestsCount_2')
    await eyes.check('Test', Target.window())
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(2, results.getAllResults().length)
  })

  it('Test_VGTestsCount_3', async () => {
    let conf = new Configuration()
    conf.setBatch(batch)
    conf.addBrowser(900, 600)
    conf.addBrowser(1024, 768)
    conf.setAppName('Test Count')
    conf.setTestName('Test_VGTestsCount_3')
    conf.setBranchName('master')
    eyes.setConfiguration(conf)
    await eyes.open(driver)
    await eyes.check('Test', Target.window())
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(2, results.getAllResults().length)
  })

  it('Test_VGTestsCount_4', async () => {
    let conf = new Configuration()
    conf.setBatch(batch)
    conf.setAppName('Test Count')
    conf.setTestName('Test_VGTestsCount_4')
    conf.setBranchName('master')
    eyes.setConfiguration(conf)
    await eyes.open(driver)
    await eyes.check('Test', Target.window())
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(1, results.getAllResults().length)
  })

  it('Test_VGTestsCount_5', async () => {
    let conf = new Configuration()
    conf.setBatch(batch)
    conf.addBrowser(900, 600)
    conf.addBrowser(1024, 768)
    conf.setBranchName('master')
    eyes.setConfiguration(conf)
    await eyes.open(driver, 'Test Count', 'Test_VGTestsCount_5', {width: 640, height: 480})
    await eyes.check('Test', Target.window())
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(2, results.getAllResults().length)
  })

  afterEach(async () => {
    await driver.quit()
    await eyes.abortIfNotClosed()
  })
})
