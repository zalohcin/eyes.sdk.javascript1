'use strict'

const {Selector} = require('testcafe')
const {
  Region,
  ArgumentGuard,
  CoordinatesType,
  // TypeUtils,
  RectangleSize,
  Location,
  EyesError,
  GeneralUtils,
} = require('@applitools/eyes-common')
// const {MouseTrigger} = require('@applitools/eyes-sdk-core')

const JS_GET_COMPUTED_STYLE_FN =
  'function getCmpStyle(el, p) { return window.getComputedStyle ? window.getComputedStyle(el, null).getPropertyValue(p) : (el.currentStyle ? el.currentStyle[p] : null); };'

const JS_GET_COMPUTED_STYLE_FORMATTED_STR = styleProp =>
  `${JS_GET_COMPUTED_STYLE_FN}return getCmpStyle(arguments[0], '${styleProp}');`

const getSizeAndBorderWidth = () => {
  const element = _element()
  let retVal = [element.clientWidth, element.clientHeight]
  // eslint-disable-next-line no-undef
  const win = window
  if (win.getComputedStyle) {
    var computedStyle = win.getComputedStyle(element, null)
    retVal.push(computedStyle.getPropertyValue('border-left-width'))
    retVal.push(computedStyle.getPropertyValue('border-top-width'))
    retVal.push(computedStyle.getPropertyValue('border-right-width'))
    retVal.push(computedStyle.getPropertyValue('border-bottom-width'))
  } else if (element.currentStyle) {
    retVal.push(element.currentStyle['border-left-width'])
    retVal.push(element.currentStyle['border-top-width'])
    retVal.push(element.currentStyle['border-right-width'])
    retVal.push(element.currentStyle['border-bottom-width'])
  } else {
    retVal.push(0, 0, 0, 0)
  }
  return retVal
}

/**
 * Wraps a Testcafe Web Element.
 */
class EyesWebElement {
  /**
   * @param {Logger} logger
   * @param {EyesWebDriver} eyesDriver
   * @param {WebElement} webElement
   *
   */
  constructor(logger, eyesDriver, webElement) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(eyesDriver, 'eyesDriver')
    ArgumentGuard.notNull(webElement, 'webElement')

    if (webElement instanceof EyesWebElement) {
      return webElement
    }

    this._logger = logger
    this._eyesDriver = eyesDriver

    /** @type {PositionProvider} */
    this._positionProvider = undefined
    this._webElement = webElement
  }

  /**
   * @param {object} obj
   * @return {boolean}
   */
  static isLocator(obj) {
    return !!obj && obj.addCustomMethods && obj.find && obj.parent
  }

  /**
   * Compares two WebElements for equality.
   *
   * @param {!EyesWebElement|WebElement} a A WebElement.
   * @param {!EyesWebElement|WebElement} b A WebElement.
   * @return {!Promise<boolean>} - A promise that will be resolved to whether the two WebElements are equal.
   */
  static async equals(_a, _b) {
    // TODO (amit)
    return false
  }

  /**
   * @override
   */
  toString() {
    return GeneralUtils.toString(this, ['_logger', '_eyesDriver', '_positionProvider'])
  }

  /**
   * @return {Promise<Region>}
   */
  async getBounds() {
    const rect = await this.getRect()
    let {x: left, y: top, width, height} = rect

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

  /**
   * Returns the computed value of the style property for the current element.
   *
   * @param {string} propStyle - The style property which value we would like to extract.
   * @return {Promise<string>} - The value of the style property of the element, or {@code null}.
   */
  getComputedStyle(propStyle) {
    return this.executeScript(JS_GET_COMPUTED_STYLE_FORMATTED_STR(propStyle))
  }

  /**
   * @param {string} propStyle - The style property which value we would like to extract.
   * @return {Promise<number>} - The integer value of a computed style.
   */
  async getComputedStyleInteger(propStyle) {
    const result = await this.getComputedStyle(propStyle)
    return Math.round(parseFloat(result.trim().replace('px', '')))
  }

  /**
   * @deprecated use {@link getScrollLocation} instead
   * @return {Promise<number>} - The value of the scrollLeft property of the element.
   */
  async getScrollLeft() {
    const result = await this._getScrollLocation()
    return Math.ceil(result[0]) || 0
  }

  /**
   * @deprecated use {@link getScrollLocation} instead
   * @return {Promise<number>} - The value of the scrollTop property of the element.
   */
  async getScrollTop() {
    const result = await this._getScrollLocation()
    return Math.ceil(result[1]) || 0
  }

  /**
   * @return {Promise<Location>} - The value of the `scrollLeft` and `scrollTop` property of the element.
   */
  async getScrollLocation() {
    const result = await this._getScrollLocation()
    return new Location(Math.ceil(result[0]) || 0, Math.ceil(result[1]) || 0)
  }

  async _getScrollLocation() {
    return this.executeClientFunction({
      script: () => [_element().scrollLeft, _element().scrollTop],
      scriptName: 'getScrollLocation',
    })
  }

  /**
   * @deprecated use {@link getScrollSize} instead
   * @return {Promise<number>} - The value of the scrollWidth property of the element.
   */
  async getScrollWidth() {
    const result = await this._getScrollSize()
    return Math.ceil(result[0]) || 0
  }

  /**
   * @deprecated use {@link getScrollSize} instead
   * @return {Promise<number>} - The value of the scrollHeight property of the element.
   */
  async getScrollHeight() {
    const result = await this._getScrollSize()
    return Math.ceil(result[1]) || 0
  }

  /**
   * @return {Promise<RectangleSize>} - The value of the `scrollWidth` and `scrollHeight` property of the element.
   */
  async getScrollSize() {
    const result = await this._getScrollSize()
    return new RectangleSize(Math.ceil(result[0]) || 0, Math.ceil(result[1]) || 0)
  }

  async _getScrollSize() {
    return this.executeClientFunction({
      script: () => [_element().scrollWidth, _element().scrollHeight],
      scriptName: 'getScrollSize',
    })
  }

  /**
   * @deprecated use {@link getClientSize} instead
   * @return {Promise<number>}
   */
  async getClientWidth() {
    const result = await this._getClientSize()
    return Math.ceil(result[0]) || 0
  }

  /**
   * @deprecated use {@link getClientSize} instead
   * @return {Promise<number>}
   */
  async getClientHeight() {
    const result = await this._getClientSize()
    return Math.ceil(result[1]) || 0
  }

  /**
   * @return {Promise<RectangleSize>} - The value of the `clientWidth` and `clientHeight` property of the element.
   */
  async getClientSize() {
    const result = await this._getClientSize()
    return new RectangleSize(Math.ceil(result[0]) || 0, Math.ceil(result[1]) || 0)
  }

  async _getClientSize() {
    return this.executeClientFunction({
      script: () => [_element().clientWidth, _element().clientHeight],
      scriptName: 'getClientSize',
    })
  }

  /**
   * @return {Promise<number>} - The width of the left border.
   */
  getBorderLeftWidth() {
    return this.getComputedStyleInteger('border-left-width')
  }

  /**
   * @return {Promise<number>} - The width of the right border.
   */
  getBorderRightWidth() {
    return this.getComputedStyleInteger('border-right-width')
  }

  /**
   * @return {Promise<number>} - The width of the top border.
   */
  getBorderTopWidth() {
    return this.getComputedStyleInteger('border-top-width')
  }

  /**
   * @return {Promise<number>} - The width of the bottom border.
   */
  getBorderBottomWidth() {
    return this.getComputedStyleInteger('border-bottom-width')
  }

  /**
   * @return {Promise<{top: number, left: number, bottom: number, width: number, right: number, height: number}>}
   */
  async getSizeAndBorders() {
    const result = await this.executeClientFunction({
      script: getSizeAndBorderWidth,
      scriptName: 'getSizeAndBorderWidth',
    })
    return {
      width: Math.ceil(result[0]),
      height: Math.ceil(result[1]),
      left: Math.ceil(result[2].replace('px', '')),
      top: Math.ceil(result[2].replace('px', '')),
      right: Math.ceil(result[3].replace('px', '')),
      bottom: Math.ceil(result[5].replace('px', '')),
    }
  }

  /**
   * Scrolls to the specified location inside the element.
   *
   * @param {Location} location - The location to scroll to.
   * @return {Promise<Location>} - the current location after scroll.
   */
  async scrollTo(location) {
    try {
      const script = () => {
        // eslint-disable-next-line no-undef
        const win = window
        // eslint-disable-next-line no-undef
        const _left = left
        // eslint-disable-next-line no-undef
        const _top = top

        const elem = _element()
        // eslint-disable-next-line no-undef
        if (elem === document.documentElement && win.scrollTo) {
          win.scrollTo(_left, _top)
        } else {
          elem.scrollLeft = _left
          elem.scrollTop = _top
        }
        return [elem.scrollLeft, elem.scrollTop]
      }

      const position = await this.executeClientFunction({
        script,
        scriptName: 'scrollTo',
        args: {left: location.getX(), top: location.getY()},
      })
      return new Location(Math.ceil(position[0]) || 0, Math.ceil(position[1]) || 0)
    } catch (err) {
      throw EyesError('Could not get scroll position!', err)
    }
  }

  /**
   * @return {Promise<string>} - The overflow of the element.
   */
  getOverflow() {
    return this.executeClientFunction({
      script: () => _element().style.overflow,
      scriptName: 'getOverflow',
    })
  }

  /**
   * @param {string} overflow - The overflow to set
   * @return {Promise} - The overflow of the element.
   */
  setOverflow(overflow) {
    return this.executeClientFunction({
      script: () => (_element().style.overflow = overflow),
      scriptName: 'setOverflow',
      args: {
        overflow,
      },
    })
  }

  /**
   * @param {string} script - The script to execute with the element as last parameter
   * @return {Promise<*>} - The result returned from the script
   */
  executeScript(script) {
    return this._eyesDriver.executeScript(script, this._webElement)
  }

  executeClientFunction({script, scriptName, args = {}}) {
    return this._eyesDriver.executeClientFunction({
      script,
      scriptName,
      args: {
        _element: this._webElement,
        ...args,
      },
    })
  }

  /**
   * @inheritDoc
   * @return {!EyesWebElement} A WebElement that can be used to issue commands against the located element.
   *   If the element is not found, the element will be invalidated and all scheduled commands aborted.
   */
  findElement(locator) {
    // TODO (amit): i don't know if this works or when it's needed
    return Selector(locator).then(
      element => new EyesWebElement(this._logger, this._eyesDriver, element),
    )
  }

  /**
   * @inheritDoc
   * @return {!Promise<!Array<!EyesWebElement>>} A promise that will resolve to an array of WebElements.
   */
  findElements(locator) {
    // TODO (amit): i don't know when this is needed
    return super
      .findElements(locator)
      .then(elements =>
        elements.map(element => new EyesWebElement(this._logger, this._eyesDriver, element)),
      )
  }

  /**
   * @inheritDoc
   * @return {Promise<{width: number, x: number, y: number, height: number}>}
   */
  async getRect() {
    // The workaround is similar to Java one, but in js we always get raw data with decimal value which we should round up.
    const rect = await this._webElement.boundingClientRect
    const width = Math.ceil(rect.width) || 0

    const height = Math.ceil(rect.height) || 0
    const x = Math.ceil(rect.x) || 0

    const y = Math.ceil(rect.y) || 0
    return {width, height, x, y}
  }

  /**
   * @return {PositionProvider}
   */
  getPositionProvider() {
    return this._positionProvider
  }

  /**
   * @param {PositionProvider} positionProvider
   */
  setPositionProvider(positionProvider) {
    this._positionProvider = positionProvider
  }
}

exports.EyesWebElement = EyesWebElement
