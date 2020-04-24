'use strict'

const {ArgumentGuard, TypeUtils, Location, RectangleSize} = require('@applitools/eyes-common')
const {EyesWrappedElement} = require('../wrappers/EyesWrappedElement')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('@applitools/eyes-common').Logger} Logger
 * @typedef {import('@applitools/eyes-common').Location} Location
 * @typedef {import('@applitools/eyes-common').RectangleSize} RectangleSize
 * @typedef {import('../wrappers/EyesWrappedElement').EyesWrappedElement} EyesWrappedElement
 */

/**
 * Encapsulates a frame/iframe. This is a generic type class,
 * and it's actual type is determined by the element used by the user in
 * order to switch into the frame.
 */
function FrameFactory(WrappedElement) {
  return class Frame {
    /**
     * Create frame from components
     * @param {Logger} logger logger instance.
     * @param {EyesWebDriver} deriver frame components
     * @param {Object} frame frame components
     * @param {EyesWrappedElement} frame.element frame element, used as a element to switch into the frame.
     * @param {Location} frame.location location of the frame within the current frame.
     * @param {RectangleSize} frame.size frame element size (i.e., the size of the frame on the screen, not the internal document size).
     * @param {RectangleSize} frame.innerSize The frame element inner size (i.e., the size of the frame actual size, without borders).
     * @param {Location} frame.originalLocation The scroll location of the frame.
     * @param {string} frame.scrollRootElement The scroll root element.
     */
    constructor(logger, driver, frame) {
      if (frame instanceof Frame) {
        return frame
      } else if (Frame.isReference(frame)) {
        this._reference = frame
        this._scrollRootElement = WrappedElement.fromSelector({
          using: 'css selector',
          value: 'html',
        })
      } else if (TypeUtils.isObject(frame)) {
        ArgumentGuard.hasProperties(frame, [
          'element',
          'location',
          'size',
          'innerSize',
          'originalLocation',
        ])
        this._element = frame.element
        this._location = frame.location
        this._size = frame.size
        this._innerSize = frame.innerSize
        this._originalLocation = frame.originalLocation
        this._scrollRootElement =
          frame.scrollRootElement ||
          WrappedElement.fromSelector({using: 'css selector', value: 'html'})
      }
      if (driver) {
        this._driver = driver
      }
      if (logger) {
        this._logger = logger
      }
    }

    static fromReference(reference, scrollRootElement) {
      const frame = new Frame(null, null, reference)
      frame.scrollRootElement = scrollRootElement
      return frame
    }

    static isReference(reference) {
      return (
        TypeUtils.isInteger(reference) ||
        TypeUtils.isString(reference) ||
        WrappedElement.isSelector(reference) ||
        WrappedElement.isCompatible(reference) ||
        reference instanceof Frame
      )
    }

    static equals(leftFrame, rightFrame) {
      let leftElement = null
      if (leftFrame instanceof Frame) leftElement = leftFrame.element
      else if (leftFrame instanceof EyesWrappedElement) leftElement = leftFrame
      let rightElement = null
      if (rightFrame instanceof Frame) rightElement = rightFrame.element
      else if (rightFrame instanceof EyesWrappedElement) rightElement = rightFrame

      if (!leftElement || !rightElement) return false
      return leftElement.equals(rightElement)
    }

    /**
     * @return {EyesWrappedElement}
     */
    get element() {
      return this._element
    }

    /**
     * @return {Location}
     */
    get location() {
      return this._location
    }

    /**
     * @return {RectangleSize}
     */
    get size() {
      return this._size
    }

    /**
     * @return {RectangleSize}
     */
    get innerSize() {
      return this._innerSize
    }

    /**
     * @return {Location}
     */
    get originalLocation() {
      return this._originalLocation
    }

    /**
     * @return {EyesWrappedElement}
     */
    get scrollRootElement() {
      return this._scrollRootElement
    }

    set scrollRootElement(element) {
      if (element) {
        this._scrollRootElement = element
      }
    }

    async init(logger, driver) {
      if (this._element) return this
      this._logger = logger
      this._driver = driver
      this._logger.verbose(`Frame initialization from reference - ${this._reference}`)
      if (TypeUtils.isInteger(this._reference)) {
        this._logger.verbose('Getting frames list...')
        const elements = await this._driver.finder.findElements('frame, iframe')
        if (this._reference > elements.length) {
          throw new TypeError(`Frame index [${this._reference}] is invalid!`)
        }
        this._logger.verbose('Done! getting the specific frame...')
        this._element = elements[this._reference]
      } else if (TypeUtils.isString(this._reference)) {
        this._logger.verbose('Getting frames by name...')
        let element = await this._driver.finder.findElement({
          using: 'css selector',
          value: `[name="${this._reference}"]`,
        })
        if (!element) {
          this._logger.verbose('No frames Found! Trying by id...')
          element = await this._driver.finder.findElement({
            using: 'css selector',
            value: `#${this._reference}`,
          })
          if (!element) {
            throw new TypeError(`No frame with name or id '${this._reference}' exists!`)
          }
        }
        this._element = element
      } else if (WrappedElement.isSelector(this._reference)) {
        const element = await this._driver.finder.findElement(this._reference)
        if (!element) {
          throw new TypeError(`No frame found by locator '${this._reference}'!`)
        }
        this._element = element
      } else if (WrappedElement.isCompatible(this._reference)) {
        this._element = new WrappedElement(this._logger, this._driver, this._reference)
      } else {
        throw new TypeError('Reference type does not supported!')
      }
      return this.refresh()
    }

    async refresh() {
      const [
        rect,
        [clientWidth, clientHeight],
        [borderLeftWidth, borderTopWidth],
        originalLocation,
      ] = await Promise.all([
        this._element.getRect(),
        this._element.getProperty('clientWidth', 'clientHeight'),
        this._element.getCssProperty('border-left-width', 'border-top-width'),
        EyesUtils.getScrollLocation(this._logger, this._driver.executor),
      ])

      this._size = new RectangleSize(Math.round(rect.getWidth()), Math.round(rect.getHeight()))
      this._innerSize = new RectangleSize(Math.round(clientWidth), Math.round(clientHeight))
      this._location = new Location(
        Math.round(rect.getLeft() + Number.parseFloat(borderLeftWidth)),
        Math.round(rect.getTop() + Number.parseFloat(borderTopWidth)),
      )
      this._originalLocation = originalLocation
      return this
    }

    toReference() {
      return Frame.fromReference(this._element, this._scrollRootElement)
    }

    /**
     * @return {Promise<void>}
     */
    async hideScrollbars() {
      await this._scrollRootElement.init(this._driver)
      this._logger.verbose('hiding scrollbars of element')
      await this._scrollRootElement.hideScrollbars()
    }

    /**
     * @return {Promise<void>}
     */
    async restoreScrollbars() {
      await this._scrollRootElement.init(this._driver)
      this._logger.verbose('returning overflow of element to its original value')
      await this._scrollRootElement.restoreScrollbars()
    }
  }
}

module.exports = FrameFactory
