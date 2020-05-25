'use strict'

require('chromedriver')
const assertRejects = require('assert-rejects')
const {getDriver} = require('../coverage/custom/util/TestSetup')
const {By, NoSuchElementError} = require('selenium-webdriver')
const {Eyes, VisualGridRunner, Target, RectangleSize, ConsoleLogHandler} = require('../../index')

let /** @type {WebDriver} */ driver
let eyes
describe('Bad Selectors', () => {
  before(async () => {
    driver = await getDriver('CHROME')
    eyes = new Eyes(new VisualGridRunner())
    eyes.setLogHandler(new ConsoleLogHandler(false))
  })

  it('check region with bad selector', async function() {
    await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')

    await eyes.open(
      driver,
      'Applitools Eyes JavaScript SDK',
      this.test.title,
      new RectangleSize(1200, 800),
    )

    await assertRejects(
      (async () => {
        await eyes.check('window', Target.region(By.css('#element_that_does_not_exist')))

        await eyes.close()
      })(),
      NoSuchElementError,
    )
  })

  it('test check region with bad ignore selector', async function() {
    await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')

    await eyes.open(
      driver,
      'Applitools Eyes JavaScript SDK',
      this.test.title,
      new RectangleSize(1200, 800),
    )

    await eyes.check(
      'window',
      Target.window()
        .ignoreRegions(By.css('body>p:nth-of-type(14)'))
        .beforeRenderScreenshotHook(
          "var p = document.querySelector('body>p:nth-of-type(14)'); p.parentNode.removeChild(p);",
        ),
    )

    await eyes.close()
  })

  after(async () => {
    if (driver != null) {
      await driver.quit()
    }
  })
})
