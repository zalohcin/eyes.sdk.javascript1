'use strict'
const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const assert = require('assert')
const {Location, RectangleSize, Region} = require('@applitools/eyes-sdk-core')
const WDIOWrappedDriver = require('../../src/core/WDIOWrappedDriver')
const WDIOWrappedElement = require('../../src/core/WDIOWrappedElement')
const {Logger} = require('../../index')

describe('WDIOWrappedElement', function() {
  let logger, browser, driver

  before(async () => {
    await chromedriver.start([], true)
    logger = new Logger(false)
    browser = await remote({
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['disable-infobars', 'headless'],
        },
      },
      logLevel: 'error',
      port: 9515,
      path: '/',
    })
    await browser.url('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  })

  beforeEach(async () => {
    driver = new WDIOWrappedDriver(logger, browser)
  })

  after(async () => {
    await browser.deleteSession()
    chromedriver.stop()
  })

  it('static isCompatible(element)', async () => {
    const element = await browser.findElement('css selector', '#overflowing-div')
    assert.ok(WDIOWrappedElement.isCompatible(element))
  })

  it('static isCompatible(extendedElement)', async () => {
    const extendedElement = await browser.$('#overflowing-div')
    assert.ok(WDIOWrappedElement.isCompatible(extendedElement))
  })

  it('static elementId(element)', async () => {
    const element = await browser.findElement('css selector', '#overflowing-div')
    const elementId = element.ELEMENT || element['element-6066-11e4-a52e-4f735466cecf']
    assert.strictEqual(WDIOWrappedElement.elementId(element), elementId)
  })

  it('static elementId(extendedElement)', async () => {
    const element = await browser.$('#overflowing-div')
    const elementId = element.elementId
    assert.strictEqual(WDIOWrappedElement.elementId(element), elementId)
  })

  it('static elementId(elementWrapper)', async () => {
    const element = await browser.findElement('css selector', '#overflowing-div')
    const elementId = element.ELEMENT || element['element-6066-11e4-a52e-4f735466cecf']
    const elementWrapper = new WDIOWrappedElement(logger, driver, element)
    assert.strictEqual(WDIOWrappedElement.elementId(elementWrapper), elementId)
  })

  it('constructor(element)', async () => {
    const element = await browser.findElement('css selector', '#overflowing-div')
    const constructed = new WDIOWrappedElement(logger, driver, element)
    assert.strictEqual(constructed.elementId, WDIOWrappedElement.elementId(element))
  })

  it('constructor(extendedElement)', async () => {
    const selector = '#overflowing-div'
    const extendedElement = await browser.$(selector)
    const constructed = new WDIOWrappedElement(logger, driver, extendedElement)
    assert.strictEqual(constructed.elementId, WDIOWrappedElement.elementId(extendedElement))
    assert.strictEqual(constructed.selector, selector)
  })

  it('constructor(elementWrapper)', async () => {
    const elementWrapper = await driver.finder.findElement('#overflowing-div')
    const constructed = new WDIOWrappedElement(logger, driver, elementWrapper)
    assert.strictEqual(constructed, elementWrapper)
  })

  it('getLocation()', async () => {
    const elementWrapper = await driver.finder.findElement('img.ignore')
    const location = await elementWrapper.getLocation()
    const {left, top} = await driver.executor.executeScript(
      el => el.getBoundingClientRect(),
      elementWrapper,
    )
    assert.ok(location instanceof Location)
    assert.strictEqual(location.getX(), Math.ceil(left))
    assert.strictEqual(location.getY(), Math.ceil(top))
  })

  it('getSize()', async () => {
    const elementWrapper = await driver.finder.findElement('img.ignore')
    const size = await elementWrapper.getSize()
    const {width, height} = await driver.executor.executeScript(
      el => el.getBoundingClientRect(),
      elementWrapper,
    )
    assert.ok(size instanceof RectangleSize)
    assert.strictEqual(size.getWidth(), Math.ceil(width))
    assert.strictEqual(size.getHeight(), Math.ceil(height))
  })

  it('getRect()', async () => {
    const elementWrapper = await driver.finder.findElement('img.ignore')
    const rect = await elementWrapper.getRect()
    const {left, top, width, height} = await driver.executor.executeScript(
      el => el.getBoundingClientRect(),
      elementWrapper,
    )
    assert.ok(rect instanceof Region)
    assert.strictEqual(rect.getLeft(), Math.ceil(left))
    assert.strictEqual(rect.getTop(), Math.ceil(top))
    assert.strictEqual(rect.getWidth(), Math.ceil(width))
    assert.strictEqual(rect.getHeight(), Math.ceil(height))
  })

  it('getProperty(propertyName)', async () => {
    const id = 'overflowing-div'
    const elementWrapper = await driver.finder.findElement(`#${id}`)
    const propertyValue = await elementWrapper.getProperty('id')
    assert.strictEqual(propertyValue, id)
  })

  it('getProperty(...propertyNames)', async () => {
    const id = 'overflowing-div'
    const tagName = 'DIV'
    const elementWrapper = await driver.finder.findElement(`${tagName}#${id}`)
    const propertyValues = await elementWrapper.getProperty('tagName', 'id')
    assert.deepStrictEqual(propertyValues, [tagName, id])
  })

  it('getCssProperty(propertyName)', async () => {
    const propertyName = 'border-left-width'
    const elementWrapper = await driver.finder.findElement(`#overflowing-div`)
    const propertyValue = await elementWrapper.getCssProperty(propertyName)
    const expectedPropertyValue = await driver.executor.executeScript(
      (el, propertyName) => {
        //eslint-disable-next-line no-undef
        return window.getComputedStyle(el).getPropertyValue(propertyName)
      },
      elementWrapper,
      propertyName,
    )
    assert.strictEqual(propertyValue, expectedPropertyValue)
  })

  it('getCssProperty(...propertyNames)', async () => {
    const propertyNames = ['border-left-width', 'border-top-width']
    const elementWrapper = await driver.finder.findElement(`#overflowing-div`)
    const propertyValues = await elementWrapper.getCssProperty(...propertyNames)
    const expectedPropertyValues = await driver.executor.executeScript(
      (el, propertyNames) => {
        //eslint-disable-next-line no-undef
        const computedStyle = window.getComputedStyle(el)
        return propertyNames.map(propertyName => computedStyle.getPropertyValue(propertyName))
      },
      elementWrapper,
      propertyNames,
    )
    assert.deepStrictEqual(propertyValues, expectedPropertyValues)
  })
})
