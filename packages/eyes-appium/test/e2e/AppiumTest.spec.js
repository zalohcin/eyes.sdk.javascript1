'use strict'

const {Builder, By} = require('selenium-webdriver')
const {Options: ChromeOptions} = require('selenium-webdriver/chrome')
const {Eyes} = require('../../index')

describe('AppiumTest', function() {
  this.timeout(5 * 60 * 1000)

  async function checkWebsite(driver, eyes) {
    driver = await eyes.open(driver, '.NET SDK', 'Mobile Chrome')

    await driver.get('https://applitools.com')

    await eyes.checkWindow('Home')
    await driver.findElement(By.className('automated')).click()
    await eyes.checkWindow('Pricing')
    return eyes.close(false)
  }

  it('HelloWorld', async function() {
    const caps = new ChromeOptions()
    caps.set('deviceName', 'Nexus S5')
    caps.set('platformName', 'Android')
    caps.set('platformVersion', '5.1.0')
    caps.set('newCommandTimeout', 600)
    caps.set('idleTimeout', 900)

    const driver = new Builder()
      .usingServer('http://127.0.0.1:4723/wd/hub')
      .withCapabilities(caps)
      .build()

    const eyes = new Eyes()
    try {
      await checkWebsite(driver, eyes)

      // Set wrong scale ratio and run test again.
      await eyes.setScaleRatio(2)
      await checkWebsite(driver, eyes)

      // Go back to automatic scale ratio and run the test again.
      await eyes.setScaleRatio(0)
      await checkWebsite(driver, eyes)
    } finally {
      await eyes.abortIfNotClosed()
      await driver.quit()
    }
  })
})
