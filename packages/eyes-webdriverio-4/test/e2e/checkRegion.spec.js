const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const {Eyes, Target} = require('../../index')

describe('checkRegion', () => {
  let driver
  let eyes

  before(async () => {
    await chromedriver.start(['--port=4444', '--url-base=wd/hub', '--silent'], true)
  })

  beforeEach(async () => {
    const browserOptions = {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['disable-infobars', 'headless'],
        },
      },
    }
    driver = remote(browserOptions)
    await driver.init()
    eyes = new Eyes()
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY)
  })

  afterEach(async () => {
    await driver.end()
    await eyes.abortIfNotClosed()
  })

  after(() => {
    chromedriver.stop()
  })

  it('by locator', async function() {
    await eyes.open(driver, this.test.parent.title, this.test.title, {width: 800, height: 600})
    await driver.url(`file:///${__dirname}/../it/src/wrappers/examples/simple.html`)
    await eyes.check(undefined, Target.region('#here'))
    await eyes.close()
  })
})
