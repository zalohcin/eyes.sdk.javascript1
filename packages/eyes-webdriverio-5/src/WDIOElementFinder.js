const {EyesElementFinder} = require('@applitools/eyes-sdk-core')
const WDIOWrappedElement = require('./WDIOWrappedElement')

class WDIOElementFinder extends EyesElementFinder {
  constructor(logger, driver) {
    super()
    this._logger = logger
    this._driver = driver
  }

  async findElement(selector, parentElement) {
    let element
    if (parentElement) {
      const extendedParentElement = await this._driver.unwrapped.$(
        parentElement instanceof WDIOWrappedElement ? parentElement.unwrapped : parentElement,
      )
      element = await extendedParentElement.$(selector.toString())
    } else {
      element = await this._driver.unwrapped.$(selector.toString())
    }
    return !element.error
      ? new WDIOWrappedElement(this._logger, this._driver, element, selector)
      : null
  }

  async findElements(selector, parentElement) {
    let elements
    if (parentElement) {
      const extendedParentElement = await this._driver.unwrapped.$(
        parentElement instanceof WDIOWrappedElement ? parentElement.unwrapped : parentElement,
      )
      elements = await extendedParentElement.$$(selector.toString())
    } else {
      elements = await this._driver.unwrapped.$$(selector.toString())
    }
    return elements.map(
      element => new WDIOWrappedElement(this._logger, this._driver, element, selector),
    )
  }
}

module.exports = WDIOElementFinder
