'use strict'

const createTestCafe = require('testcafe')

function startTestCafe({beforeEach, afterEach, browser = 'chrome:headless'}) {
  let testCafe, runner

  const isBrowserStack = browser.startsWith('browserstack')
  if (
    (isBrowserStack && !process.env.BROWSERSTACK_USERNAME) ||
    !process.env.BROWSERSTACK_ACCESS_KEY
  ) {
    throw new Error(
      'Missing BrowserStack env variables BROWSERSTACK_USERNAME and/or BROWSERSTACK_ACCESS_KEY',
    )
  }
  if (isBrowserStack) {
    process.env.BROWSERSTACK_USE_AUTOMATE = true
  }

  beforeEach(async () => {
    testCafe = await createTestCafe('localhost', 1337)
    if (!process.env.APPLITOOLS_DEBUG_TEST) {
      runner = testCafe.createRunner()
      runner.screenshots('logs/').browsers(browser)
    } else {
      runner = testCafe.createLiveModeRunner()
      runner.screenshots('logs/').browsers('chrome')
    }
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
