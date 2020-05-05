'use strict'

const {Eyes, Target} = require('../../../../index')
const {Builder} = require('selenium-webdriver')
const {batch, sauceUrl} = require('../util/TestSetup')
const {iOSCaps} = require('../util/NativeApp')

describe('iOS', () => {
  it.skip('iOSNativeApp checkRegion', async () => {
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
    } finally {
      await driver.quit()
      await eyes.abortIfNotClosed()
    }
  })
})
