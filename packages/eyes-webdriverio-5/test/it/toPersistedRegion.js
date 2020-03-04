'use strict'

const assert = require('assert')
const {By} = require('../../index')
const {IgnoreRegionByRectangle} = require('@applitools/eyes-sdk-core')
const IgnoreRegionBySelector = require('../../src/fluent/IgnoreRegionBySelector')
const IgnoreRegionByElement = require('../../src/fluent/IgnoreRegionByElement')
const makeToPersistedRegions = require('../../src/fluent/toPersistedRegions')

describe('toPersistedRegions', function() {
  let toPersistedRegions, driver
  before(() => {
    driver = {
      executeScript: async (_script, element) => `xpath of ${element}`,
      findElements: async locator => [`webelement of ${locator.value}`],
    }
    toPersistedRegions = makeToPersistedRegions({driver})
  })

  it('works with regions ', async function() {
    const region = new IgnoreRegionByRectangle({left: 15, top: 15, width: 15, height: 15})
    const persistedRegion = await toPersistedRegions(region)
    assert.deepStrictEqual(persistedRegion, [{left: 15, top: 15, width: 15, height: 15}])
  })

  it('works with selector locators', async function() {
    let region = new IgnoreRegionBySelector(By.css('some'))
    let persistedRegion = await toPersistedRegions(region)
    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: 'some'}])

    region = new IgnoreRegionBySelector(By.id('some'))
    persistedRegion = await toPersistedRegions(region)
    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '*[id="some"]'}])

    region = new IgnoreRegionBySelector(By.className('some'))
    persistedRegion = await toPersistedRegions(region)
    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '.some'}])

    region = new IgnoreRegionBySelector(By.name('some'))
    persistedRegion = await toPersistedRegions(region)
    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '*[name="some"]'}])

    region = new IgnoreRegionBySelector(By.xpath('//some'))
    persistedRegion = await toPersistedRegions(region)
    assert.deepStrictEqual(persistedRegion, [{type: 'xpath', selector: '//some'}])
  })

  it('works with multiple elements selector locators', async function() {
    const origFindElements = driver.findElements
    driver.findElements = async locator => [
      `webelement1 of ${locator.value}`,
      `webelement2 of ${locator.value}`,
    ]

    let region = new IgnoreRegionBySelector(By.css('some'))
    let persistedRegion = await toPersistedRegions(region)
    driver.findElements = origFindElements

    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: 'some'}])
  })

  it('works with non selector locators', async function() {
    let region = new IgnoreRegionBySelector(By.js('some'))
    let persistedRegion = await toPersistedRegions(region)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'xpath of webelement of undefined',
      },
    ])

    region = new IgnoreRegionBySelector(By.linkText('some 1'))
    persistedRegion = await toPersistedRegions(region)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'xpath of webelement of some 1',
      },
    ])

    region = new IgnoreRegionBySelector(By.partialLinkText('some 2'))
    persistedRegion = await toPersistedRegions(region)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'xpath of webelement of some 2',
      },
    ])
  })

  it('works with elements ', async function() {
    const region = new IgnoreRegionByElement('my-web-element')
    const persistedRegion = await toPersistedRegions(region)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'xpath of my-web-element',
      },
    ])
  })
})
