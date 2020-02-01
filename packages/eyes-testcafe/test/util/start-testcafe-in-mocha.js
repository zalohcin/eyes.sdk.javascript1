'use strict'
require('dotenv').config()
const createTestCafe = require('testcafe')

async function startTestCafe() {
  let testCafe, runner
  let ports = [1337]
  testCafe = await createTestCafe(null, ...ports)
  return {runFileInTestCafe, close}

  async function close() {
    return testCafe.close()
  }

  async function runFileInTestCafe(filepath, browser = ['chrome:headless']) {
    const isBrowserStack = browser.some(b => b.startsWith('browserstack'))
    if (
      isBrowserStack &&
      (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY)
    ) {
      throw new Error(
        'Missing BrowserStack env variables BROWSERSTACK_USERNAME and/or BROWSERSTACK_ACCESS_KEY',
      )
    }
    if (isBrowserStack) {
      process.env.BROWSERSTACK_USE_AUTOMATE = true
    }

    const isSaucelabs = browser.some(b => b.startsWith('saucelabs'))
    if (isSaucelabs && (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY)) {
      throw new Error('Missing SauceLabs env variables SAUCE_USERNAME and/or SAUCE_ACCESS_KEY')
    }

    if (!process.env.LIVE) {
      runner = testCafe.createRunner()
      runner.screenshots('logs/').browsers(browser)
    } else {
      runner = testCafe.createLiveModeRunner()
      runner.screenshots('logs/').browsers('chrome')
    }

    return runner.src(filepath).run()
  }
}

module.exports = startTestCafe
