const playwright = require('playwright')
const {remote} = require('webdriverio')
const assert = require('assert')
const {setElementStyleProperty} = require('../dist/index')

describe('setElementStyleProperty', () => {
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

    it('set element style properties', async () => {
      await page.goto(url)
      const element = await page.$('#scrollable')
      const originalOverflow = await page.evaluate(setElementStyleProperty, {
        element,
        property: 'overflow',
        value: 'hidden',
      })
      assert.deepStrictEqual(originalOverflow, '')
      const actualOverflow = await page.evaluate(element => element.style.overflow, element)
      assert.deepStrictEqual(actualOverflow, 'hidden')
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

    it('set element style properties', async () => {
      await driver.url(url)
      const element = await driver.$('#scrollable')
      const originalOverflow = await driver.execute(setElementStyleProperty, {
        element,
        property: 'overflow',
        value: 'hidden',
      })
      assert.deepStrictEqual(originalOverflow, '')
      const actualOverflow = await driver.execute(function(element) {
        return element.style.overflow
      }, element)
      assert.deepStrictEqual(actualOverflow, 'hidden')
    })
  })
})
