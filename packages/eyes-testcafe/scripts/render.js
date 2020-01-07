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
      browser = [
        'chrome:headless',
        'browserstack:safari@13.0:OS X Catalina',
        'browserstack:safari@12.1:OS X Mojave',
        'browserstack:iPhone XS',
        'browserstack:iPhone X',
        'browserstack:iPhone 8',
        'browserstack:iPad Pro 12.9 2018',
        'browserstack:edge',
        'browserstack:ie',
        'browserstack:chrome',
      ][0]
    } else {
      runner = testcafe.createLiveModeRunner()
      browser = 'chrome'
    }
    return runner
      .src([path])
      .browsers([browser])
      .run({})
  })
  .finally(() => testcafe.close())
