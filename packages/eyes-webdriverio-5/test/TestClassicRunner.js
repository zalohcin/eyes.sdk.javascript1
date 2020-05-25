'use strict'

const assert = require('assert')
const {makeChromeDriver} = require('@applitools/sdk-shared')
const {remote} = require('webdriverio')
const {Eyes, By, ClassicRunner, DiffsFoundError, ConsoleLogHandler, Target} = require('../index')

let browser, runner, eyes, driver
const chromedriver = makeChromeDriver()

async function insertRandomBlock(target) {
  await driver.executeScript(`
    const block = document.querySelector('${target}');
    const random = document.createElement('div');
    random.innerText = Date.now();
    random.id = 'random-div';
    block.prepend(random);
  `)
}

describe('TestClassicRunner', () => {
  before(async () => {
    const returnPromise = true
    const chromeOptions = [`--port=9515`, '--url-base=/']
    await chromedriver.start(chromeOptions, returnPromise)

    runner = new ClassicRunner()

    eyes = new Eyes(runner)
    eyes.setLogHandler(new ConsoleLogHandler(false))
  })

  beforeEach(async function() {
    browser = await remote({
      port: 9515,
      path: '/',
      logLevel: 'silent',
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--disable-infobars', '--headless'],
        },
      },
    })
    driver = await eyes.open(browser, 'AppName', this.currentTest.title)
    await driver.url('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  })

  afterEach(async () => {
    await browser.deleteSession()
    await eyes.abortIfNotClosed()
  })

  after(async () => {
    chromedriver.stop()
  })

  it('getAllTestResults should throw exception', async () => {
    await insertRandomBlock('#overflowing-div')

    await eyes.check('Diff region', Target.region(By.id('overflowing-div')))
    await eyes.closeAsync()

    try {
      const shouldThrowException = true
      await eyes.getRunner().getAllTestResults(shouldThrowException)
      assert.fail()
    } catch (err) {
      assert.ok(err instanceof DiffsFoundError)
    }
  })

  it("getAllTestResults shouldn't throw exception", async () => {
    await insertRandomBlock('#overflowing-div')

    await eyes.check('Diff region', Target.region(By.id('overflowing-div')))
    await eyes.closeAsync()

    try {
      const shouldThrowException = false
      await eyes.getRunner().getAllTestResults(shouldThrowException)
    } catch (err) {
      assert.fail()
    }
  })
})
