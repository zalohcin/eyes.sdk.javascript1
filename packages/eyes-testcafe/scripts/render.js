'use strict'
const {resolve} = require('path')
const createTestCafe = require('testcafe')

/*
 * Example usage:
 * (1) npm run render https://google.com
 * (2) npm run render play *.apple.testcafe.js
 * (2) npm run render play
 * (*) Add LIVE=1 for live run.
 */

let files = '*.testcafe.js'
if (process.argv[2] === 'play') {
  files = process.argv[3] ? `play/${process.argv[3]}` : 'play/play.testcafe.js'
}
const path = resolve(__dirname, files)
const isLive = !!process.env.LIVE

let testcafe = null
createTestCafe('localhost', 1339)
  .then(tc => {
    testcafe = tc
    let runner, browser
    if (!isLive) {
      runner = testcafe.createRunner()
      browser = 'chrome:headless'
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
