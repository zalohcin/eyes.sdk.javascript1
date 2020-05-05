'use strict'

const {Eyes, Target, Region} = require('../../../../index')
const {Builder} = require('selenium-webdriver')
const {getBatch, sauceUrl} = require('../util/TestSetup')
const {androidCaps} = require('../util/NativeApp')
const batch = getBatch()

describe('Android', () => {
  it('AndroidNativeApp checkWindow', async () => {
    let driver = await new Builder()
      .withCapabilities(androidCaps)
      .usingServer(sauceUrl)
      .build()
    let eyes = new Eyes()
    eyes.setBatch(batch)
    eyes.setBranchName('master')
    eyes.setHostOS('Android 8')
    if(process.env.APPLITOOLS_API_KEY_SDK){
      eyes.setApiKey(process.env.APPLITOOLS_API_KEY_SDK)
    }
    try {
      await eyes.open(driver, 'AndroidNativeApp', 'AndroidNativeApp checkWindow')
      await eyes.check('', Target.window().ignoreRegions(new Region(0, 0, 1429, 100)))
      await eyes.close()
    } finally {
      await driver.quit()
      await eyes.abortIfNotClosed()
    }
  })
})
