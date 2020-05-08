const {TypeUtils, EyesElementFinder} = require('@applitools/eyes-sdk-core')
const WDIOWrappedElement = require('./WDIOWrappedElement')
const LegacySelector = require('./LegacySelector')

class WDIOElementFinder extends EyesElementFinder {
  constructor(logger, driver) {
    super()
    this._logger = logger
    this._driver = driver
  }

  static prepareSelector(selector) {
    if (TypeUtils.has(selector, ['using', 'value']) || selector instanceof LegacySelector) {
      return `${selector.using}:${selector.value}`
    } else {
      return selector
    }
  }

  async findElement(selector, parentElement) {
    const preparedSelector = WDIOElementFinder.prepareSelector(selector)
    let element
    if (parentElement) {
      const extendedParentElement = await this._driver.unwrapped.$(
        parentElement instanceof WDIOWrappedElement ? parentElement.unwrapped : parentElement,
      )
      element = await extendedParentElement.$(preparedSelector)
    } else {
      element = await this._driver.unwrapped.$(preparedSelector)
    }
    return !element.error
      ? new WDIOWrappedElement(this._logger, this._driver, element, preparedSelector)
      : null
  }

  async findElements(selector, parentElement) {
    const preparedSelector = WDIOElementFinder.prepareSelector(selector)
    let elements
    if (parentElement) {
      const extendedParentElement = await this._driver.unwrapped.$(
        parentElement instanceof WDIOWrappedElement ? parentElement.unwrapped : parentElement,
      )
      elements = await extendedParentElement.$$(preparedSelector)
    } else {
      elements = await this._driver.unwrapped.$$(preparedSelector)
    }
    return elements.map(
      element => new WDIOWrappedElement(this._logger, this._driver, element, preparedSelector),
    )
  }
}

module.exports = WDIOElementFinder
