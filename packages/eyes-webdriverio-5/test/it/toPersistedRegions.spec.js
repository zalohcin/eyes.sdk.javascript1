'use strict'

const assert = require('assert')
const {By, Region} = require('../../index')
const {IgnoreRegionByRectangle, FloatingRegionByRectangle} = require('@applitools/eyes-sdk-core')
const IgnoreRegionBySelector = require('../../src/fluent/IgnoreRegionBySelector')
const IgnoreRegionByElement = require('../../src/fluent/IgnoreRegionByElement')
const FloatingRegionBySelector = require('../../src/fluent/FloatingRegionBySelector')
const FloatingRegionByElement = require('../../src/fluent/FloatingRegionByElement')

describe('toPersistedRegions()', function() {
  let driver
  before(() => {
    driver = {
      executeScript: async (_script, element) => `xpath of ${element}`,
      findElements: async locator => [`webelement of ${locator.value}`],
    }
  })

  it('IgnoreRegionByRectangle', async function() {
    const region = new IgnoreRegionByRectangle(
      new Region({left: 15, top: 15, width: 15, height: 15}),
    )
    const [{left, top, width, height}] = await region.toPersistedRegions(driver)
    assert.deepStrictEqual({left, top, width, height}, {left: 15, top: 15, width: 15, height: 15})
  })

  it('FloatingRegionByRectangle', async function() {
    const region = new FloatingRegionByRectangle(
      new Region({left: 15, top: 15, width: 15, height: 15}),
      1,
      2,
      3,
      4,
    )
    const [
      {left, top, width, height, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset},
    ] = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(
      {left, top, width, height, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset},
      {
        left: 15,
        top: 15,
        width: 15,
        height: 15,
        maxUpOffset: 1,
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
      },
    )
  })

  it('IgnoreRegionByElement', async function() {
    const region = new IgnoreRegionByElement('my-web-element')
    const persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'xpath of my-web-element',
      },
    ])
  })

  it('FloatingRegionByElement', async function() {
    const region = new FloatingRegionByElement('my-web-element', 1, 2, 3, 4)
    const persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'xpath of my-web-element',
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
        maxUpOffset: 1,
      },
    ])
  })

  describe('IgnoreRegionBySelector', function() {
    it('works', async function() {
      let region = new IgnoreRegionBySelector(By.css('some'))
      let persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: 'some'}])

      region = new IgnoreRegionBySelector(By.id('some'))
      persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '*[id="some"]'}])

      region = new IgnoreRegionBySelector(By.className('some'))
      persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '.some'}])

      region = new IgnoreRegionBySelector(By.name('some'))
      persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '*[name="some"]'}])

      region = new IgnoreRegionBySelector(By.xpath('//some'))
      persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [{type: 'xpath', selector: '//some'}])
    })

    it('works with multiple elements', async function() {
      const origFindElements = driver.findElements
      driver.findElements = async locator => [
        `webelement1 of ${locator.value}`,
        `webelement2 of ${locator.value}`,
      ]

      let region = new IgnoreRegionBySelector(By.js('some'))
      let persistedRegion = await region.toPersistedRegions(driver)
      driver.findElements = origFindElements

      assert.deepStrictEqual(persistedRegion, [
        {type: 'xpath', selector: 'xpath of webelement1 of undefined'},
        {type: 'xpath', selector: 'xpath of webelement2 of undefined'},
      ])
    })

    it('works with non selector locators', async function() {
      let region = new IgnoreRegionBySelector(By.js('some'))
      let persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'xpath',
          selector: 'xpath of webelement of undefined',
        },
      ])

      region = new IgnoreRegionBySelector(By.linkText('some 1'))
      persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'xpath',
          selector: 'xpath of webelement of some 1',
        },
      ])

      region = new IgnoreRegionBySelector(By.partialLinkText('some 2'))
      persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'xpath',
          selector: 'xpath of webelement of some 2',
        },
      ])
    })
  })

  describe('FloatingRegionBySelector', function() {
    it('works', async function() {
      let region = new FloatingRegionBySelector(By.css('some'), 1, 2, 3, 4)
      let persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'css',
          selector: 'some',
          maxDownOffset: 2,
          maxLeftOffset: 3,
          maxRightOffset: 4,
          maxUpOffset: 1,
        },
      ])

      region = new FloatingRegionBySelector(By.id('some'), 1, 2, 3, 4)
      persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'css',
          selector: '*[id="some"]',
          maxDownOffset: 2,
          maxLeftOffset: 3,
          maxRightOffset: 4,
          maxUpOffset: 1,
        },
      ])

      region = new FloatingRegionBySelector(By.className('some'), 1, 2, 3, 4)
      persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'css',
          selector: '.some',
          maxDownOffset: 2,
          maxLeftOffset: 3,
          maxRightOffset: 4,
          maxUpOffset: 1,
        },
      ])

      region = new FloatingRegionBySelector(By.name('some'), 1, 2, 3, 4)
      persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'css',
          selector: '*[name="some"]',
          maxDownOffset: 2,
          maxLeftOffset: 3,
          maxRightOffset: 4,
          maxUpOffset: 1,
        },
      ])

      region = new FloatingRegionBySelector(By.xpath('//some'), 1, 2, 3, 4)
      persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'xpath',
          selector: '//some',
          maxDownOffset: 2,
          maxLeftOffset: 3,
          maxRightOffset: 4,
          maxUpOffset: 1,
        },
      ])
    })

    it('works with non selector locators', async function() {
      let region = new FloatingRegionBySelector(By.js('some'), 1, 2, 3, 4)
      let persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'xpath',
          selector: 'xpath of webelement of undefined',
          maxDownOffset: 2,
          maxLeftOffset: 3,
          maxRightOffset: 4,
          maxUpOffset: 1,
        },
      ])

      region = new FloatingRegionBySelector(By.linkText('some 1'), 1, 2, 3, 4)
      persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'xpath',
          selector: 'xpath of webelement of some 1',
          maxDownOffset: 2,
          maxLeftOffset: 3,
          maxRightOffset: 4,
          maxUpOffset: 1,
        },
      ])

      region = new FloatingRegionBySelector(By.partialLinkText('some 2'), 1, 2, 3, 4)
      persistedRegion = await region.toPersistedRegions(driver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'xpath',
          selector: 'xpath of webelement of some 2',
          maxDownOffset: 2,
          maxLeftOffset: 3,
          maxRightOffset: 4,
          maxUpOffset: 1,
        },
      ])
    })

    it('works with multiple elements', async function() {
      const origFindElements = driver.findElements
      driver.findElements = async locator => [
        `webelement1 of ${locator.value}`,
        `webelement2 of ${locator.value}`,
      ]

      let region = new FloatingRegionBySelector(By.js('some'), 1, 2, 3, 4)
      let persistedRegion = await region.toPersistedRegions(driver)
      driver.findElements = origFindElements

      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'xpath',
          selector: 'xpath of webelement1 of undefined',
          maxUpOffset: 1,
          maxDownOffset: 2,
          maxLeftOffset: 3,
          maxRightOffset: 4,
        },
        {
          type: 'xpath',
          selector: 'xpath of webelement2 of undefined',
          maxUpOffset: 1,
          maxDownOffset: 2,
          maxLeftOffset: 3,
          maxRightOffset: 4,
        },
      ])
    })
  })
})
