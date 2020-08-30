const playwright = require('playwright')
const assert = require('assert')
const {cleanupElementIds, markElements} = require('../dist/index')

describe('cleanupElementIds', () => {
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

    it('cleanupElementIds', async () => {
      await page.goto(url)
      const elements = await page.$$('#scrollable,#static,#fixed')
      const ids = ['aaa', 'bbb', 'ccc']
      await page.evaluate(markElements, {elements, ids})
      const selector =
        '[data-eyes-selector="aaa"],[data-eyes-selector="bbb"],[data-eyes-selector="ccc"]'
      const markedElements = await page.$$(selector)
      assert.strictEqual(markedElements.length, 3)
      await page.evaluate(cleanupElementIds, {elements})
      const markedElementsAfterCleanup = await page.$$(selector)
      assert.strictEqual(markedElementsAfterCleanup.length, 0)
    })
  })

  describe('ie', () => {
    let driver

    before(async function() {
      driver = global.ieDriver
      if (!driver) {
        this.skip()
      }
    })

    it('cleanupElementIds', async () => {
      await driver.url(url)
      const elements = await driver.$$('#scrollable,#static,#fixed')
      const ids = ['aaa', 'bbb', 'ccc']
      await driver.execute(markElements, {elements, ids})
      const selector =
        '[data-eyes-selector="aaa"],[data-eyes-selector="bbb"],[data-eyes-selector="ccc"]'
      const markedElements = await driver.$$(selector)
      assert.strictEqual(markedElements.length, 3)
      await driver.execute(cleanupElementIds, {elements})
      const markedElementsAfterCleanup = await driver.$$(selector)
      assert.strictEqual(markedElementsAfterCleanup.length, 0)
    })
  })
})
