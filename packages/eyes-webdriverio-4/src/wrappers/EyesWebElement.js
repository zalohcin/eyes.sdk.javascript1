'use strict'

const {
  Region,
  MouseTrigger,
  ArgumentGuard,
  TypeUtils,
  CoordinatesType,
  Location,
  RectangleSize,
  FrameChain,
} = require('@applitools/eyes-sdk-core')
const command = require('../services/selenium/Command')
const By = require('../By')

const WEB_ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf'

/**
 * Wraps a Webdriverio Web Element.
 */
class EyesWebElement {
  /**
   * @param {Object} element
   * @param {By|String} locator
   * @param {EyesWebDriver} driver
   * @param {Logger} logger
   *
   **/
  constructor(element, locator, driver, logger) {
    ArgumentGuard.notNull(element, 'element')
    ArgumentGuard.notNull(locator, 'locator')
    ArgumentGuard.notNull(driver, 'driver')
    ArgumentGuard.notNull(logger, 'logger')

    if (element instanceof EyesWebElement) {
      return element
    }

    if (element.value && element.selector) {
      this._element = element.value
      this._locator = element.selector
    } else {
      this._element = element
      this._locator = locator
    }
    /** @type {EyesWebDriver}*/
    this._driver = driver
    /** @type {Logger}*/
    this._logger = logger
    /** @type {FrameChain} */
    this._frameChain = new FrameChain(this._logger, this._driver.frameChain)
  }

  get elementId() {
    return this._element.ELEMENT || this._element[WEB_ELEMENT_ID]
  }

  get jsonElement() {
    return {
      [WEB_ELEMENT_ID]: this.elementId,
      ELEMENT: this.elementId,
    }
  }

  get driver() {
    return this._driver
  }

  get selector() {
    return this._locator.value || this._locator
  }

  async refresh() {
    const originalFrameChain = this._driver.frameChain.clone()
    const isSameFrameChain = FrameChain.isSameFrameChain(originalFrameChain, this._frameChain)
    if (!isSameFrameChain) {
      await this._driver.frames(this._frameChain)
    }
    const selector = this._locator.value || this._locator
    const {value: element} = await this._driver.remoteWebDriver.element(selector)
    if (element) {
      this._element = element
    }
    if (!isSameFrameChain) {
      await this._driver.frames(originalFrameChain)
    }
    return Boolean(element)
  }

  async getBounds() {
    const {value: rect} = await this._driver.elementIdRect(this.elementId)
    let left = Math.ceil(rect && rect.x ? rect.x : 0)
    let top = Math.ceil(rect && rect.y ? rect.y : 0)
    let width = Math.ceil(rect && rect.width ? rect.width : 0)
    let height = Math.ceil(rect && rect.height ? rect.height : 0)
    if (left < 0) {
      width = Math.max(0, width + left)
      left = 0
    }
    if (top < 0) {
      height = Math.max(0, height + top)
      top = 0
    }
    return new Region(left, top, width, height, CoordinatesType.CONTEXT_RELATIVE)
  }

  async getRect() {
    const {value: size} = await this._driver.elementIdRect(this.elementId)
    return size
  }

  async getSize() {
    const {value: size} = await this._driver.elementIdSize(this.elementId)
    const width = Math.ceil(size && size.width ? size.width : 0)
    const height = Math.ceil(size && size.height ? size.height : 0)
    return new RectangleSize(width, height)
  }

  async getLocation() {
    const r = await this._driver.elementIdLocation(this.elementId)
    const {value: location} = r
    const x = Math.ceil(location && location.x ? location.x : 0)
    const y = Math.ceil(location && location.y ? location.y : 0)
    return new Location(x, y)
  }

  async getCssProperty(cssPropertyName) {
    return await this.execute(`
      var elem = arguments[0], styleProp = '${cssPropertyName}';
      if (window.getComputedStyle) {
          return window.getComputedStyle(elem, null).getPropertyValue(styleProp);
      } else if (elem.currentStyle) {
          return elem.currentStyle[styleProp];
      } else {
          return null;
      }
    `)
  }

  async getCssProperties(cssPropertyNames) {
    return this.execute(`
      var elem = arguments[0];
      if (window.getComputedStyle) {
        const computedStyle = window.getComputedStyle(elem, null);
        return [${cssPropertyNames
          .map(cssPropertyName => `computedStyle.getPropertyValue('${cssPropertyName}')`)
          .join(',')}];
      } else if (elem.currentStyle) {
        return [${cssPropertyNames
          .map(cssPropertyName => `elem.currentStyle['${cssPropertyName}']`)
          .join(',')}];
      } else {
        return [];
      }
    `)
  }

  async getProperty(propertyName) {
    const property = await this.execute(`return arguments[0]['${propertyName}'];`)
    return property
  }

  async getProperties(propertyNames) {
    const properties = await this.execute(`return [
      ${propertyNames.map(propertyName => `arguments[0]['${propertyName}']`).join(',')}
    ];`)
    return properties
  }

  /**
   * Scrolls to the specified location inside the element.
   *
   * @param {Location} location The location to scroll to.
   * @return {Promise}
   */
  scrollTo(location) {
    return this.execute(`
      arguments[0].scrollLeft = ${location.getX()};
      arguments[0].scrollTop = ${location.getY()};
    `)
  }

  /**
   * @return {Promise.<String>} The overflow of the element.
   */
  async getOverflow() {
    const value = await this.execute(`return arguments[0].style.overflow;`)
    const overflow = Math.ceil(parseFloat(value))
    return overflow ? overflow : null
  }

  /**
   * @param {String} overflow The overflow to set
   * @return {Promise} The overflow of the element.
   */
  async setOverflow(overflow) {
    return this.execute(`arguments[0].style.overflow = '${overflow}'`)
  }

  async getValue() {
    return this.getProperty('value')
  }

  async setValue(keys) {
    return this._driver.elementIdValue(this.elementId, keys)
  }

  async click() {
    this._driver.eyes.addMouseTrigger(MouseTrigger.MouseAction.Click, this)
    return this._driver.elementIdClick(this.elementId)
  }

  /**
   * @param {String|Function} script The script to execute with the element as last parameter
   * @returns {Promise} The result returned from the script
   */
  async execute(script) {
    return this._driver.execute(script, this)
  }

  async element(locator) {
    const selector = locator.value || locator
    const result = await this._driver.elementIdElement(this.elementId, selector)
    const element = result.value
    if (element === null && result.type === 'NoSuchElement' && result.state === 'failure') {
      throw new Error(result.message)
    }
    return new EyesWebElement(element, locator, this._driver, this._logger)
  }

  async elements(locator) {
    const selector = locator.value || locator
    const result = await this._driver.elementIdElements(this.elementId, selector)
    const elements = result.value
    return elements.map(element => new EyesWebElement(element, locator, this._driver, this._logger))
  }

  static findElement(driver, locator, retry = 0) {
    return driver.element(locator).catch(err => {
      if (retry > 3) {
        throw err
      } else {
        return EyesWebElement.findElement(driver, locator, retry++)
      }
    })
  }

  static isWDIOElement(object) {
    if (!object) return false
    return object.value
      ? object.value.ELEMENT || object.value[WEB_ELEMENT_ID]
      : object.ELEMENT || object[WEB_ELEMENT_ID]
  }

  /**
   * @param {object} object
   * @return {boolean}
   */
  static isLocator(object) {
    return object instanceof By || TypeUtils.has(object, ['using', 'value'])
  }

  static equals(leftElement, rightElement) {
    if (!leftElement || !rightElement) return false

    const leftElementId =
      leftElement instanceof EyesWebElement
        ? leftElement.elementId
        : leftElement.ELEMENT || leftElement[WEB_ELEMENT_ID]

    const rightElementId =
      rightElement instanceof EyesWebElement
        ? rightElement.elementId
        : rightElement.ELEMENT || rightElement[WEB_ELEMENT_ID]

    return leftElementId === rightElementId
  }

  static async refreshElement(executor, element) {
    try {
      const result = await executor()
      return result
    } catch (err) {
      if (!err.seleniumStack || err.seleniumStack.type !== 'StaleElementReference') throw err
      const refreshed = await element.refresh()
      if (refreshed) return executor()
      else throw err
    }
  }
}

module.exports = EyesWebElement
