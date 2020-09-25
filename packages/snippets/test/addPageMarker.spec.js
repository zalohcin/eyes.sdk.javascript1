const assert = require('assert')
const {addPageMarker} = require('../dist/index')

describe('addPageMarker', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('ios safari', () => {
    let driver

    before(async function() {
      driver = await global.getDriver('ios safari')
      if (!driver) {
        this.skip()
      }
    })

    it('add page marker on scrolled page', async () => {
      await driver.url(url)
      await driver.execute('window.scrollTo(1000, 1000)')
      const marker = await driver.execute(addPageMarker)
      assert.deepStrictEqual(marker, {offset: 3, size: 9, mask: [0, 1, 0]})
      const element = await driver.$('[data-applitools-marker]')
      assert.ok(element.elementId)
      const {x, y} = await driver.execute(function(element) {
        return element.getBoundingClientRect()
      }, element)
      assert.deepStrictEqual({x, y}, {x: 0, y: 0})
    })

    it('add page marker on translated page', async () => {
      await driver.url(url)
      await driver.execute(function() {
        document.documentElement.style.transform = 'translate(-1000px, -1000px)'
        document.documentElement.style.webkitTransform = 'translate(-1000px, -1000px)'
      })
      const marker = await driver.execute(addPageMarker)
      assert.deepStrictEqual(marker, {offset: 3, size: 9, mask: [0, 1, 0]})
      const element = await driver.$('[data-applitools-marker]')
      assert.ok(element.elementId)
      const {x, y} = await driver.execute(function(element) {
        return element.getBoundingClientRect()
      }, element)
      assert.deepStrictEqual({x, y}, {x: 0, y: 0})
    })
  })
})
