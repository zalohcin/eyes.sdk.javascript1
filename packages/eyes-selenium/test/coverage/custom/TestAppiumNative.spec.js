'use strict'
const {Eyes, Target} = require('../../../index')
const {Builder, By} = require('selenium-webdriver')
const {getBatch, sauceUrl} = require('./util/TestSetup')
const batch = getBatch()
const androidCaps = {
  browserName: '',
  platformName: 'Android',
  platformVersion: '8.1',
  deviceName: 'Samsung Galaxy S9 WQHD GoogleAPI Emulator',
  deviceOrientation: 'portrait',
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  app: 'http://appium.s3.amazonaws.com/ContactManager.apk',
  clearSystemFiles: true,
  noReset: true,
}

describe('TestAppiumNative', () => {
  let driver, eyes

  afterEach(async () => {
    await driver.quit()
    await eyes.abortIfNotClosed()
  })

  describe('Android', () => {
    beforeEach(async () => {
      driver = await new Builder()
        .withCapabilities(androidCaps)
        .usingServer(sauceUrl)
        .build()
      eyes = new Eyes()
      eyes.setBatch(batch)
      eyes.setBranchName('master')
      eyes.setHostOS('Android 8')
    })

    it('AndroidNativeApp checkWindow', async () => {
      await eyes.open(driver, 'AndroidNativeApp', 'AndroidNativeApp checkWindow')
      await eyes.check('', Target.window().ignoreRegions(new Region(1271, 0, 158, 100)))
      await eyes.close()
    })

    it('AndroidNativeApp checkRegion', async () => {
      await eyes.open(driver, 'AndroidNativeApp', 'AndroidNativeApp checkRegionFloating')
      await eyes.check(
        '',
        Target.region(new Region(0, 100, 1400, 2000)).floatingRegion(
          new Region(10, 10, 20, 20),
          3,
          3,
          20,
          30,
        ),
      )
      await eyes.close()
    })
  it(`AndroidNativeAppTest1`, async () => {
    driver = await new Builder()
      .withCapabilities({
        browserName: '',
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        name: 'AndroidNativeAppTest1',
        platformName: 'Android',
        deviceName: 'Android Emulator',
        platformVersion: '6.0',
        app: 'http://saucelabs.com/example_files/ContactManager.apk',
        clearSystemFiles: true,
        noReset: true,
      })
      .usingServer(sauceUrl)
      .build()
    eyes = new Eyes()
    eyes.setBatch(batch)
    await eyes.open(driver, 'Mobile Native Tests', 'Android Native App 1')
    await eyes.checkWindow('Contact list')
    await eyes.close()
  })

  it.skip(`AndroidNativeAppTest2`, async () => {
    driver = await new Builder()
      .withCapabilities({
        browserName: '',
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        name: 'AndroidNativeAppTest2',
        platformName: 'Android',
        deviceName: 'Samsung Galaxy S8 WQHD GoogleAPI Emulator',
        platformVersion: '7.1',
        automationName: 'uiautomator2',
        app: 'https://applitools.bintray.com/Examples/app-debug.apk',
        appPackage: 'com.applitoolstest',
        appActivity: 'com.applitoolstest.ScrollActivity',
        newCommandTimeout: 600,
      })
      .usingServer(sauceUrl)
      .build()
    eyes = new Eyes()
    eyes.setBatch(batch)
    await eyes.open(driver, 'Mobile Native Tests', 'Android Native App 2')

    let scrollableElement = await driver.findElement(
      new By('-android uiautomator', 'new UiSelector().scrollable(true)'),
    )
    await eyes.check(
      'Main window with ignore',
      Target.region(scrollableElement).ignore(scrollableElement),
    )
    await eyes.close(false)
  })

  describe('iOS', () => {
    beforeEach(async () => {
      driver = await new Builder()
        .withCapabilities({
          browserName: '',
          platformName: 'iOS',
          platformVersion: '12.2',
          deviceName: 'iPhone XS Simulator',
          username: process.env.SAUCE_USERNAME,
          accessKey: process.env.SAUCE_ACCESS_KEY,
          app: 'https://applitools.bintray.com/Examples/HelloWorldiOS_1_0.zip',
          clearSystemFiles: true,
          noReset: true,
          NATIVE_APP: true,
          idleTimeout: 200,
        })
        .usingServer(sauceUrl)
        .build()
      eyes = new Eyes()
      eyes.setBatch(batch)
      eyes.setBranchName('master')
    })

    it('iOSNativeApp checkWindow', async () => {
      await eyes.open(driver, 'iOSNativeApp', 'iOSNativeApp checkWindow')
      await eyes.check('', Target.window().ignoreRegions(new Region(0, 0, 300, 100)))
      await eyes.close()
    })

    it('iOSNativeApp checkRegion', async () => {
      await eyes.open(driver, 'iOSNativeApp', 'iOSNativeApp checkRegionFloating')
      await eyes.check(
        '',
        Target.region(new Region(0, 100, 375, 712)).floatingRegion(
          new Region(10, 10, 20, 20),
          3,
          3,
          20,
          30,
        ),
      )
      await eyes.close()
    })
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
