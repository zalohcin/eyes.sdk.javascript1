'use strict'
const {Builder} = require('selenium-webdriver')
;(async function() {
  const driver = await new Builder()
    .withCapabilities({
      browserName: 'chrome',
      'goog:chromeOptions': {
        debuggerAddress: '127.0.0.1:9222',
      },
    })
    .build()

  console.log(await driver.executeScript('return window.location.href'))
})()
