'use strict'

const {Target, Region} = require('../../../../index')
const {Builder} = require('selenium-webdriver')
const {getEyes, sauceUrl} = require('../util/TestSetup')
const {androidCaps} = require('../util/NativeApp')

describe('Android', () => {
  it('AndroidNativeApp checkWindow', async () => {
    let driver = await new Builder()
      .withCapabilities(androidCaps)
      .usingServer(sauceUrl)
      .build()
    let eyes = getEyes()
    eyes.setHostOS('Android 8')
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
