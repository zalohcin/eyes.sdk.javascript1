'use strict'
const assert = require('assert')
const WDIOElement = require('../../src/wrappers/WDIOElement')
const WDIODriver = require('../../src/wrappers/WDIODriver')
const {Logger} = require('../../index')

describe('LegacyAPIElement', function() {
  let logger,
    driver,
    element = {ELEMENT: 'element'},
    selector = 'selector'

  function elementId(element) {
    return element.ELEMENT || element['element-6066-11e4-a52e-4f735466cecf']
  }

  before(async () => {
    logger = new Logger(false)
    driver = new WDIODriver(logger, {})
  })

  it('get element', async () => {
    const wrappedElement = new WDIOElement(logger, driver, element)
    assert.deepStrictEqual(wrappedElement.element, wrappedElement.unwrapped)
    assert.strictEqual(elementId(wrappedElement.element), elementId(element))
  })

  it('get locator', async () => {
    const wrappedElement = new WDIOElement(logger, driver, element, selector)
    assert.strictEqual(wrappedElement.locator, wrappedElement.selector)
    assert.strictEqual(wrappedElement.locator, selector)
  })
})
