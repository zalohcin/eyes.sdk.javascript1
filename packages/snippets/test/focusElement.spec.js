const playwright = require('playwright')
const {remote} = require('webdriverio')
const assert = require('assert')
const {focusElement} = require('../dist/index')

describe('focusElement', () => {
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

    it('focus element', async () => {
      await page.goto(url)
      const element = await page.$('#focusable')
      const isBlurred = await page.evaluate(element => element !== document.activeElement, element)
      assert.ok(isBlurred)
      await page.evaluate(focusElement, {element})
      const isFocused = await page.evaluate(element => element === document.activeElement, element)
      assert.ok(isFocused)
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

    it('focus element', async () => {
      await driver.url(url)
      const element = await driver.$('#focusable')
      const isBlurred = await driver.execute(function(element) {
        return element !== document.activeElement
      }, element)
      assert.ok(isBlurred)
      await driver.execute(focusElement, {element})
      const isFocused = await driver.execute(function(element) {
        return element === document.activeElement
      }, element)
      assert.ok(isFocused)
    })
  })
})
