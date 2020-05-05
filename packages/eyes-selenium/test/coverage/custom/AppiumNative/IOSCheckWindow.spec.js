'use strict'

const {Eyes, Target, Region} = require('../../../../index')
const {Builder} = require('selenium-webdriver')
const {getBatch, sauceUrl} = require('../util/TestSetup')
const {iOSCaps} = require('../util/NativeApp')
const batch = getBatch()

describe('iOS', () => {
  it('iOSNativeApp checkWindow', async () => {
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
      await eyes.open(driver, 'iOSNativeApp', 'iOSNativeApp checkWindow')
      await eyes.check('', Target.window().ignoreRegions(new Region(0, 0, 300, 100)))
      await eyes.close()
    } finally {
      await driver.quit()
      await eyes.abortIfNotClosed()
    }
  })
})
