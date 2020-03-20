'use strict'
const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')

;(async function() {
  await chromedriver.start(['--silent'], true)
  const browser = remote({
    desiredCapabilities: {
      browserName: 'chrome',
      'goog:chromeOptions': {
        debuggerAddress: '127.0.0.1:9222',
      },
    },
    port: 9515,
    path: '/',
    logLevel: 'error',
  })
  await browser.init()
  console.log((await browser.execute('return window.location.href')).value)
  await browser.end()
  await chromedriver.stop()
})()
