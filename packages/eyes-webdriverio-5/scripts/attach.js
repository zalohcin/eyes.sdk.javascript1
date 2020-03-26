'use strict'
const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')

;(async function() {
  await chromedriver.start(['--silent'], true)
  const browser = await remote({
    capabilities: {
      browserName: 'chrome',
      'goog:chromeOptions': {
        w3c: false,
        debuggerAddress: '127.0.0.1:9222',
      },
    },
    port: 9515,
    path: '/',
    logLevel: 'error',
  })
  console.log(await browser.execute('return window.location.href'))
  await browser.deleteSession()
  await chromedriver.stop()
})()
