'use strict'

require('chromedriver')
const {Builder, Capabilities} = require('selenium-webdriver')
const {Options: ChromeOptions} = require('selenium-webdriver/chrome')
const {Eyes, Target, RectangleSize} = require('../../index')

let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes
describe('ServerConnector', () => {
  before(async () => {
    driver = await new Builder()
      .withCapabilities(Capabilities.chrome())
      .setChromeOptions(new ChromeOptions().headless().addArguments('disable-infobars'))
      .build()

    eyes = new Eyes()
  })

  it('deleteSession', async function() {
    await eyes.open(
      driver,
      this.test.parent.title,
      this.test.title,
      new RectangleSize({width: 800, height: 599}),
    )

    await driver.get('https://applitools.com/helloworld')

    await eyes.check('Hello', Target.window())

    const results = await eyes.close()

    await results.deleteSession()
  })

  afterEach(async () => {
    await driver.quit()
    await eyes.abort()
  })
})
