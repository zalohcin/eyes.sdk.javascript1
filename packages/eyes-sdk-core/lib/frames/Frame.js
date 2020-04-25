'use strict'

const {ArgumentGuard, TypeUtils, Location, RectangleSize} = require('@applitools/eyes-common')
const {EyesWrappedElement} = require('../wrappers/EyesWrappedElement')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('@applitools/eyes-common').Logger} Logger
 * @typedef {import('@applitools/eyes-common').Location} Location
 * @typedef {import('@applitools/eyes-common').RectangleSize} RectangleSize
 * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
 * @typedef {import('../wrappers/EyesWrappedElement').UnwrappedElement} UnwrappedElement
 * @typedef {import('../wrappers/EyesWrappedElement').UniversalSelector} UniversalSelector
 * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
 */

/**
 * Reference to the frame, index of the frame in the current context, name or id of the element,
 * framework element object, {@link EyesWrappedElement} implementation object
 * @typedef {number|string|UniversalSelector|UnwrappedElement|EyesWrappedElement} FrameReference
 */

/**
 * Factory which bind {@link Frame} class to the specific {@link EyesWrappedElement} implementation
 * @param {EyesWrappedElement} WrappedElement - implementation of {@link EyesWrappedElement}
 * @return specific {@link Frame} class bound to {@link EyesWrappedElement} implementation
 */
function FrameFactory(WrappedElement) {
  /**
   * Encapsulates a frame/iframe. This is a generic type class,
   * and it's actual type is determined by the element used by the user in
   * order to switch into the frame.
   */
  return class Frame {
    /**
     * Create frame from components
     * @param {Logger} logger - logger instance
     * @param {EyesWrappedDriver} driver - wrapped driver
     * @param {Object} frame - frame components
     * @param {EyesWrappedElement} frame.element - frame element, used as a element to switch into the frame
     * @param {Location} frame.location - location of the frame within the current frame
     * @param {RectangleSize} frame.size - frame element size (i.e., the size of the frame on the screen, not the internal document size)
     * @param {RectangleSize} frame.innerSize - frame element inner size (i.e., the size of the frame actual size, without borders)
     * @param {Location} frame.parentScrollLocation - scroll location of the frame
     * @param {EyesWrappedElement} frame.scrollRootElement - scroll root element
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
          'parentScrollLocation',
        ])
        this._element = frame.element
        this._location = frame.location
        this._size = frame.size
        this._innerSize = frame.innerSize
        this._parentScrollLocation = frame.parentScrollLocation
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

    /**
     * Construct frame reference object which could be later initialized to the full frame object
     * @param {FrameReference} reference - reference to the frame on its parent context
     * @param {EyesWrappedElement} scrollRootElement - scroll root element
     * @return {Frame} frame reference object
     */
    static fromReference(reference, scrollRootElement) {
      const frame = new Frame(null, null, reference)
      frame.scrollRootElement = scrollRootElement
      return frame
    }

    /**
     * Check value for belonging to the {@link FrameReference} type
     * @param {*} reference - value to check if is it a reference
     * @return {boolean} true if value is a valid reference, otherwise false
     */
    static isReference(reference) {
      return (
        TypeUtils.isInteger(reference) ||
        TypeUtils.isString(reference) ||
        WrappedElement.isSelector(reference) ||
        WrappedElement.isCompatible(reference) ||
        reference instanceof Frame
      )
    }

    /**
     * Equality check for two frame objects or frame elements
     * @param {Frame|EyesWrappedDriver} leftFrame - frame object or frame element
     * @param {Frame|EyesWrappedDriver} rightFrame - frame object or frame element
     * @return true if frames are described the same frame element, otherwise false
     */
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
    get parentScrollLocation() {
      return this._parentScrollLocation
    }

    /**
     * @return {EyesWrappedElement}
     */
    get scrollRootElement() {
      return this._scrollRootElement
    }

    /**
     * @param {!EyesWrappedElement} scrollRootElement
     */
    set scrollRootElement(scrollRootElement) {
      if (scrollRootElement) {
        this._scrollRootElement = scrollRootElement
      }
    }

    /**
     * Initialize frame reference by finding frame element and calculate metrics
     * @param {Logger} logger - logger instance
     * @param {EyesWrappedDriver} driver - wrapped driver targeted on parent context
     * @return {this} initialized frame object
     */
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

    /**
     * Recalculate frame object metrics. Driver should be targeted on a parent context
     * @return {this} this frame object
     */
    async refresh() {
      const [
        rect,
        [clientWidth, clientHeight],
        [borderLeftWidth, borderTopWidth],
        parentScrollLocation,
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
      this._parentScrollLocation = parentScrollLocation
      return this
    }

    /**
     * Create reference from current frame object
     * @return {Frame} frame reference object
     */
    toReference() {
      return Frame.fromReference(this._element || this._reference, this._scrollRootElement)
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
