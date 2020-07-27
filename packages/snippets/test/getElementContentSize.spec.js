const playwright = require('playwright')
const {remote} = require('webdriverio')
const assert = require('assert')
const {getElementContentSize} = require('../dist/index')

describe('getElementContentSize', () => {
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

    it('return size of scrollable element', async () => {
      await page.goto(url)
      const element = await page.$('#scrollable')
      const size = await page.evaluate(getElementContentSize, {element})
      assert.deepStrictEqual(size, {width: 600, height: 600})
    })

    it('return size of static element', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      const size = await page.evaluate(getElementContentSize, {element})
      assert.deepStrictEqual(size, {width: 294, height: 294})
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

    it('return size of scrollable element', async () => {
      await driver.url(url)
      const element = await driver.$('#scrollable')
      const size = await driver.execute(getElementContentSize, {element})
      assert.deepStrictEqual(size, {width: 566, height: 566})
    })

    it('return size of static element', async () => {
      await driver.url(url)
      const element = await driver.$('#static')
      const size = await driver.execute(getElementContentSize, {element})
      assert.deepStrictEqual(size, {width: 294, height: 294})
    })
  })
})
