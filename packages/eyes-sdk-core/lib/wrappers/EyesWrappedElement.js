'use strict'

/**
 * An interface for element wrappers
 * @ignore
 * @interface
 */
class EyesWrappedElement {
  /**
   * Check if object could be wrapped with this class
   * @param {Object} object
   * @return {boolean} true - object could be wrapped with this class, otherwise - false
   */
  static isCompatible(_object) {}
  /**
   * Compare two elements, these elements could be an instances of this class or compatible objects
   * @param {Object|EyesWrappedElement} leftElement
   * @param {Object|EyesWrappedElement} rightElement
   * @return {boolean} true - elements are equal, otherwise - false
   */
  static equals(_leftElement, _rightElement) {}
  /**
   * Extract element ID from this class instance or compatible object
   * @param {Object|EyesWrappedElement} element
   * @return {string|null} if extraction is succeed returns ID of provided element, otherwise null
   */
  static elementId(_element) {}
  /**
   * Returns ID of the wrapped element
   * @return {string} ID of the wrapped element
   */
  get elementId() {}
  /**
   * Returns unwrapped elements
   * @return {Object} unwrapped element
   */
  get unwrapped() {}
  /**
   * Returns element's rect related to context
   * @return {Promise<Region>} rect of the element
   */
  async getRect() {}
  /**
   * Returns element's bounds related to context
   * @return {Promise<Region>} bounds of the element
   */
  async getBounds() {}
  /**
   * Returns element's size
   * @return {Promise<RectangleSize>} size of the element
   */
  async getSize() {}
  /**
   * Returns element's location related to context
   * @return {Promise<Location>} location of the element
   */
  async getLocation() {}
  /**
   * Returns computed values for specified css properties
   * @param  {...string} cssPropertyNames
   * @return {Promise<Array<string>|string>} returns array of css values if multiple properties were specified,
   *  otherwise returns string
   */
  async getCssProperty(..._cssPropertyNames) {}
  /**
   * Returns values for specified element's properties
   * @param  {...string} propertyNames
   * @return {Promise<Array<*>|*>} returns array of values if multiple properties were specified,
   *  otherwise returns value
   */
  async getCssProperty(..._propertyNames) {}
  /**
   * Returns element's overflow from style attribute
   * @return {Promise<string|null>} returns element's overflow if it was specified, otherwise returns null
   */
  async getOverflow() {}
  /**
   * Set overflow in element's style attribute
   * @param {string|null} overflow
   * @return {Promise<void>}
   */
  async setOverflow(_overflow) {}
}

exports.EyesWrappedElement = EyesWrappedElement
