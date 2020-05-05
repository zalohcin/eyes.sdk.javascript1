'use strict'

const {Eyes, Target} = require('../../../../index')
const {Builder} = require('selenium-webdriver')
const {batch, sauceUrl} = require('../util/TestSetup')
const {iOSCaps} = require('../util/NativeApp')

describe('iOS', () => {
  it.skip('iOSNativeApp checkWindow', async () => {
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
      await eyes.check('', Target.window().ignore({left: 0, top: 0, width: 300, height: 100}))
      await eyes.close()
    } finally {
      await driver.quit()
      await eyes.abortIfNotClosed()
    }
  })
})
