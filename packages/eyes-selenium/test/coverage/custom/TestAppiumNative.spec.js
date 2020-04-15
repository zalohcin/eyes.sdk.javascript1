'use strict'
const {Eyes, Region, Target} = require('../../../index')
const {Builder} = require('selenium-webdriver')
const {getBatch, sauceUrl} = require('./util/TestSetup')
const batch = getBatch()
const sauceCaps = {
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
        .withCapabilities(sauceCaps)
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
      await eyes.open(driver, 'iOSNativeApp', 'Smoke iOSNativeApp checkWindow')
      await eyes.check('', Target.window().ignoreRegions(new Region(0, 0, 300, 100)))
      await eyes.close()
    })

    it('iOSNativeApp checkRegion', async () => {
      await eyes.open(driver, 'iOSNativeApp', 'Smoke iOSNativeApp checkRegion')
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

  it(`Native iOS app on sauce lab`, async () => {
    driver = await new Builder()
      .withCapabilities({
        browserName: '',
        platformName: 'iOS',
        platformVersion: '13.4',
        deviceName: 'iPhone 11',
        deviceOrientation: 'portrait',
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        app: 'https://applitools.bintray.com/Examples/eyes-ios-hello-world.zip',
        clearSystemFiles: true,
        noReset: true,
      })
      .usingServer('http://0.0.0.0:4723/wd/hub/')
      .build()
    eyes = new Eyes()
    eyes.setBatch(batch)
    eyes.setApiKey('iAWghOAyKnJzJvoxIhO6ZxOaAnF1CUY6BH9v2zk9HGY110')
    await eyes.open(driver, 'JS test', 'Checking eyes settings in appium tests')
    await eyes.check('Check', Target.window())
    await eyes.close()
  })
})
