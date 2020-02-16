const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const assert = require('assert')
const {getElementLocation} = require('../../../../src/wrappers/web-element-util')

describe('web-element-util', () => {
  describe('getElementLocation', () => {
    let driver

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
    })

    afterEach(async () => {
      await driver.end()
    })

    after(() => {
      chromedriver.stop()
    })

    it('nested frame', async () => {
      await driver.url(`file:///${__dirname}/examples/nested-frames.html`)
      await driver.frame(0)
      await driver.frame(0)
      await driver.frame(0)
      assert.deepStrictEqual(await getElementLocation({driver, selector: '#here'}), {x: 40, y: 184})
    })
  })
})
