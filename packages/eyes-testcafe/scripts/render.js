'use strict'
const {resolve} = require('path')
const createTestCafe = require('testcafe')

/*
 * Example usage:
 * (1) npm run render https://google.com
 * (2) npm run render play *.apple.testcafe.js
 * (2) npm run render play      // runs play.testcafe.js
 * (*) Add LIVE=1 for live run.
 */

let files = '*.testcafe.js'
if (process.argv[2] === 'play') {
  files = process.argv[3] ? `play/${process.argv[3]}` : 'play/play.testcafe.js'
}
const path = resolve(__dirname, files)
const isLive = !!process.env.LIVE

let testcafe = null

createTestCafe(null, 1339)
  .then(tc => {
    testcafe = tc
    let runner, browser
    if (!isLive) {
      runner = testcafe.createRunner()
      process.env.BROWSERSTACK_USE_AUTOMATE = true
      // process.env.BROWSERSTACK_CONSOLE = 'errors'
      // process.env.BROWSERSTACK_NETWORK_LOGS = true

      browser = [
        'chrome:headless',
        'chrome:emulation:width=100;height=200;mobile=true;orientation=vertical;touch=true',
        'chrome:emulation:device=iphone X',
        'browserstack:safari@13.0:OS X Catalina',
        'browserstack:safari@12.1:OS X Mojave',
        'browserstack:edge',
        'browserstack:ie',
        'saucelabs:Safari@13.0:macOS 10.13',
        'browserstack:iPhone XS',
        'saucelabs:iPhone XS Simulator@13.0',
        'saucelabs:iPhone Simulator@13.0',
        'browserstack:iPad Pro 12.9 2018',
        'browserstack:chrome',
      ][0]
    } else {
      runner = testcafe.createLiveModeRunner()
      browser = 'chrome'
    }
    return runner
      .src([path])
      .browsers([browser])
      .run({skipJsErrors: true, debugMode: false})
  })
  .finally(() => testcafe.close())
