'use strict'

const {Target, Region} = require('../../../../index')
const {Builder} = require('selenium-webdriver')
const {getEyes, sauceUrl} = require('../util/TestSetup')
const {androidCaps} = require('../util/NativeApp')

describe('Android', () => {
  it('AndroidNativeApp checkRegion', async () => {
    let driver = await new Builder()
      .withCapabilities(androidCaps)
      .usingServer(sauceUrl)
      .build()
    let eyes = getEyes()
    eyes.setHostOS('Android 8')
    try {
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
    } finally {
      await driver.quit()
      await eyes.abortIfNotClosed()
    }
  })
})
