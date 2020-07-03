'use strict'
const ArgumentGuard = require('../utils/ArgumentGuard')
const TypeUtils = require('../utils/TypeUtils')
const Location = require('../geometry/Location')
const RectangleSize = require('../geometry/RectangleSize')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../logging/Logger')} Logger
 * @typedef {import('../geometry/Location')} Location
 * @typedef {import('../geometry/RectangleSize')} RectangleSize
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./EyesWrappedDriver')<TDriver, TElement, TSelector>} EyesWrappedDriver
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('../wrappers/EyesWrappedElement')<TDriver, TElement, TSelector>} EyesWrappedElement
 */

/**
 * Reference to the frame, index of the frame in the current context, name or id of the element,
 * framework element object, {@link EyesWrappedElement} implementation object
 * @template TDriver, TElement, TSelector
 * @typedef {Frame<TDriver, TElement, TSelector>|EyesWrappedElement<TDriver, TElement, TSelector>|TElement|TSelector|number|string} FrameReference
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef SpecFrame
 * @prop {(selector) => boolean} isSelector - return true if the value is a valid selector, false otherwise
 * @prop {(element) => boolean} isCompatibleElement - return true if the value is an element, false otherwise
 * @prop {(logger: Logger, driver: EyesWrappedDriver<TDriver, TElement, TSelector>, element: TElement, selector: TSelector) => EyesWrappedElement<TDriver, TElement, TSelector>} createElement - return wrapped element instance
 * @prop {(leftElement: EyesWrappedElement<TDriver, TElement, TSelector>|TElement, rightElement: EyesWrappedElement<TDriver, TElement, TSelector>|TElement) => Promise<boolean>} isEqualElements - return true if elements are equal, false otherwise
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {new (logger: Logger, driver: EyesWrappedDriver<TDriver, TElement, TSelector>, frame) => Frame<TDriver, TElement, TSelector>} FrameCtor
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef FrameStatics
 * @prop {(reference: FrameReference<TDriver, TElement, TSelector>, scrollRootElement?: EyesWrappedElement<TDriver, TElement, TSelector>) => Frame<TDriver, TElement, TSelector>} fromReference
 * @prop {(reference) => reference is FrameReference<TDriver, TElement, TSelector>} isReference
 */

/**
 * Encapsulates a frame/iframe. This is a generic type class,
 * and it's actual type is determined by the element used by the user in
 * order to switch into the frame.
 * @template TDriver - TDriver provided by wrapped framework
 * @template TElement - TElement provided by wrapped framework
 * @template TSelector - TSelector supported by framework
 */
class Frame {
  /**
   * @template TDriver, TElement, TSelector
   * @param {SpecFrame<TDriver, TElement, TSelector>} spec
   * @return {FrameCtor<TDriver, TElement, TSelector> & FrameStatics<TDriver, TElement, TSelector>}
   */
  static specialize(spec) {
    return class extends Frame {
      /** @override */
      static get spec() {
        return spec
      }
      /** @override */
      get spec() {
        return spec
      }
    }
  }
  /** @type {SpecFrame<E,S>} */
  static get spec() {
    throw new TypeError('Frame is not specialized')
  }
  /** @type {SpecFrame<E,S>} */
  get spec() {
    throw new TypeError('Frame is not specialized')
  }
  /**
   * Create frame from components
   * @param {Logger} logger - logger instance
   * @param {EyesWrappedDriver<TDriver, TElement, TSelector>} driver - wrapped driver
   * @param {object} frame - frame components
   * @param {EyesWrappedElement<TDriver, TElement, TSelector>} frame.element - frame element, used as a element to switch into the frame
   * @param {Location} frame.location - location of the frame within the current frame
   * @param {RectangleSize} frame.size - frame element size (i.e., the size of the frame on the screen, not the internal document size)
   * @param {RectangleSize} frame.innerSize - frame element inner size (i.e., the size of the frame actual size, without borders)
   * @param {Location} frame.parentScrollLocation - scroll location of the frame
   * @param {EyesWrappedElement<TDriver, TElement, TSelector>} [frame.scrollRootElement] - scroll root element
   */
  constructor(logger, driver, frame) {
    if (frame instanceof Frame) {
      return frame
    } else if (this.constructor.isReference(frame)) {
      this._reference = frame
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
      this._scrollRootElement = frame.scrollRootElement
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
   * @template TDriver, TElement, TSelector
   * @param {FrameReference<TDriver, TElement, TSelector>} reference - reference to the frame on its parent context
   * @param {EyesWrappedElement<TDriver, TElement, TSelector>} [scrollRootElement] - scroll root element
   * @return {Frame<TDriver, TElement, TSelector>} frame reference object
   */
  static fromReference(reference, scrollRootElement) {
    const frame = new this(null, null, reference)
    frame.scrollRootElement = scrollRootElement
    return frame
  }
  /**
   * Check value for belonging to the {@link FrameReference} type
   * @template TDriver, TElement, TSelector
   * @param reference - value to check if is it a reference
   * @return {reference is FrameReference<TDriver, TElement, TSelector>} true if value is a valid reference, otherwise false
   */
  static isReference(reference) {
    return (
      reference === null ||
      TypeUtils.isInteger(reference) ||
      TypeUtils.isString(reference) ||
      this.spec.isSelector(reference) ||
      this.spec.isCompatibleElement(reference) ||
      reference instanceof Frame
    )
  }
  /**
   * @return {EyesWrappedElement<TDriver, TElement, TSelector>}
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
   * @return {EyesWrappedElement<TDriver, TElement, TSelector>}
   */
  get scrollRootElement() {
    return this._scrollRootElement
  }
  /**
   * @param {EyesWrappedElement<TDriver, TElement, TSelector>} scrollRootElement
   */
  set scrollRootElement(scrollRootElement) {
    if (scrollRootElement) {
      this._scrollRootElement = scrollRootElement
    }
  }
  /**
   * Create reference from current frame object
   * @return {Frame<TDriver, TElement, TSelector>} frame reference object
   */
  toReference() {
    return this.constructor.fromReference(this._element || this._reference, this._scrollRootElement)
  }
  /**
   * Equality check for two frame objects or frame elements
   * @param {Frame<TDriver, TElement, TSelector>|EyesWrappedElement<TDriver, TElement, TSelector>} otherFrame - frame object or frame element
   * @return {Promise<boolean>} true if frames are described the same frame element, otherwise false
   */
  async equals(otherFrame) {
    const otherElement = otherFrame instanceof Frame ? otherFrame.element : otherFrame
    return this._element ? this._element.equals(otherElement) : false
  }
  /**
   * Initialize frame reference by finding frame element and calculate metrics
   * @param {Logger} logger - logger instance
   * @param {EyesWrappedDriver<TDriver, TElement, TSelector>} driver - wrapped driver targeted on parent context
   * @return {this} initialized frame object
   */
  async init(logger, driver, parentFrame) {
    if (this._element) return this
    this._logger = logger
    this._driver = driver
    this._logger.verbose(`Frame initialization from reference - ${this._reference}`)
    if (this._reference === null) {
      this._element = this._reference
    } else if (TypeUtils.isInteger(this._reference)) {
      this._logger.verbose('Getting frames list...')
      const elements = await this._driver.finder.findElements('frame, iframe')
      if (this._reference > elements.length) {
        throw new TypeError(`Frame index [${this._reference}] is invalid!`)
      }
      this._logger.verbose('Done! getting the specific frame...')
      this._element = elements[this._reference]
    } else if (TypeUtils.isString(this._reference) || this.spec.isSelector(this._reference)) {
      if (TypeUtils.isString(this._reference)) {
        this._logger.verbose('Getting frames by name or id...')
        const element = await EyesUtils.getFrameByNameOrId(
          this._logger,
          this._driver.executor,
          this._reference,
        )
        if (element) {
          this._element = this.spec.createElement(this._logger, this._driver, element)
        }
      }
      if (this.spec.isSelector(this._reference)) {
        const element = await this._driver.finder.findElement(this._reference)
        if (element) {
          this._element = element
        }
      }
      if (!this._element) {
        throw new TypeError(`No frame with selector, name or id '${this._reference}' exists!`)
      }
    } else if (this.spec.isCompatibleElement(this._reference)) {
      this._element = this.spec.createElement(this._logger, this._driver, this._reference)
    } else {
      throw new TypeError('Reference type does not supported!')
    }
    return this.refresh(parentFrame)
  }
  /**
   * Recalculate frame object metrics. TDriver should be targeted on a parent context
   * @return {this} this frame object
   */
  async refresh(parentFrame) {
    if (this._element) {
      const rect = await this._element.getRect()
      const clientRect = await this._element.getClientRect()
      const parentScrollLocation = await EyesUtils.getScrollLocation(
        this._logger,
        this._driver.executor,
        parentFrame.scrollRootElement,
      )

      this._size = new RectangleSize(Math.round(rect.getWidth()), Math.round(rect.getHeight()))
      this._innerSize = new RectangleSize(
        Math.round(clientRect.getWidth()),
        Math.round(clientRect.getHeight()),
      )
      this._location = clientRect.getLocation()
      this._parentScrollLocation = parentScrollLocation
    } else {
      const size = await EyesUtils.getViewportSize(this._logger, this._driver)
      this._size = size
      this._innerSize = size
      this._location = Location.ZERO
      this._parentScrollLocation = Location.ZERO
    }
    return this
  }
  /**
   * @return {Promise<void>}
   */
  async hideScrollbars() {
    if (!this._scrollRootElement) {
      const element = await this._driver.finder.findElement({type: 'css', selector: 'html'})
      this._scrollRootElement = this.spec.createElement(this._logger, this._driver, element)
    }
    this._logger.verbose('hiding scrollbars of element')
    return this._scrollRootElement.hideScrollbars()
  }
  /**
   * @return {Promise<void>}
   */
  async restoreScrollbars() {
    if (this._scrollRootElement) {
      this._logger.verbose('returning overflow of element to its original value')
      await this._scrollRootElement.restoreScrollbars()
    }
  }
  /**
   * @param {PositionProvider} positionProvider
   * @return {Promise<void>}
   */
  async preservePosition(positionProvider) {
    if (!this._scrollRootElement) {
      const element = await this._driver.finder.findElement({type: 'css', selector: 'html'})
      this._scrollRootElement = this.spec.createElement(this._logger, this._driver, element)
    }
    this._logger.verbose('saving frame position')
    return this._scrollRootElement.preservePosition(positionProvider)
  }
  /**
   * @param {PositionProvider} positionProvider
   * @return {Promise<void>}
   */
  async restorePosition(positionProvider) {
    if (this._scrollRootElement) {
      this._logger.verbose('restoring frame position')
      await this._scrollRootElement.restorePosition(positionProvider)
    }
  }
}

module.exports = Frame
