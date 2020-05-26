'use strict'

const {Target, Region} = require('../../../../index')
const {Builder} = require('selenium-webdriver')
const {getEyes, sauceUrl} = require('../util/TestSetup')
const {iOSCaps} = require('../util/NativeApp')

describe('iOS', () => {
  it.skip('iOSNativeApp checkWindow', async () => {
    let driver = await new Builder()
      .withCapabilities(iOSCaps)
      .usingServer(sauceUrl)
      .build()
    let eyes = getEyes()
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
