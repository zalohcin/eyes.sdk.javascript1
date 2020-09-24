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

    it('add page marker', async () => {
      await driver.url(url)
      const marker = await driver.execute(addPageMarker)
      assert.deepStrictEqual(marker, {offset: 3, size: 9, mask: [0, 1, 0]})
      const element = await driver.$('[data-applitools-marker-id]')
      assert.ok(element.elementId)
      const {x, y} = await element.getLocation()
      assert.deepStrictEqual({x, y}, {x: 0, y: 0})
    })
  })
})
