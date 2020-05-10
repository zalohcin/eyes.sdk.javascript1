const {EyesElementFinder} = require('@applitools/eyes-sdk-core')
const WDIOWrappedElement = require('./WDIOWrappedElement')

class WDIOElementFinder extends EyesElementFinder {
  constructor(logger, driver) {
    super()
    this._logger = logger
    this._driver = driver
  }

  async findElement(selector, parentElement) {
    const {value: element} = parentElement
      ? await this._driver.unwrapped.elementIdElement(
          WDIOWrappedElement.elementId(parentElement),
          selector.toString(),
        )
      : await this._driver.unwrapped.element(selector.toString())
    return element ? new WDIOWrappedElement(this._logger, this._driver, element, selector) : null
  }

  async findElements(selector, parentElement) {
    const {value: elements} = parentElement
      ? await this._driver.unwrapped.elementIdElements(
          WDIOWrappedElement.elementId(parentElement),
          selector.toString(),
        )
      : await this._driver.unwrapped.elements(selector.toString())
    return elements.map(
      element => new WDIOWrappedElement(this._logger, this._driver, element, selector),
    )
  }
}

module.exports = WDIOElementFinder
