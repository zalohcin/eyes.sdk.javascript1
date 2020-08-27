'use strict'

const assert = require('assert')
const {Region, Logger, FluentRegion} = require('../../../index')
const MockDriver = require('../../utils/MockDriver')
const {Driver} = require('../../utils/FakeSDK')

describe('FluentRegion', () => {
  let driver, element

  before(async () => {
    const mock = new MockDriver()
    mock.mockElement('custom selector', {
      dataEyesId: 'some guid 1',
    })
    mock.mockElement('custom selector', {
      dataEyesId: 'some guid 2',
    })
    driver = new Driver(new Logger(false), mock)
    element = await driver.element('custom selector')
  })

  it('region', async () => {
    const region = new Region({left: 15, top: 16, width: 17, height: 18})
    const fluentRegion = new FluentRegion({region})
    const elements = await fluentRegion.resolveElements()
    assert.deepStrictEqual(elements, [])
    const persistedRegions = fluentRegion.toPersistedRegions()
    assert.deepStrictEqual(persistedRegions, [region.toJSON()])
  })

  it('element', async () => {
    const fluentRegion = new FluentRegion({element})
    const elements = await fluentRegion.resolveElements(driver)
    assert.deepStrictEqual(elements, [element])
    const elementIds = new WeakMap()
    elementIds.set(element, element.unwrapped.dataEyesId)
    const persistedRegions = fluentRegion.toPersistedRegions(elementIds)
    assert.deepStrictEqual(persistedRegions, [
      {type: 'css', selector: `[data-eyes-selector="some guid 1"]`},
    ])
  })

  it('selector', async () => {
    const fluentRegion = new FluentRegion({selector: 'custom selector'})
    const elements = await fluentRegion.resolveElements(driver)
    assert.deepStrictEqual(elements, await driver.elements('custom selector'))
    const elementIds = new WeakMap()
    for (const el of elements) {
      elementIds.set(el, el.unwrapped.dataEyesId)
    }
    const persistedRegions = fluentRegion.toPersistedRegions(elementIds)
    assert.deepStrictEqual(persistedRegions, [
      {type: 'css', selector: `[data-eyes-selector="some guid 1"]`},
      {type: 'css', selector: `[data-eyes-selector="some guid 2"]`},
    ])
  })

  it('options', async () => {
    const region = new Region({left: 15, top: 16, width: 17, height: 18})
    const fluentRegionRegion = new FluentRegion({region, options: {key: 'a'}})
    await fluentRegionRegion.resolveElements()
    const persistedRegionsRegion = await fluentRegionRegion.toPersistedRegions()
    assert.deepStrictEqual(persistedRegionsRegion, [{...region.toJSON(), key: 'a'}])

    const fluentRegionElement = new FluentRegion({element, options: {key: 'b'}})
    const elements = await fluentRegionElement.resolveElements(driver)
    assert.deepStrictEqual(elements, [element])
    const elementIds = new WeakMap()
    elementIds.set(element, element.unwrapped.dataEyesId)
    const persistedRegionsElement = fluentRegionElement.toPersistedRegions(elementIds)
    assert.deepStrictEqual(persistedRegionsElement, [
      {type: 'css', selector: `[data-eyes-selector="some guid 1"]`, key: 'b'},
    ])

    const fluentRegionSelector = new FluentRegion({
      selector: 'custom selector',
      options: {key: 'c'},
    })
    const elementsSelector = await fluentRegionSelector.resolveElements(driver)
    const elementIdsSelector = new WeakMap()
    for (const el of elementsSelector) {
      elementIdsSelector.set(el, el.unwrapped.dataEyesId)
    }
    const persistedRegionsSelector = fluentRegionSelector.toPersistedRegions(elementIdsSelector)
    assert.deepStrictEqual(persistedRegionsSelector, [
      {type: 'css', selector: `[data-eyes-selector="some guid 1"]`, key: 'c'},
      {type: 'css', selector: `[data-eyes-selector="some guid 2"]`, key: 'c'},
    ])
  })
})
