'use strict'

const createTestCafe = require('testcafe')

function startTestCafe({beforeEach, afterEach, browser = ['chrome:headless']}) {
  let testCafe, runner

  const isBrowserStack = browser.some(b => b.startsWith('browserstack'))
  const isApple = browser.some(b => ['safari', 'iPhone', 'iPad'].some(device => b.includes(device)))
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

  beforeEach(async () => {
    // For ports see: https://www.browserstack.com/question/664
    let ports = [1337]
    if (isBrowserStack && isApple) {
      ports = [8000, 8001]
    }

    testCafe = await createTestCafe(null, ...ports)
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
