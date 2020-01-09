'use strict'
const assert = require('assert')
const {Builder} = require('selenium-webdriver')
const {Options} = require('selenium-webdriver/chrome')
const {Eyes, Target, VisualGridRunner, Configuration} = require('../../../index')

describe('TestCounts', () => {
  let driver
  let eyes
  let runner

  beforeEach(async function() {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new Options().headless())
      .build()
    await driver.get('https://applitools.com/helloworld')
    runner = new VisualGridRunner()
    eyes = new Eyes(runner)
    await eyes.setSendDom(false)
  })

  it('Test_VGTestsCount_1', async function() {
    await eyes.setBatch('JS Tests')
    await eyes.open(driver, 'Test Count', 'Test_VGTestsCount_1', {width: 640, height: 480})
    await eyes.check('Test', Target.window())
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(1, results.getAllResults().length)
  })

  it('Test_VGTestsCount_2', async function() {
    let conf = new Configuration()
    conf.setBatch('JS Tests')
    conf.addBrowser(900, 600)
    conf.addBrowser(1024, 768)
    eyes.setConfiguration(conf)
    await eyes.open(driver, 'Test Count', 'Test_VGTestsCount_2')
    await eyes.check('Test', Target.window())
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(2, results.getAllResults().length)
  })

  it('Test_VGTestsCount_3', async function() {
    let conf = new Configuration()
    conf.setBatch('JS Tests')
    conf.addBrowser(900, 600)
    conf.addBrowser(1024, 768)
    conf.setAppName('Test Count')
    conf.setTestName('Test_VGTestsCount_3')
    eyes.setConfiguration(conf)
    await eyes.open(driver)
    await eyes.check('Test', Target.window())
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(2, results.getAllResults().length)
  })

  it('Test_VGTestsCount_4', async function() {
    let conf = new Configuration()
    conf.setBatch('JS Tests')
    conf.setAppName('Test Count')
    conf.setTestName('Test_VGTestsCount_4')
    eyes.setConfiguration(conf)
    await eyes.open(driver)
    await eyes.check('Test', Target.window())
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(1, results.getAllResults().length)
  })

  it('Test_VGTestsCount_5', async function() {
    let conf = new Configuration()
    conf.setBatch('JS Tests')
    conf.addBrowser(900, 600)
    conf.addBrowser(1024, 768)
    eyes.setConfiguration(conf)
    await eyes.open(driver, 'Test Count', 'Test_VGTestsCount_5', {width: 640, height: 480})
    await eyes.check('Test', Target.window())
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(2, results.getAllResults().length)
  })

  afterEach(async function() {
    await driver.quit()
    await eyes.abortIfNotClosed()
  })
})
