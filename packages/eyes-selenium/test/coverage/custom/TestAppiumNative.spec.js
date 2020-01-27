'use strict'
const {Eyes, Target} = require('../../../index')
const {Builder} = require('selenium-webdriver')
const {getBatch, sauceUrl} = require('./util/TestSetup')
const batch = getBatch()
const caps = {
  browserName: '',
  platformName: 'Android',
  platformVersion: '8.1',
  deviceName: 'Samsung Galaxy S9 WQHD GoogleAPI Emulator',
  deviceOrientation: 'portrait',
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  app: 'http://appium.s3.amazonaws.com/ContactManager.apk',
}

describe('TestAppiumNative', () => {
  before(() => {
    console.log('before')
  })
  let driver, eyes
  beforeEach(async function() {
    driver = await new Builder()
      .withCapabilities(caps)
      .usingServer(sauceUrl)
      .build()
    console.log('browser Started')
  })

  afterEach(async () => {
    await driver.quit()
    await eyes.abortIfNotClosed()
  })

  it(`Native app on sauce lab`, async () => {
    eyes = new Eyes()
    eyes.setBatch(batch)
    await eyes.open(driver, 'JS test', 'Checking eyes settings in appium tests')
    await eyes.check('Check', Target.window().fully())
    await eyes.close()
  })
})
