'use strict'

async function takeScreenshot(driver) {
  return await driver.takeScreenshot()
}

module.exports = takeScreenshot
