const assert = require('assert')
const {addPageMarker} = require('../dist/index')

describe('addPageMarker', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('add page marker on scrolled page', async () => {
      await page.goto(url)
      await page.evaluate('window.scrollTo(1000, 1000)')
      const marker = await page.evaluate(addPageMarker)
      assert.deepStrictEqual(marker, {offset: 1, size: 3, mask: [0, 1, 0]})
      const element = await page.$('[data-applitools-marker]')
      assert.ok(element)
      const {x, y} = await element.boundingBox()
      assert.deepStrictEqual({x, y}, {x: 0, y: 0})
    })

    it('add page marker on translated page', async () => {
      await page.goto(url)
      await page.evaluate(function() {
        document.documentElement.style.transform = 'translate(-1000px, -1000px)'
        document.documentElement.style.webkitTransform = 'translate(-1000px, -1000px)'
      })
      const marker = await page.evaluate(addPageMarker)
      assert.deepStrictEqual(marker, {offset: 1, size: 3, mask: [0, 1, 0]})
      const element = await page.$('[data-applitools-marker]')
      assert.ok(element)
      const {x, y} = await element.boundingBox()
      assert.deepStrictEqual({x, y}, {x: 0, y: 0})
    })
  })

  describe('ios safari', () => {
    let driver

    before(async function() {
      driver = await global.getDriver('ios safari')
      if (!driver) {
        this.skip()
      }
    })

    it.only('returns safe area on landscape mode', async () => {
      await driver.url(url)
      await driver.execute('window.scrollTo(1000, 1000)')
      await driver.setOrientation('landscape')
      await driver.saveScreenshot('state.png')
      const marker = await driver.execute(addPageMarker)
      await driver.setOrientation('portrait')
      assert.deepStrictEqual(marker, {
        offset: 1,
        mask: [0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0],
        orientation: 90,
        isCover: false,
        safeArea: {top: 0, left: 44, right: 44, bottom: 21},
        pixelRation: 3,
      })
      const element = await driver.$('[data-applitools-marker]')
      assert.ok(element.elementId)
      const {x, y, width, height} = await driver.execute(function(element) {
        return element.getBoundingClientRect()
      }, element)
      assert.deepStrictEqual({x, y, width, height}, {x: 0, y: 0, width: 14, height: 3})
    })

    it('add page marker on scrolled page', async () => {
      await driver.url(url)
      await driver.execute('window.scrollTo(1000, 1000)')
      const marker = await driver.execute(addPageMarker)
      await driver.saveScreenshot('filename-0.png')
      console.log(marker)
      assert.deepStrictEqual(marker, {
        offset: 1,
        mask: [0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0],
        orientation: 0,
        isCover: false,
        safeArea: {top: 0, left: 44, right: 44, bottom: 21},
        pixelRation: 3,
      })
      const element = await driver.$('[data-applitools-marker]')
      assert.ok(element.elementId)
      const {x, y, width, height} = await driver.execute(function(element) {
        return element.getBoundingClientRect()
      }, element)
      assert.deepStrictEqual({x, y, width, height}, {x: 0, y: 0, width: 14, height: 3})
    })

    it('add page marker on translated page', async () => {
      await driver.url(url)
      await driver.execute(function() {
        document.documentElement.style.transform = 'translate(-1000px, -1000px)'
        document.documentElement.style.webkitTransform = 'translate(-1000px, -1000px)'
      })
      const marker = await driver.execute(addPageMarker)
      await driver.saveScreenshot('filename-1.png')
      console.log(marker)
      assert.deepStrictEqual(marker, {
        offset: 1,
        mask: [0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0],
        orientation: 0,
        isCover: false,
        safeArea: {top: 0, left: 44, right: 44, bottom: 21},
        pixelRation: 3,
      })
      const element = await driver.$('[data-applitools-marker]')
      assert.ok(element.elementId)
      const {x, y, width, height} = await driver.execute(function(element) {
        return element.getBoundingClientRect()
      }, element)
      assert.deepStrictEqual({x, y, width, height}, {x: 0, y: 0, width: 14, height: 3})
    })
  })
})
