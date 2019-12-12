'use strict'

const createTestCafe = require('testcafe')

function startTestCafe({beforeEach, afterEach}) {
  let testCafe, runner, browser

  beforeEach(async () => {
    testCafe = await createTestCafe('localhost', 1337)
    if (!process.env.APPLITOOLS_DEBUG_TEST) {
      runner = testCafe.createRunner()
      browser = 'chrome:headless'
    } else {
      runner = testCafe.createLiveModeRunner()
      browser = 'chrome'
    }
    runner.screenshots('logs/').browsers(browser)
  })

  afterEach(async () => {
    await testCafe.close()
  })

  return {runFileInTestCafe}

  async function runFileInTestCafe(filepath) {
    return runner.src(filepath).run()
  }
}

module.exports = startTestCafe // eslint-disable-line node/exports-style
