const playwright = require('playwright')
const assert = require('assert')
const {markElements} = require('../dist/index')

describe('markElements', () => {
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

    it('markElements', async () => {
      await page.goto(url)
      const elements = await page.$$('#scrollable,#static,#fixed')
      const ids = ['aaa', 'bbb', 'ccc']
      await page.evaluate(markElements, {elements, ids})
      const markedElementIds = await page.evaluate(() =>
        [].map.call(
          document.querySelectorAll(
            '[data-eyes-selector="aaa"],[data-eyes-selector="bbb"],[data-eyes-selector="ccc"]',
          ),
          el => el.id,
        ),
      )
      assert.deepStrictEqual(markedElementIds, ['scrollable', 'static', 'fixed'])
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

    it('markElements', async () => {
      await driver.url(url)
      const elements = await driver.$$('#scrollable,#static,#fixed')
      const ids = ['aaa', 'bbb', 'ccc']
      await driver.execute(markElements, {elements, ids})
      const markedElementIds = await driver.execute(function() {
        return [].map.call(
          document.querySelectorAll('[data-eyes-selector="aaa"],[data-eyes-selector="bbb"],[data-eyes-selector="ccc"]'), // eslint-disable-line
          function(el) { return el.id }// eslint-disable-line
        )
      })
      assert.deepStrictEqual(markedElementIds, ['scrollable', 'static', 'fixed'])
    })
  })
})
