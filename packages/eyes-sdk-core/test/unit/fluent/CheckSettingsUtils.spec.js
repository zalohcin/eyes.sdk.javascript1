'use strict'

const assert = require('assert')
const {Driver, CheckSettings} = require('../../utils/FakeSDK')
const MockDriver = require('../../utils/MockDriver')
const {Logger, Configuration} = require('../../../index')
const {
  toCheckWindowConfiguration,
  getAllRegionElements,
} = require('../../../lib/fluent/CheckSettingsUtils')

describe('CheckSettingsUtils', () => {
  it('toCheckWindowConfiguration', async () => {
    const mockDriver = new MockDriver()
    mockDriver.mockElements([
      {selector: 'element0', rect: {x: 1, y: 2, width: 500, height: 501}},
      {selector: 'element1', rect: {x: 10, y: 11, width: 101, height: 102}},
      {selector: 'element1', rect: {x: 12, y: 13, width: 103, height: 104}},
      {selector: 'element2', rect: {x: 20, y: 21, width: 201, height: 202}},
      {selector: 'element3', rect: {x: 30, y: 31, width: 301, height: 302}},
      {selector: 'element4', rect: {x: 40, y: 41, width: 401, height: 402}},
      {selector: 'element4', rect: {x: 42, y: 43, width: 403, height: 404}},
    ])
    const driver = new Driver(new Logger(process.env.APPLITOOLS_SHOW_LOGS), mockDriver)
    const checkSettings = new CheckSettings()

    checkSettings.ignoreRegion(await driver.element('element0'))
    checkSettings.ignoreRegion('element1')
    checkSettings.ignoreRegion({left: 1, top: 2, width: 3, height: 5})

    checkSettings.floatingRegion(await driver.element('element2'), 1, 2, 3, 4)
    checkSettings.floatingRegion('element3', 5, 6, 7, 8)
    checkSettings.floatingRegion({left: 1, top: 2, width: 3, height: 5}, 9, 10, 11, 12)

    checkSettings.accessibility('element4', 'bla')

    checkSettings.visualGridOption('polyfillAdoptedStyleSheets', true)

    const elements = await getAllRegionElements({checkSettings, context: driver})

    const elementIdsMap = new WeakMap()
    for (const [index, el] of elements.entries()) {
      elementIdsMap.set(el, `guid ${index}`)
    }

    const configuration = new Configuration()

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings,
      configuration,
      elementIdsMap,
    })

    // console.log(checkWindowConfiguration.floating)

    assert.deepStrictEqual(checkWindowConfiguration.ignore, [
      {selector: '[data-eyes-selector="guid 0"]', type: 'css'},
      {selector: '[data-eyes-selector="guid 1"]', type: 'css'},
      {selector: '[data-eyes-selector="guid 2"]', type: 'css'},
      {left: 1, top: 2, width: 3, height: 5, coordinatesType: 'SCREENSHOT_AS_IS'},
    ])
    assert.deepStrictEqual(checkWindowConfiguration.floating, [
      {
        selector: '[data-eyes-selector="guid 3"]',
        type: 'css',
        maxUpOffset: 1,
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
      },
      {
        selector: '[data-eyes-selector="guid 4"]',
        type: 'css',
        maxUpOffset: 5,
        maxDownOffset: 6,
        maxLeftOffset: 7,
        maxRightOffset: 8,
      },
      {
        left: 1,
        top: 2,
        width: 3,
        height: 5,
        coordinatesType: 'SCREENSHOT_AS_IS',
        maxUpOffset: 9,
        maxDownOffset: 10,
        maxLeftOffset: 11,
        maxRightOffset: 12,
      },
    ])
    assert.deepStrictEqual(checkWindowConfiguration.accessibility, [
      {accessibilityType: 'bla', selector: '[data-eyes-selector="guid 5"]', type: 'css'},
      {accessibilityType: 'bla', selector: '[data-eyes-selector="guid 6"]', type: 'css'},
    ])
    assert.deepStrictEqual(checkWindowConfiguration.visualGridOptions, {
      polyfillAdoptedStyleSheets: true,
    })
  })
})
