const playwright = require('playwright')
const {remote} = require('webdriverio')
const assert = require('assert')
const {getElementComputedStyleProperties} = require('../dist/index')

describe('getElementComputedStyleProperties', () => {
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

    it('return element computed style properties', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      const computedStyleProperties = await page.evaluate(getElementComputedStyleProperties, {
        element,
        properties: ['background-color', 'border-top-width'],
      })
      assert.deepStrictEqual(computedStyleProperties, ['rgb(0, 128, 128)', '3px'])
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

    it('return element computed style properties', async () => {
      await driver.url(url)
      const element = await driver.$('#static')
      const computedStyleProperties = await driver.execute(getElementComputedStyleProperties, {
        element,
        properties: ['background-color', 'border-top-width'],
      })
      assert.deepStrictEqual(computedStyleProperties, ['rgb(0, 128, 128)', '3px'])
    })
  })
})
