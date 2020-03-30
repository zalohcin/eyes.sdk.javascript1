'use strict'

const {ArgumentGuard, RectangleSize, Location} = require('@applitools/eyes-sdk-core')
const EyesWDIOUtils = require('../EyesWDIOUtils')
const WDIOJSExecutor = require('../WDIOJSExecutor')
const By = require('../By')
const handleStaleElement = require('../wrappers/handleStaleElement')

/**
 * Encapsulates a frame/iframe. This is a generic type class,
 * and it's actual type is determined by the element used by the user in
 * order to switch into the frame.
 */
class Frame {
  static async from(frameOrElement) {
    if (frameOrElement instanceof Frame) {
      frameOrElement._logger.verbose('Frame.from(frame)')
      return new Frame(frameOrElement)
    }
    const element = frameOrElement
    ArgumentGuard.notNull(element, 'element')
    element._logger.verbose('Frame.from(element)')

    const {size, innerSize, contentLocation} = await element.getAllDimensions()
    const originalOverflow = await element.getOverflow()
    const originalLocation = await EyesWDIOUtils.getCurrentScrollPosition(element._driver)

    return new Frame({
      logger: element._logger,
      driver: element._driver,
      element,
      size,
      innerSize,
      location: contentLocation,
      originalLocation,
      originalOverflow,
    })
  }

  /**
   * @param {Logger} logger A Logger instance.
   * @param {WebElement} element The web element for the frame, used as a element to switch into the frame.
   * @param {Location} location The location of the frame within the current frame.
   * @param {RectangleSize} size The frame element size (i.e., the size of the frame on the screen, not the internal document size).
   * @param {RectangleSize} innerSize The frame element inner size (i.e., the size of the frame actual size, without borders).
   * @param {Location} originalLocation The scroll location of the frame.
   * @param {String} originalOverflow The original overflow value of the frame.
   */
  constructor(frameOrComponents) {
    if (frameOrComponents instanceof Frame) {
      const frame = frameOrComponents
      this._logger = frame._logger
      this._logger.verbose(`Frame(frame)`)
      this._driver = frame._driver
      this._element = frame._element
      this._location = frame._location
      this._size = frame._size
      this._innerSize = frame._innerSize
      this._originalLocation = frame._originalLocation
      this._originalOverflow = frame._originalOverflow
      this._scrollRootElement = frame._scrollRootElement
    } else {
      const {
        logger,
        driver,
        element,
        location,
        size,
        innerSize,
        originalLocation,
        originalOverflow,
      } = frameOrComponents
      ArgumentGuard.notNull(logger, 'logger')
      ArgumentGuard.notNull(driver, 'driver')
      ArgumentGuard.notNull(element, 'element')
      ArgumentGuard.notNull(location, 'location')
      ArgumentGuard.notNull(size, 'size')
      ArgumentGuard.notNull(innerSize, 'innerSize')
      ArgumentGuard.notNull(originalLocation, 'originalLocation')
      this._logger = logger
      this._logger.verbose(`Frame({element, ${location}, ${size}, ${innerSize}, logger})`)
      this._driver = driver
      this._element = element
      this._location = location
      this._size = size
      this._innerSize = innerSize
      this._originalLocation = originalLocation
      this._originalOverflow = originalOverflow
    }
  }

  /**
   * @return {WebElement}
   */
  getReference() {
    return this._element
  }

  /**
   * @return {Location}
   */
  getLocation() {
    return this._location
  }

  /**
   * @return {RectangleSize}
   */
  getSize() {
    return this._size
  }

  /**
   * @return {RectangleSize}
   */
  getInnerSize() {
    return this._innerSize
  }

  /**
   * @return {Location}
   */
  getOriginalLocation() {
    return this._originalLocation
  }

  /**
   * @return {String}
   */
  getOriginalOverflow() {
    return this._originalOverflow
  }

  /**
   * @param {WebElement} scrollRootElement
   */
  setScrollRootElement(scrollRootElement) {
    this._scrollRootElement = scrollRootElement
  }

  /**
   * @return {WebElement}
   */
  getScrollRootElement() {
    return this._scrollRootElement
  }

  /**
   * @return {Promise<WebElement>}
   */
  async getForceScrollRootElement() {
    if (!this._scrollRootElement) {
      this._logger.verbose('no scroll root element. selecting default.')
      this._scrollRootElement = await this._driver.findElement(By.css('html'))
    }
    return this._scrollRootElement
  }

  /**
   * @return {Promise}
   */
  async hideScrollbars() {
    const scrollRootElement = await this.getForceScrollRootElement()
    this._logger.verbose('hiding scrollbars of element:', scrollRootElement.element)
    this._originalOverflow = await EyesWDIOUtils.hideScrollbars(
      new WDIOJSExecutor(this._element.getDriver()),
      200,
      scrollRootElement.element,
    )
  }

  /**
   * @return {Promise}
   */
  async restoreScrollbars() {
    const scrollRootElement = await this.getForceScrollRootElement()
    this._logger.verbose(
      'returning overflow of element to its original value:',
      scrollRootElement.element,
    )
    await scrollRootElement.setOverflow(this._originalOverflow)
  }
}

module.exports = Frame
