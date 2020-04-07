'use strict'

/**
 * An interface for element finder
 * @ignore
 * @interface
 */
class EyesElementFinder {
  /**
   * Returns first founded element
   * @param {*} _locator locator supported by current SDK
   * @param {EyesWrappedElement|object} _parentElement parent element to search only among child elements
   * @return {Promise<EyesWrappedElement>}
   */
  async findElement(_locator, _parentElement) {}
  /**
   * Returns all founded element
   * @param {*} _locator locator supported by current SDK
   * @param {EyesWrappedElement|object} _parentElement parent element to search only among child elements
   * @return {Promise<Array<EyesWrappedElement>>}
   */
  async findElements(_locator, _parentElement) {}
}

exports.EyesElementFinder = EyesElementFinder
