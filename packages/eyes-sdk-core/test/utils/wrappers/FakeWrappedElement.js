const {Location, RectangleSize, Region} = require('@applitools/eyes-common')
const {EyesWrappedElement} = require('../../../index')

class FakeWrappedElement extends EyesWrappedElement {
  constructor(logger, driver, element, selector) {
    super()
    this._logger = logger
    this._driver = driver
    this._element = element
    this._selector = selector
    this._mock = new Map()
  }

  addMockProperty(key, value) {
    this._mock.set(key, value)
  }

  getMockValue(key) {
    return this._mock.get(key)
  }

  static fromSelector(selector) {
    return new FakeWrappedElement(null, null, null, selector)
  }

  static fromSelector(element) {
    return new FakeWrappedElement(null, null, element)
  }

  async init(driver) {
    this._driver = driver
  }

  async getLocation() {
    return new Location(10, 10)
  }

  async getSize() {
    return new RectangleSize(100, 100)
  }

  async getRect() {
    return new Region(10, 10, 100, 100)
  }
}

module.exports = FakeWrappedElement
