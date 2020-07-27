const playwright = require('playwright')
const {remote} = require('webdriverio')
const assert = require('assert')
const {getDocumentSize} = require('../dist/index')

describe('getDocumentSize', () => {
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

    it('return document size', async () => {
      await page.goto(url)
      const size = await page.evaluate(getDocumentSize)
      assert.deepStrictEqual(size, {width: 3000, height: 3000})
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

    it('return document size', async () => {
      await driver.url(url)
      const size = await driver.execute(getDocumentSize)
      assert.deepStrictEqual(size, {width: 3000, height: 3000})
    })
  })
})
