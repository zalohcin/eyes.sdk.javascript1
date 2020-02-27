'use strict'
const {By} = require('selenium-webdriver')
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {Target, StitchMode} = require('../../../index')
const batch = getBatch()
describe('classic', function() {
  this.ctx.data = 'data'
  beforeEach(async function() {
    this.webDriver = await getDriver('CHROME')
    let {eyes, runner} = await getEyes('classic', StitchMode.CSS)
    eyes.setBatch(batch)
    this.eyes = eyes
    this.runner = runner
  })
  afterEach(async function() {
    await this.webDriver.quit()
    await this.eyes.abortIfNotClosed()
  })

  it('TestCloseAsync', testCloseAsync)
})
describe('visualGrid', function() {
  this.ctx.data = 'data'
  beforeEach(async function() {
    this.webDriver = await getDriver('CHROME')
    let {eyes, runner} = await getEyes('VG')
    eyes.setBatch(batch)
    this.eyes = eyes
    this.runner = runner
  })
  afterEach(async function() {
    await this.webDriver.quit()
    await this.eyes.abortIfNotClosed()
  })

  it('TestCloseAsync', testCloseAsync)
})

async function testCloseAsync() {
  await this.webDriver.get('https://applitools.com/helloworld')
  await this.eyes.open(this.webDriver, 'TestApiMethods', `TestCloseAsync_1`, {
    width: 800,
    height: 600,
  })
  await this.eyes.check('step 1', Target.window())
  await this.eyes.closeAsync()

  await this.webDriver.findElement(By.css('button')).click()
  await this.eyes.open(this.webDriver, 'TestApiMethods', `TestCloseAsync_2`, {
    width: 800,
    height: 600,
  })
  await this.eyes.check('step 2', Target.window())
  await this.eyes.closeAsync()

  await this.runner.getAllTestResults()
}
