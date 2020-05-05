'use strict'
/* eslint-disable no-unused-vars */

/**
 * @typedef {import('@applitools/eyes-common').Region} Region
 * @typedef {import('@applitools/eyes-common').Location} Location
 * @typedef {import('@applitools/eyes-common').RectangleSize} RectangleSize
 * @typedef {import('./EyesWrappedDriver')} EyesWrappedDriver
 */

/**
 * The object for which which is compatible with concrete {@link EyesWrappedElement} implementation
 * @typedef {Object} UnwrappedElement
 * @property {?}
 *
 * The object which should be supported as a selector
 * @typedef {Object} UniversalSelector
 * @property {!string} UniversalSelector.using
 * @property {!string} UniversalSelector.value
 */

/**
 * An interface for element wrappers
 * @interface
 */
class EyesWrappedElement {
  /**
   * Create partial wrapped element object from the element, this object need to be initialized before use
   * @param {UnwrappedElement} element - unwrapped element object
   * @return {EyesWrappedElement} partially wrapped object
   */
  static fromElement(element) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Create partial wrapped element object from the selector, this object need to be initialized before use
   * @param {UniversalSelector} selector - universal selector object or any kind of supported selector
   * @return {EyesWrappedElement} partially wrapped object
   */
  static fromSelector(selector) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Check if object could be wrapped with this class
   * @param {*} element - object to check compatibility
   * @return {boolean} true if object could be wrapped with this class, otherwise false
   */
  static isCompatible(element) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Check if passed selector is supported by current implementation
   * @param {*} selector
   * @returns {boolean} true if selector is supported and could be passed in the {@link EyesWrappedElement.fromSelector} implementation
   */
  static isSelector(selector) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Compare two elements, these elements could be an instances of this class or compatible objects
   * @param {EyesWrappedElement|UnwrappedElement} leftElement - element to compare
   * @param {EyesWrappedElement|UnwrappedElement} rightElement - element to compare
   * @return {boolean} true if elements are equal, false otherwise
   */
  static equals(leftElement, rightElement) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Extract element ID from this class instance or compatible object
   * @param {EyesWrappedElement|UnwrappedElement} element - element to extract ID
   * @return {?string} if extraction is succeed returns ID of provided element, otherwise null
   */
  static elementId(element) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Returns ID of the wrapped element
   * @return {string} ID of the wrapped element
   */
  get elementId() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Returns selector of the wrapped element
   * @return {UniversalSelector} selector of the wrapped element
   */
  get selector() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Returns unwrapped elements
   * @return {UnwrappedElement} unwrapped element
   */
  get unwrapped() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Initialize element created from {@link UnwrappedElement} or {@link UniversalSelector}
   * or other kind of supported selector
   * @param {EyesWrappedDriver} driver - instance of {@link EyesWrappedDriver} implementation
   * @return {Promise<this>} initialized element
   */
  async init(driver) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Returns element rect related to context
   * @return {Promise<Region>} rect of the element
   */
  async getRect() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Returns element's content rect related to context
   * @return {Promise<Region>} rect of the element
   */
  async getRect() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Returns element bounds related to context
   * @return {Promise<Region>} bounds of the element
   */
  async getBounds() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Returns element's size
   * @return {Promise<RectangleSize>} size of the element
   */
  async getSize() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Returns element's location related to context
   * @return {Promise<Location>} location of the element
   */
  async getLocation() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Returns computed values for specified css properties
   * @param  {...string} cssPropertyNames - names of css properties
   * @return {Promise<string[]|string>} returns array of css values if multiple properties were specified,
   *  otherwise returns string
   */
  async getCssProperty(...cssPropertyNames) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Returns values for specified element's properties
   * @param  {...string} propertyNames - names of element properties
   * @return {Promise<*[]|*>} returns array of values if multiple properties were specified,
   *  otherwise returns value
   */
  async getProperty(...propertyNames) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Set overflow `hidden` in element's style attribute
   * @return {Promise<?string>}
   */
  async hideScrollbars() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Set original overflow in element's style attribute
   * @return {Promise<void>}
   */
  async restoreScrollbars() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Save current element position for future restoration
   * @param {PositionProvider} - position provider which is implementing specific algorithm
   * @return {Promise<PositionMemento>} current position
   */
  async preservePosition(positionProvider) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Restore previously saved position
   * @param {PositionProvider} - position provider which is implementing specific algorithm
   * @return {Promise<PositionMemento>} current position
   */
  async restorePosition(positionProvider) {
    throw new TypeError('The method is not implemented!')
  }
}

module.exports = EyesWrappedElement
