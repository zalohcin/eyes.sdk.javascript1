const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const assert = require('assert')
const {getAbsoluteElementLocation} = require('../../../../src/wrappers/web-element-util')

describe('web-element-util', () => {
  describe('getAbsoluteElementLocation', () => {
    let driver
    let jsExecutor

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
      jsExecutor = driver.execute.bind(this)
    })

    afterEach(async () => {
      await driver.end()
    })

    after(() => {
      chromedriver.stop()
    })

    it('basic page - css', async () => {
      await driver.url(`file:///${__dirname}/examples/simple.html`)
      const element = await driver.element('#here')
      assert.deepStrictEqual(
        await getAbsoluteElementLocation({jsExecutor, element: element.value, logger: console}),
        {
          x: 8,
          y: 8,
        },
      )
    })

    it('basic page - xpath', async () => {
      await driver.url('http://applitools.github.io/demo/TestPages/FramesTestPage/')
      const element = await driver.element('/html/body/input')
      assert.deepStrictEqual(
        await getAbsoluteElementLocation({jsExecutor, element: element.value, logger: console}),
        {
          x: 8,
          y: 1494,
        },
      )
    })

    it('nested frame', async () => {
      await driver.url(`file:///${__dirname}/examples/nested-frames.html`)
      await driver.frame(0)
      await driver.frame(0)
      await driver.frame(0)
      const element = await driver.element('#here')
      assert.deepStrictEqual(
        await getAbsoluteElementLocation({jsExecutor, element: element.value, logger: console}),
        {
          x: 32,
          y: 176,
        },
      )
    })

    it('cors frame', async () => {
      await driver.url(`file:///${__dirname}/examples/cors.html`)
      await driver.frame(0)
      const element = await driver.element('button')
      // eslint-disable-next-line
      return assert.rejects(async () => {
        await getAbsoluteElementLocation({jsExecutor, element: element.value, logger: console})
      }, /Blocked a frame with origin/)
    })

    it('bogus web element', async () => {
      // eslint-disable-next-line
      return assert.rejects(async () => {
        await getAbsoluteElementLocation({jsExecutor, element: {}, logger: console})
      }, /Invalid element provided/)
    })
  })
})
