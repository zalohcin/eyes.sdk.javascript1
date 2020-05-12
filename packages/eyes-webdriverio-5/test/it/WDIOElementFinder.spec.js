'use strict'
const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const assert = require('assert')
const WDIOWrappedDriver = require('../../src/WDIOWrappedDriver')
const WDIOWrappedElement = require('../../src/WDIOWrappedElement')
const WDIOElementFinder = require('../../src/WDIOElementFinder')
const {Logger, By} = require('../../index')

describe('WDIOElementFinder', function() {
  let logger, browser, driver, finder

  function elementId(element) {
    return element.ELEMENT || element['element-6066-11e4-a52e-4f735466cecf'] || element.elementId
  }

  before(async () => {
    logger = new Logger(false)
    await chromedriver.start([], true)
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
    finder = new WDIOElementFinder(logger, driver)
  })

  after(async () => {
    await browser.deleteSession()
    chromedriver.stop()
  })

  it('findElement(string)', async () => {
    const expectedElement = await browser.$('img.ignore')
    const foundElement = await finder.findElement('img.ignore')
    assert.ok(foundElement instanceof WDIOWrappedElement)
    assert.deepStrictEqual(foundElement.elementId, elementId(expectedElement))
  })

  it('findElement(by)', async () => {
    const expectedElement = await browser.$('img.ignore')
    const foundElement = await finder.findElement(By.css('img.ignore'))
    assert.ok(foundElement instanceof WDIOWrappedElement)
    assert.deepStrictEqual(foundElement.elementId, elementId(expectedElement))
  })

  it('findElement(wrong selector)', async () => {
    const foundElement = await finder.findElement('#bla')
    assert.strictEqual(foundElement, null)
  })

  it('findElement(string, parentElement)', async () => {
    const parentElement = await browser.$('#overflowing-div-image')
    const expectedElement = await browser.$('#overflowing-div-image > img.ignore')
    const foundElement = await finder.findElement('img.ignore', parentElement)
    assert.ok(foundElement instanceof WDIOWrappedElement)
    assert.deepStrictEqual(foundElement.elementId, elementId(expectedElement))
  })

  it('findElement(by, parentElement)', async () => {
    const parentElement = await browser.$('#overflowing-div-image')
    const expectedElement = await browser.$('#overflowing-div-image > img.ignore')
    const foundElement = await finder.findElement(By.css('img.ignore'), parentElement)
    assert.ok(foundElement instanceof WDIOWrappedElement)
    assert.deepStrictEqual(foundElement.elementId, elementId(expectedElement))
  })

  it('findElements(string)', async () => {
    const expectedElements = await browser.$$('iframe')
    const foundElements = await finder.findElements('iframe')
    assert.strictEqual(foundElements.length, expectedElements.length)
    foundElements.forEach(foundElement => {
      assert.ok(foundElement instanceof WDIOWrappedElement)
    })
    foundElements.forEach((foundElement, index) => {
      assert.deepStrictEqual(foundElement.elementId, elementId(expectedElements[index]))
    })
  })

  it('findElements(by)', async () => {
    const expectedElements = await browser.$$('iframe')
    const foundElements = await finder.findElements(By.tagName('iframe'))
    assert.strictEqual(foundElements.length, expectedElements.length)
    foundElements.forEach(foundElement => {
      assert.ok(foundElement instanceof WDIOWrappedElement)
    })
    foundElements.forEach((foundElement, index) => {
      assert.deepStrictEqual(foundElement.elementId, elementId(expectedElements[index]))
    })
  })

  it('findElements(wrong selector)', async () => {
    const foundElements = await finder.findElements('#bla')
    assert.ok(Array.isArray(foundElements))
    assert.strictEqual(foundElements.length, 0)
  })

  it('findElements(string, parentElement)', async () => {
    const parentElement = await browser.$('#modal-content')
    const expectedElements = await browser.$$('#modal-content > p')
    const foundElements = await finder.findElements('p', parentElement)
    assert.strictEqual(foundElements.length, expectedElements.length)
    foundElements.forEach(foundElement => {
      assert.ok(foundElement instanceof WDIOWrappedElement)
    })
    foundElements.forEach((foundElement, index) => {
      assert.deepStrictEqual(foundElement.elementId, elementId(expectedElements[index]))
    })
  })

  it('findElements(by, parentElement)', async () => {
    const parentElement = await browser.$('#modal-content')
    const expectedElements = await browser.$$('#modal-content > p')
    const foundElements = await finder.findElements(By.tagName('p'), parentElement)
    assert.strictEqual(foundElements.length, expectedElements.length)
    foundElements.forEach(foundElement => {
      assert.ok(foundElement instanceof WDIOWrappedElement)
    })
    foundElements.forEach((foundElement, index) => {
      assert.deepStrictEqual(foundElement.elementId, elementId(expectedElements[index]))
    })
  })
})
