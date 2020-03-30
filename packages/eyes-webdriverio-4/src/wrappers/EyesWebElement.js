'use strict'

const WebElement = require('./WebElement')
const FrameChain = require('../frames/FrameChain')
const {getAbsoluteElementLocation} = require('./web-element-util')

const {
  Region,
  MouseTrigger,
  ArgumentGuard,
  CoordinatesType,
  Location,
  RectangleSize,
} = require('@applitools/eyes-sdk-core')

const JS_GET_SCROLL_LEFT = 'return arguments[0].scrollLeft;'

const JS_GET_SCROLL_TOP = 'return arguments[0].scrollTop;'

const JS_GET_SCROLL_WIDTH = 'return arguments[0].scrollWidth;'

const JS_GET_SCROLL_HEIGHT = 'return arguments[0].scrollHeight;'

const JS_GET_OVERFLOW = 'return arguments[0].style.overflow;'

const JS_GET_CLIENT_WIDTH = 'return arguments[0].clientWidth;'
const JS_GET_CLIENT_HEIGHT = 'return arguments[0].clientHeight;'

/**
 * @param {String} styleProp
 * @return {String}
 */
const JS_GET_COMPUTED_STYLE_FORMATTED_STR = function getScript(styleProp) {
  return `var elem = arguments[0], styleProp = '${styleProp}';
    if (window.getComputedStyle) {
       return window.getComputedStyle(elem, null).getPropertyValue(styleProp);
    } else if (elem.currentStyle) {
       return elem.currentStyle[styleProp];
    } else {
       return null;
    }`
}

/**
 * @param {int} scrollLeft
 * @param {int} scrollTop
 * @return {String}
 */
const JS_SCROLL_TO_FORMATTED_STR = function getScript(scrollLeft, scrollTop) {
  return (
    'arguments[0].scrollLeft = ' + scrollLeft + '; ' + 'arguments[0].scrollTop = ' + scrollTop + ';'
  )
}

/**
 * @param {String} overflow
 * @return {String}
 */
const JS_SET_OVERFLOW_FORMATTED_STR = function getScript(overflow) {
  return "arguments[0].style.overflow = '" + overflow + "'"
}

/**
 * Wraps a Webdriverio Web Element.
 */
class EyesWebElement extends WebElement {
  /**
   * @param {Logger} logger
   * @param {EyesWebDriver} eyesDriver
   * @param {WebElement} webElement
   *
   **/
  constructor(logger, eyesDriver, webElement) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(eyesDriver, 'eyesDriver')
    ArgumentGuard.notNull(webElement, 'webElement')

    if (webElement instanceof EyesWebElement) {
      return webElement
    }

    super(eyesDriver.webDriver, webElement.element, webElement.locator)

    /** @type {Logger}*/
    this._logger = logger
    /** @type {EyesWebDriver}*/
    this._driver = eyesDriver
    /** @type {FrameChain} */
    this._frameChain = new FrameChain(this._logger, this._driver.getFrameChain())
  }

  /**
   * Refresh the element by locator and frame chain.
   */
  async refresh() {
    const originalFrameChain = new FrameChain(this._logger, this._driver.getFrameChain())
    const switchTo = this._driver.switchTo()
    const isSameFrameChain = FrameChain.isSameFrameChain(originalFrameChain, this._frameChain)
    if (!isSameFrameChain) {
      if (originalFrameChain.size() > 0) {
        await switchTo.defaultContent()
      }
      if (this._frameChain.size() > 0) {
        await switchTo.frames(this._frameChain)
      }
    }

    const {value: element} = await this._driver.remoteWebDriver.element(this._locator.value)
    if (element) {
      this._element = element
    }

    if (!isSameFrameChain) {
      if (this._frameChain.size() > 0) {
        await switchTo.defaultContent()
      }
      if (originalFrameChain.size() > 0) {
        await switchTo.frames(originalFrameChain)
      }
    }
    return Boolean(element)
  }

  /**
   * @return {Promise.<Region>}
   */
  async getBounds() {
    const location = await this.getLocation()
    const size = await this.getSize()

    let left = location.getX()
    let top = location.getY()
    let width = 0
    let height = 0

    if (size) {
      width = size.getWidth()
      height = size.getHeight()
    }

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
   * @param {String} propStyle The style property which value we would like to extract.
   * @return {Promise.<String>} The value of the style property of the element, or {@code null}.
   */
  async getComputedStyle(propStyle) {
    try {
      return await this.executeScript(JS_GET_COMPUTED_STYLE_FORMATTED_STR(propStyle))
    } catch (e) {
      this._logger.verbose('WARNING: getComputedStyle error: ' + e)
      throw e
    }
  }

  /**
   * @param {String} propStyle The style property which value we would like to extract.
   * @return {Promise.<int>} The integer value of a computed style.
   */
  async getComputedStyleInteger(propStyle) {
    try {
      const value = await this.getComputedStyle(propStyle)
      return Math.round(parseFloat(value.trim().replace('px', '')))
    } catch (e) {
      this._logger.log(`WARNING: getComputedStyleInteger error: ${e}`)
      throw e
    }
  }

  /**
   * @return {Promise.<int>} The value of the scrollLeft property of the element.
   */
  async getScrollLeft() {
    const value = await this.executeScript(JS_GET_SCROLL_LEFT)
    return Math.ceil(parseFloat(value))
  }

  /**
   * @return {Promise.<int>} The value of the scrollTop property of the element.
   */
  async getScrollTop() {
    const value = await this.executeScript(JS_GET_SCROLL_TOP)
    return Math.ceil(parseFloat(value))
  }

  /**
   * @return {Promise.<int>} The value of the scrollWidth property of the element.
   */
  async getScrollWidth() {
    const value = await this.executeScript(JS_GET_SCROLL_WIDTH)
    return Math.ceil(parseFloat(value))
  }

  /**
   * @return {Promise.<int>} The value of the scrollHeight property of the element.
   */
  async getScrollHeight() {
    const value = await this.executeScript(JS_GET_SCROLL_HEIGHT)
    return Math.ceil(parseFloat(value))
  }

  /**
   * @return {Promise.<int>}
   */
  async getClientWidth() {
    const value = await this.executeScript(JS_GET_CLIENT_WIDTH)
    return Math.ceil(parseFloat(value))
  }

  /**
   * @return {Promise.<int>}
   */
  async getClientHeight() {
    const value = await this.executeScript(JS_GET_CLIENT_HEIGHT)
    return Math.ceil(parseFloat(value))
  }

  /**
   * @return {Promise.<int>} The width of the left border.
   */
  getBorderLeftWidth() {
    return this.getComputedStyleInteger('border-left-width')
  }

  /**
   * @return {Promise.<int>} The width of the right border.
   */
  getBorderRightWidth() {
    return this.getComputedStyleInteger('border-right-width')
  }

  /**
   * @return {Promise.<int>} The width of the top border.
   */
  getBorderTopWidth() {
    return this.getComputedStyleInteger('border-top-width')
  }

  /**
   * @return {Promise.<int>} The width of the bottom border.
   */
  getBorderBottomWidth() {
    return this.getComputedStyleInteger('border-bottom-width')
  }

  /**
   * Scrolls to the specified location inside the element.
   *
   * @param {Location} location The location to scroll to.
   * @return {Promise}
   */
  scrollTo(location) {
    return this.executeScript(JS_SCROLL_TO_FORMATTED_STR(location.getX(), location.getY()))
  }

  /**
   * @return {Promise.<String>} The overflow of the element.
   */
  async getOverflow() {
    const value = await this.executeScript(JS_GET_OVERFLOW)
    const overflow = Math.ceil(parseFloat(value))
    return overflow ? overflow : null
  }

  /**
   * @param {String} overflow The overflow to set
   * @return {Promise} The overflow of the element.
   */
  async setOverflow(overflow) {
    return this.executeScript(JS_SET_OVERFLOW_FORMATTED_STR(overflow))
  }

  async getAllDimensions() {
    console.log(this.element)
    const {size, innerSize, location, contentLocation} = await this.executeScript(el => {
      var rect = el.getBoundingClientRect()
      var borderTopWidth = 0
      var borderLeftWidth = 0
      if (window.getComputedStyle) {
        var computedStyle = window.getComputedStyle(el, null)
        borderTopWidth = parseFloat(computedStyle.getPropertyValue('border-top-width'))
        borderLeftWidth = parseFloat(computedStyle.getPropertyValue('border-left-width'))
      } else if (el.currentStyle) {
        borderTopWidth = parseFloat(el.currentStyle['border-top-width'])
        borderLeftWidth = parseFloat(el.currentStyle['border-left-width'])
      }
      return {
        size: {width: rect.width, height: rect.height},
        innerSize: {width: el.clientWidth, height: el.clientHeight},
        location: {x: rect.x, y: rect.y},
        contentLocation: {x: rect.x + borderLeftWidth, y: rect.y + borderTopWidth},
      }
    })
    return {
      size: new RectangleSize(Math.round(size.width), Math.round(size.height)),
      innerSize: new RectangleSize(Math.round(innerSize.width), Math.round(innerSize.height)),
      location: new Location(Math.round(location.x), Math.round(location.y)),
      contentLocation: new Location(Math.round(contentLocation.x), Math.round(contentLocation.y)),
    }
  }

  /**
   * @param {String} script The script to execute with the element as last parameter
   * @returns {Promise} The result returned from the script
   */
  async executeScript(script) {
    const webElement = await WebElement.findElement(this._driver.webDriver, this._locator)
    return this._driver.executeScript(script, webElement.element)
  }

  /**
   * @Override
   * @inheritDoc
   */
  getDriver() {
    return super.getDriver()
  }

  /**
   * @Override
   * @return {promise.Thenable.<string>}
   */
  get elementId() {
    return this._element.ELEMENT
  }

  /**
   * @Override
   * @inheritDoc
   * return {EyesWebElement}
   */
  async findElement(locator) {
    const element = await super.findElement(locator)
    return new EyesWebElement(this._logger, this._driver, element)
  }

  /**
   * @Override
   * @inheritDoc
   */
  async findElements(locator) {
    const elements = await super.findElements(locator)
    elements.map(element => new EyesWebElement(this._logger, this._driver, element))
  }

  /**
   * @Override
   * @inheritDoc
   * @return {Promise}
   */
  async click() {
    // Letting the driver know about the current action.
    const currentControl = await this.getBounds()
    this._driver.eyes.addMouseTrigger(MouseTrigger.MouseAction.Click, this)
    this._logger.verbose(`click(${currentControl})`)

    return super.click()
  }

  /**
   * @Override
   * @inheritDoc
   */
  async sendKeys(keysToSend) {
    return super.sendKeys(keysToSend)
  }

  async getRect() {
    return super.getRect()
  }

  /**
   * @override
   * @inheritDoc
   */
  getTagName() {
    return super.getTagName()
  }

  /**
   * @override
   * @inheritDoc
   */
  getCssValue(cssStyleProperty) {
    return super.getCssValue(cssStyleProperty)
  }

  /**
   * @override
   * @inheritDoc
   */
  getAttribute(attributeName) {
    return super.getAttribute(attributeName)
  }

  /**
   * @override
   * @inheritDoc
   */
  getText() {
    return super.getText()
  }

  /**
   * @override
   * @inheritDoc
   * @returns {Promise.<RectangleSize>}
   */
  async getSize() {
    const r = await super.getSize()
    const width = Math.ceil(r && r.width ? r.width : 0)
    const height = Math.ceil(r && r.height ? r.height : 0)
    return new RectangleSize(width, height)
  }

  /**
   * @override
   * @inheritDoc
   * @returns {Promise.<Location>}
   */
  async getLocation() {
    let r = await super.getLocation()
    // if (this._frameChain.size() > 0) {
    //   // not using super.getLocation() since it wouldn't throw StaleElementReference error if the element is stale
    //   const res = await this._driver.remoteWebDriver.execute(
    //     e => e.getBoundingClientRect(),
    //     this._element,
    //   )
    //   r = res.value
    // } else {
    //   r = await getAbsoluteElementLocation({
    //     jsExecutor: this._driver.remoteWebDriver.execute.bind(this),
    //     element: this._element,
    //     logger: this._logger,
    //   })
    // }

    const x = Math.ceil(r && r.x ? r.x : 0)
    const y = Math.ceil(r && r.y ? r.y : 0)

    return new Location(x, y)
  }

  /**
   * @override
   * @inheritDoc
   */
  isEnabled() {
    return super.isEnabled()
  }

  /**
   * @override
   * @inheritDoc
   */
  isSelected() {
    return super.isSelected()
  }

  /**
   * @override
   * @inheritDoc
   */
  submit() {
    return super.submit()
  }

  /**
   * @override
   * @inheritDoc
   */
  clear() {
    return super.clear()
  }

  /**
   * @override
   * @inheritDoc
   */
  isDisplayed() {
    return super.isDisplayed()
  }

  /**
   * @override
   * @inheritDoc
   */
  takeScreenshot(opt_scroll) {
    return super.takeScreenshot(opt_scroll)
  }

  /**
   * @returns {Promise.<{offsetLeft, offsetTop}>}
   */
  async getElementOffset() {
    return super.getElementOffset()
  }

  /**
   * @returns {Promise.<{scrollLeft, scrollTop}>}
   */
  async getElementScroll() {
    return super.getElementScroll()
  }

  /**
   * @return {WebElement} The original element object
   */
  getWebElement() {
    return this
  }
}

module.exports = EyesWebElement
