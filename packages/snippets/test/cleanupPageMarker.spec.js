const assert = require('assert')
const {addPageMarker, cleanupPageMarker} = require('../dist/index')

describe('cleanupPageMarker', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('ios safari', () => {
    let driver

    before(async function() {
      driver = await global.getDriver('ios safari')
      if (!driver) {
        this.skip()
      }
    })

    it('cleanup page marker', async () => {
      await driver.url(url)
      await driver.execute(addPageMarker)
      const element1 = await driver.$('[data-applitools-marker]')
      assert.ok(element1.elementId)
      await driver.execute(cleanupPageMarker)
      const element2 = await driver.$('[data-applitools-marker]')
      assert.ok(!element2.elementId)
    })
  })
})
