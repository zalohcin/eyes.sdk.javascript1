'use strict'
const {Eyes, Target} = require('../../../index')
const {Builder} = require('selenium-webdriver')
const {sauceUrl, batch} = require('./util/TestSetup')
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

  describe('Android', () => {
    beforeEach(async () => {
      driver = await new Builder()
        .withCapabilities(sauceCaps)
        .usingServer(sauceUrl)
        .build()
      eyes = new Eyes()
      eyes.setBatch(batch)
      eyes.setBranchName('master')
    })

    it('AndroidNativeApp checkWindow', async () => {
      await eyes.open(driver, 'AndroidNativeApp', 'AndroidNativeApp checkWindow')
      await eyes.check('', Target.window().ignore({left: 1271, top: 0, width: 158, height: 100}))
      await eyes.close()
    })

    it('AndroidNativeApp checkRegion', async () => {
      await eyes.open(driver, 'AndroidNativeApp', 'AndroidNativeApp checkRegionFloating')
      await eyes.check(
        '',
        Target.region({left: 0, top: 100, width: 1400, height: 2000}).floating({
          left: 10,
          top: 10,
          width: 20,
          height: 20,
          maxLeftOffset: 3,
          maxRightOffset: 3,
          maxUpOffset: 20,
          maxDownOffset: 30,
        }),
      )
      await eyes.close()
    })
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
        .usingServer(appiumUrl)
        .build()
      eyes = new Eyes()
      eyes.setBatch(batch)
      eyes.setBranchName('master')
    })

    it('iOSNativeApp checkWindow', async () => {
      await eyes.open(driver, 'iOSNativeApp', 'Smoke iOSNativeApp checkWindow')
      await eyes.check('', Target.window().ignore({left: 0, top: 0, width: 300, height: 100}))
      await eyes.close()
    })

    it('iOSNativeApp checkRegion', async () => {
      await eyes.open(driver, 'iOSNativeApp', 'Smoke iOSNativeApp checkRegion')
      await eyes.check(
        '',
        Target.region({left: 0, top: 100, width: 375, height: 712}).floating({
          left: 10,
          top: 10,
          width: 20,
          height: 20,
          maxLeftOffset: 3,
          maxRightOffset: 3,
          maxUpOffset: 20,
          maxDownOffset: 30,
        }),
      )
      await eyes.close()
    })
  })

  it(`Native app on sauce lab`, async () => {
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
        .ignore({left: 900, top: 0, width: 540, height: 100})
        .fully(),
    )
    await eyes.close()
  })

  it(`Native app on local appium`, async () => {
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
        .ignore({left: 900, top: 0, width: 180, height: 100})
        .fully(),
    )
    await eyes.close()
  })
})
