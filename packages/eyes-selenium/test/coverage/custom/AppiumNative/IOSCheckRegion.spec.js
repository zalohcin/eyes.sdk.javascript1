'use strict'

const {Eyes, Target, Region} = require('../../../../index')
const {Builder} = require('selenium-webdriver')
const {getBatch, sauceUrl} = require('../util/TestSetup')
const {iOSCaps} = require('../util/NativeApp')
const batch = getBatch()

describe('iOS', () => {
  it('iOSNativeApp checkRegion', async () => {
    let driver = await new Builder()
      .withCapabilities(iOSCaps)
      .usingServer(sauceUrl)
      .build()
    let eyes = new Eyes()
    eyes.setBatch(batch)
    eyes.setBranchName('master')
    if(process.env.APPLITOOLS_API_KEY_SDK){
      eyes.setApiKey(process.env.APPLITOOLS_API_KEY_SDK)
    }
    try {
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
    } finally {
      await driver.quit()
      await eyes.abortIfNotClosed()
    }
  })
})
