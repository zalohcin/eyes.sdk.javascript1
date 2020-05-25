'use strict'

const {makeChromeDriver} = require('@applitools/sdk-shared')
const {remote} = require('webdriverio')
const assert = require('assert')
const {AccessibilityRegionType} = require('@applitools/eyes-sdk-core')
const {By, WebElement} = require('../../index')
const IgnoreRegionBySelector = require('../../src/fluent/IgnoreRegionBySelector')
const IgnoreRegionByElement = require('../../src/fluent/IgnoreRegionByElement')
const FloatingRegionBySelector = require('../../src/fluent/FloatingRegionBySelector')
const FloatingRegionByElement = require('../../src/fluent/FloatingRegionByElement')
const AccessibilityRegionByElement = require('../../src/fluent/AccessibilityRegionByElement')
const AccessibilityRegionBySelector = require('../../src/fluent/AccessibilityRegionBySelector')
const {SelectorByElement} = require('../../src/fluent/SelectorByElement')
const {SelectorByLocator} = require('../../src/fluent/SelectorByLocator')
const EyesWebDriver = require('../../src/wrappers/EyesWebDriver')
const WebDriver = require('../../src/wrappers/WebDriver')

describe('toPersistedRegions()', function() {
  let eyesWebDriver, driver
  const chromedriver = makeChromeDriver()
  before(async () => {
    await chromedriver.start(undefined, true)
    const browser = await remote({
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--disable-infobars', 'headless'],
        },
      },
      path: '/',
      port: 9515,
      logLevel: 'error',
    })
    const url = 'https://applitools.com/helloworld'
    await browser.url(url)

    const logger = {verbose: console.log}
    eyesWebDriver = new EyesWebDriver(logger, new WebDriver(browser), {_logger: logger})
    driver = browser
  })

  after(async () => {
    driver && (await driver.deleteSession())
    await chromedriver.stop()
  })

  async function getWebElement(selector) {
    const webElement = await driver.$(selector)
    return new WebElement(driver, webElement, '')
  }

  it('SelectorByElement', async function() {
    const we = await getWebElement('button')
    const region = new SelectorByElement(we)
    const persistedRegion = await region.toPersistedRegions(eyesWebDriver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'HTML[1]/BODY[1]/DIV[1]/DIV[3]/BUTTON[1]',
      },
    ])
  })

  describe('SelectorByLocator', function() {
    it('works', async function() {
      let region = new SelectorByLocator(By.css('some'))
      let persistedRegion = await region.toPersistedRegions(eyesWebDriver)
      assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: 'some'}])

      region = new SelectorByLocator(By.id('some'))
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
      assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '*[id="some"]'}])

      region = new SelectorByLocator(By.className('some'))
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
      assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '.some'}])

      region = new SelectorByLocator(By.name('some'))
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
      assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '*[name="some"]'}])

      region = new SelectorByLocator(By.xpath('//some'))
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
      assert.deepStrictEqual(persistedRegion, [{type: 'xpath', selector: '//some'}])
    })
  })

  it('IgnoreRegionByElement', async function() {
    const we = await getWebElement('button')
    const region = new IgnoreRegionByElement(we)
    const persistedRegion = await region.toPersistedRegions(eyesWebDriver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'HTML[1]/BODY[1]/DIV[1]/DIV[3]/BUTTON[1]',
      },
    ])
  })

  it('FloatingRegionByElement', async function() {
    const we = await getWebElement('button')
    const region = new FloatingRegionByElement(we, 1, 2, 3, 4)
    const persistedRegion = await region.toPersistedRegions(eyesWebDriver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'HTML[1]/BODY[1]/DIV[1]/DIV[3]/BUTTON[1]',
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
        maxUpOffset: 1,
      },
    ])
  })

  it('FloatingRegionByElement', async function() {
    const we = await getWebElement('button')
    const region = new AccessibilityRegionByElement(we, AccessibilityRegionType.RegularText)
    const persistedRegion = await region.toPersistedRegions(eyesWebDriver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'HTML[1]/BODY[1]/DIV[1]/DIV[3]/BUTTON[1]',
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])
  })

  describe('IgnoreRegionBySelector', function() {
    it('works', async function() {
      let region = new IgnoreRegionBySelector(By.css('some'))
      let persistedRegion = await region.toPersistedRegions(eyesWebDriver)
      assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: 'some'}])

      region = new IgnoreRegionBySelector(By.id('some'))
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
      assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '*[id="some"]'}])

      region = new IgnoreRegionBySelector(By.className('some'))
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
      assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '.some'}])

      region = new IgnoreRegionBySelector(By.name('some'))
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
      assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '*[name="some"]'}])

      region = new IgnoreRegionBySelector(By.xpath('//some'))
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
      assert.deepStrictEqual(persistedRegion, [{type: 'xpath', selector: '//some'}])
    })
  })

  describe('FloatingRegionBySelector', function() {
    it('works', async function() {
      let region = new FloatingRegionBySelector(By.css('some'), 1, 2, 3, 4)
      let persistedRegion = await region.toPersistedRegions(eyesWebDriver)
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
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
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
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
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
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
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
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
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
  })

  describe('AccessibilityRegionBySelector', function() {
    it('works', async function() {
      let region = new AccessibilityRegionBySelector(
        By.css('some'),
        AccessibilityRegionType.RegularText,
      )
      let persistedRegion = await region.toPersistedRegions(eyesWebDriver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'css',
          selector: 'some',
          accessibilityType: AccessibilityRegionType.RegularText,
        },
      ])

      region = new AccessibilityRegionBySelector(By.id('some'), AccessibilityRegionType.RegularText)
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'css',
          selector: '*[id="some"]',
          accessibilityType: AccessibilityRegionType.RegularText,
        },
      ])

      region = new AccessibilityRegionBySelector(
        By.className('some'),
        AccessibilityRegionType.RegularText,
      )
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'css',
          selector: '.some',
          accessibilityType: AccessibilityRegionType.RegularText,
        },
      ])

      region = new AccessibilityRegionBySelector(
        By.name('some'),
        AccessibilityRegionType.RegularText,
      )
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'css',
          selector: '*[name="some"]',
          accessibilityType: AccessibilityRegionType.RegularText,
        },
      ])

      region = new AccessibilityRegionBySelector(
        By.xpath('//some'),
        AccessibilityRegionType.RegularText,
      )
      persistedRegion = await region.toPersistedRegions(eyesWebDriver)
      assert.deepStrictEqual(persistedRegion, [
        {
          type: 'xpath',
          selector: '//some',
          accessibilityType: AccessibilityRegionType.RegularText,
        },
      ])
    })
  })
})
