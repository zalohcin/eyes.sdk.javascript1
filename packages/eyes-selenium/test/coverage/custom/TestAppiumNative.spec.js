'use strict'
const {Eyes, Region, Target} = require('../../../index')
const {Builder} = require('selenium-webdriver')
const {getBatch, sauceUrl} = require('./util/TestSetup')
const batch = getBatch()
const appiumUrl = 'http://localhost:4723/wd/hub'
const sauceCaps = {
  browserName: '',
  platformName: 'Android',
  platformVersion: '8.1',
  deviceName: 'Samsung Galaxy S9 WQHD GoogleAPI Emulator',
  deviceOrientation: 'portrait',
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  app: 'http://appium.s3.amazonaws.com/ContactManager.apk',
}

const caps = {
  browserName: '',
  deviceName: 'Nexus 5',
  platformName: 'Android',
  platformVersion: '8.0',
  app: 'http://appium.s3.amazonaws.com/ContactManager.apk',
}

describe('TestAppiumNative', () => {
  let driver, eyes

  afterEach(async () => {
    await driver.quit()
    await eyes.abortIfNotClosed()
  })

  it(`Native android app on sauce lab`, async () => {
    driver = await new Builder()
      .withCapabilities(sauceCaps)
      .usingServer(sauceUrl)
      .build()
    eyes = new Eyes()
    eyes.setBatch(batch)
    await eyes.open(driver, 'JS test', 'Checking eyes settings in appium tests')
    await eyes.check(
      'Check',
      Target.window()
        .ignoreRegions(new Region(900, 0, 540, 100))
        .fully(),
    )
    await eyes.close()
  })

  it.skip(`Native iOS app on sauce lab`, async () => {
    driver = await new Builder()
      .withCapabilities({
        browserName: '',
        platformName: 'iOS',
        platformVersion: '10.3',
        deviceName: 'iPhone 7 Simulator',
        deviceOrientation: 'portrait',
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        app: 'https://store.applitools.com/download/iOS.TestApp.app.zip',
        clearSystemFiles: true,
        noReset: true,
      })
      .usingServer(sauceUrl)
      .build()
    eyes = new Eyes()
    eyes.setBatch(batch)
    // await driver.get('https://google.com')
    await eyes.open(driver, 'JS test', 'Checking eyes settings in appium tests')
    await eyes.check(
      'Check',
      Target.window()
        // .ignoreRegions(new Region(900, 0, 540, 100))
        .fully(),
    )
    await eyes.close()
  })

  it.skip(`Native app on local appium`, async () => {
    driver = await new Builder()
      .withCapabilities(caps)
      .usingServer(appiumUrl)
      .build()
    eyes = new Eyes()
    eyes.setBatch(batch)
    await eyes.open(driver, 'JS test', 'Checking eyes settings in appium tests_local')
    await eyes.check(
      'Check',
      Target.window()
        .ignoreRegions(new Region(900, 0, 180, 100))
        .fully(),
    )
    await eyes.close()
  })
})
