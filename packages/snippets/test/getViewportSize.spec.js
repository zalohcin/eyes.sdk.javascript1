const playwright = require('playwright')
const {remote} = require('webdriverio')
const assert = require('assert')
const {getViewportSize} = require('../dist/index')

describe('getViewportSize', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let browser, page

    before(async () => {
      browser = await playwright.chromium.launch()
      const context = await browser.newContext()
      page = await context.newPage()
    })

    after(async () => {
      await browser.close()
    })

    it('return viewport size', async () => {
      await page.goto(url)
      const expectedViewportSize = {width: 500, height: 500}
      await page.setViewportSize(expectedViewportSize)
      const viewportSize = await page.evaluate(getViewportSize)
      assert.deepStrictEqual(viewportSize, expectedViewportSize)
    })
  })

  describe('ie', () => {
    let driver

    before(async () => {
      driver = await remote({
        protocol: 'https',
        hostname: 'ondemand.saucelabs.com',
        path: '/wd/hub',
        port: 443,
        logLevel: 'silent',
        capabilities: {
          browserName: 'internet explorer',
          browserVersion: '11.285',
          platformName: 'Windows 10',
          'sauce:options': {
            username: process.env.SAUCE_USERNAME,
            accessKey: process.env.SAUCE_ACCESS_KEY,
          },
        },
      })
    })

    after(async () => {
      await driver.deleteSession()
    })

    it('return viewport size', async () => {
      await driver.url(url)
      const expectedViewportSize = {width: 500, height: 500}
      await driver.setWindowSize(expectedViewportSize.width, expectedViewportSize.height)
      const browserWrapperSize = await driver.execute(function() {
        return {
          width: window.outerWidth - window.innerWidth,
          height: window.outerHeight - window.innerHeight,
        }
      })
      await driver.setWindowSize(
        expectedViewportSize.width + browserWrapperSize.width,
        expectedViewportSize.height + browserWrapperSize.height,
      )

      const viewportSize = await driver.execute(getViewportSize)
      assert.deepStrictEqual(viewportSize, expectedViewportSize)
    })
  })
})
