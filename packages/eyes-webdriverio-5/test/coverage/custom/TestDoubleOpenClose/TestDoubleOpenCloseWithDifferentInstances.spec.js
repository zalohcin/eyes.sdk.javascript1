'use strict'
const assert = require('assert')
const {getDriver, getBatch} = require('../util/TestSetup')
const {ClassicRunner} = require('../../../../index')
const {makeCheck} = require('../util/DoubleOpenClose')
const appName = 'Applitools Eyes SDK'
const batch = getBatch()
describe(appName, () => {
  let browser
  beforeEach(async () => {
    browser = await getDriver('CHROME')
  })
  afterEach(async () => {
    await browser.deleteSession()
  })
  it('TestDoubleOpenCheckCloseAsyncWithDifferentInstances', async () => {
    await browser.url('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
    let runner = new ClassicRunner()

    let eyes1 = await makeCheck(
      runner,
      batch,
      browser,
      appName,
      'TestDoubleOpenCheckCloseAsyncWithDifferentInstances',
      'Step 1',
    )
    await eyes1.closeAsync(false)

    let eyes2 = await makeCheck(
      runner,
      batch,
      browser,
      appName,
      'TestDoubleOpenCheckCloseAsyncWithDifferentInstances',
      'Step 1',
    )
    await eyes2.closeAsync(false)

    let allTestResults = await runner.getAllTestResults(false)
    assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
  })

  it('TestDoubleOpenCheckCloseWithDifferentInstances', async () => {
    await browser.url('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
    let runner = new ClassicRunner()

    let eyes1 = await makeCheck(
      runner,
      batch,
      browser,
      appName,
      'TestDoubleOpenCheckCloseWithDifferentInstances',
      'Step 1',
    )
    await eyes1.close(false)

    let eyes2 = await makeCheck(
      runner,
      batch,
      browser,
      appName,
      'TestDoubleOpenCheckCloseWithDifferentInstances',
      'Step 1',
    )
    await eyes2.close(false)

    let allTestResults = await runner.getAllTestResults(false)
    assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
  })
})

