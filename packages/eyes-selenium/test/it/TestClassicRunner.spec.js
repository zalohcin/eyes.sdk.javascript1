'use strict'

require('chromedriver')
const assert = require('assert')
const {Builder, By, Capabilities} = require('selenium-webdriver')
const {Options: ChromeOptions} = require('selenium-webdriver/chrome')

const {Eyes, Target, DiffsFoundError} = require('../../index')

async function insertRandomBlock(target) {
  await driver.executeScript(`
    const block = document.querySelector('${target}');
    const random = document.createElement('div');
    random.innerText = Date.now();
    random.id = 'random-div';
    block.prepend(random);
  `)
}

let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes
let /** @type {string} */ appName,
  /** @type {string} */ testName,
  /** @type {{width: number, height: number}} */ viewportSize

describe('TestClassicRunner', () => {
  before(async function() {
    driver = await new Builder()
      .withCapabilities(Capabilities.chrome())
      .setChromeOptions(new ChromeOptions().headless().addArguments('disable-infobars'))
      .build()

    eyes = new Eyes()
    appName = this.test.parent.title
    testName = 'TestClassicRunner'
    viewportSize = {width: 800, height: 600}
  })

  beforeEach(async function() {
    await driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
    driver = await eyes.open(driver, appName, testName, viewportSize)
  })

  afterEach(async () => {
    await eyes.abort()
  })

  after(async () => {
    await driver.quit()
  })

  it('getAllTestResults should throw exception', async () => {
    await insertRandomBlock('#overflowing-div')

    await eyes.check('Diff region', Target.region(By.id('overflowing-div')))
    await eyes.closeAsync()

    try {
      const throwEx = true
      await eyes.getRunner().getAllTestResults(throwEx)
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
      const throwEx = false
      await eyes.getRunner().getAllTestResults(throwEx)
    } catch (err) {
      assert.fail()
    }
  })
})
