'use strict'

const assert = require('assert')
const {Logger} = require('@applitools/eyes-common')
const {
  TargetRegionByElement,
  TargetRegionBySelector,
  IgnoreRegionByRectangle,
  IgnoreRegionByElement,
  IgnoreRegionBySelector,
  FloatingRegionByRectangle,
  FloatingRegionByElement,
  FloatingRegionBySelector,
  AccessibilityRegionByRectangle,
  AccessibilityRegionByElement,
  AccessibilityRegionBySelector,
  AccessibilityRegionType,
  Region,
} = require('../../index')

const EyesJsSnippet = require('../../lib/EyesJsSnippets')
const FakeWrappedDriver = require('../utils/wrappers/FakeWrappedDriver')
const FakeWrappedElement = require('../utils/wrappers/FakeWrappedElement')

describe('toPersistedRegions()', () => {
  let driver, element

  before(() => {
    const logger = new Logger(false)
    element = new FakeWrappedElement(logger, driver, Symbol('unwrapped element'), {
      using: 'css selector',
      value: '.element',
    })
    element.addMockProperty('xpath', '/calculated[1]/xpath[1]/some[1]')
    driver = new FakeWrappedDriver(logger)
    driver.executor.addMockScript(EyesJsSnippet.GET_ELEMENT_XPATH, element =>
      element.getMockValue('xpath'),
    )
    driver.finder.addMockElement({using: 'custom', value: 'some'}, element)
  })

  it('IgnoreRegionByRectangle', async () => {
    const region = new IgnoreRegionByRectangle(
      new Region({left: 15, top: 16, width: 17, height: 18}),
    )
    const [{left, top, width, height}] = await region.toPersistedRegions(driver)
    assert.deepStrictEqual({left, top, width, height}, {left: 15, top: 16, width: 17, height: 18})
  })

  it('AccessibilityRegionByRectangle', async () => {
    const region = new AccessibilityRegionByRectangle(
      new Region({left: 15, top: 16, width: 17, height: 18}),
      AccessibilityRegionType.RegularText,
    )
    const [{left, top, width, height, accessibilityType}] = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(
      {left, top, width, height, accessibilityType},
      {
        left: 15,
        top: 16,
        width: 17,
        height: 18,
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    )
  })

  it('FloatingRegionByRectangle', async () => {
    const region = new FloatingRegionByRectangle(
      new Region({left: 15, top: 16, width: 17, height: 18}),
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
        top: 16,
        width: 17,
        height: 18,
        maxUpOffset: 1,
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
      },
    )
  })

  it('TargetRegionByElement', async () => {
    const region = new TargetRegionByElement(element)
    const persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: element.getMockValue('xpath'),
      },
    ])
  })

  it('IgnoreRegionByElement', async () => {
    const region = new IgnoreRegionByElement(element)
    const persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: element.getMockValue('xpath'),
      },
    ])
  })

  it('FloatingRegionByElement', async () => {
    const region = new FloatingRegionByElement(element, 1, 2, 3, 4)
    const persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: element.getMockValue('xpath'),
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
        maxUpOffset: 1,
      },
    ])
  })

  it('AccessibilityRegionByElement', async () => {
    const region = new AccessibilityRegionByElement(element, AccessibilityRegionType.RegularText)
    const persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: element.getMockValue('xpath'),
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])
  })

  it('TargetRegionBySelector', async () => {
    let region = new TargetRegionBySelector({using: 'css selector', value: '.some'})
    let persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '.some'}])

    region = new TargetRegionBySelector({using: 'xpath', value: '//some'})
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'xpath', selector: '//some'}])

    region = new TargetRegionBySelector({using: 'custom', value: 'some'})
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {type: 'xpath', selector: element.getMockValue('xpath')},
    ])
  })

  it('IgnoreRegionBySelector', async () => {
    let region = new IgnoreRegionBySelector({using: 'css selector', value: '.some'})
    let persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '.some'}])

    region = new IgnoreRegionBySelector({using: 'xpath', value: '//some'})
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'xpath', selector: '//some'}])

    region = new IgnoreRegionBySelector({using: 'custom', value: 'some'})
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {type: 'xpath', selector: element.getMockValue('xpath')},
    ])
  })

  it('FloatingRegionBySelector', async () => {
    let region = new FloatingRegionBySelector({using: 'css selector', value: '.some'}, 1, 2, 3, 4)
    let persistedRegion = await region.toPersistedRegions(driver)
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

    region = new FloatingRegionBySelector({using: 'xpath', value: '//some'}, 1, 2, 3, 4)
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

    region = new FloatingRegionBySelector({using: 'custom', value: 'some'}, 1, 2, 3, 4)
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: element.getMockValue('xpath'),
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
        maxUpOffset: 1,
      },
    ])
  })

  it('AccessibilityRegionBySelector', async () => {
    let region = new AccessibilityRegionBySelector(
      {using: 'css selector', value: '.some'},
      AccessibilityRegionType.RegularText,
    )
    let persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'css',
        selector: '.some',
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])

    region = new AccessibilityRegionBySelector(
      {using: 'xpath', value: '//some'},
      AccessibilityRegionType.RegularText,
    )
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: '//some',
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])

    region = new AccessibilityRegionBySelector(
      {using: 'custom', value: 'some'},
      AccessibilityRegionType.RegularText,
    )
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: element.getMockValue('xpath'),
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])
  })
})
