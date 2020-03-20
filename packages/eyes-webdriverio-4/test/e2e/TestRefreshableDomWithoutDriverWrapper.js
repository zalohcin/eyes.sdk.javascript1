const assert = require('assert')
const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const {Target, Eyes, ConsoleLogHandler} = require('../../index')

describe('Trello 269', () => {
  let eyes
  let driver

  before(async () => {
    await chromedriver.start([], true)

    eyes = new Eyes()
    eyes.setLogHandler(new ConsoleLogHandler(false))
  })

  beforeEach(async function() {
    const chrome = {
      port: 9515,
      path: '/',
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['headless', 'disable-infobars'],
        },
      },
    }
    driver = remote(chrome)
    await driver.init()
    await eyes.open(driver, 'AppName', this.currentTest.fullTitle(), {
      width: 600,
      height: 500,
    })
  })

  afterEach(async () => {
    await driver.end()
    await eyes.abort()
  })

  after(async () => {
    chromedriver.stop()
  })

  it('refresh element inside iframe after StaleElementReference', async () => {
    await driver.url('https://applitools.github.io/demo/TestPages/RefreshDomPage/iframe')
    await driver.frame() // default content
    await driver.frame('frame')
    const region = await driver.element('#inner-img')
    await driver.click('#refresh-button')
    await driver.frame() // default content

    await eyes.check('Handle', Target.frame('frame').region(region))
    return eyes.close()
  })

  it('refresh element after StaleElementReference', async () => {
    await driver.url('https://applitools.github.io/demo/TestPages/RefreshDomPage')
    const region = await driver.element('#inner-img')
    await driver.click('#refresh-button')

    await eyes.check('Handle', Target.region(region))
    return eyes.close()
  })

  it('throw after unhandled StaleElementReference', async () => {
    await driver.url('https://applitools.github.io/demo/TestPages/RefreshDomPage')

    const region = await driver.element('#inner-img')
    await driver.click('#invalidate-button')

    try {
      await eyes.check('Throw', Target.region(region))
      assert.fail()
    } catch (err) {
      if (err.constructor.name === 'AssertionError') throw err
      assert.strictEqual(err.seleniumStack && err.seleniumStack.type, 'StaleElementReference')
    } finally {
      await eyes.close(false)
    }
  })
})
