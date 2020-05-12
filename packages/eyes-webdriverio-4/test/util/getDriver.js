'use strict'
const {remote} = require('webdriverio')

async function getDriver({capabilities}) {
  const browser = remote({
    logLevel: 'error',
    desiredCapabilities: capabilities,
  })
  await browser.init()
  return {driver: browser}
}

module.exports = getDriver
