'use strict'
const {By} = require('selenium-webdriver')
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {Target, StitchMode} = require('../../../index')
const batch = getBatch()
describe('api tests', function() {
  beforeEach(async function() {
    this.currentTest.ctx.webDriver = await getDriver('CHROME')
    let {eyes, runner} = await getEyes(...this.currentTest.ctx.eyesType)
    eyes.setBatch(batch)
    this.currentTest.ctx.eyes = eyes
    this.currentTest.ctx.runner = runner
  })
  afterEach(async function() {
    await this.currentTest.ctx.webDriver.quit()
    await this.currentTest.ctx.eyes.abortIfNotClosed()
  })
  describe('classic', function() {
    this.ctx.eyesType = ['classic', StitchMode.CSS]

    it('TestCloseAsync', testCloseAsync)
  })
  describe('visualGrid', function() {
    this.ctx.eyesType = ['VG']
    it('TestCloseAsync', testCloseAsync)
  })
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
