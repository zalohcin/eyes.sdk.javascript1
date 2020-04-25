'use strict'
/* eslint-disable no-unused-vars */

/**
 * @typedef {import('./EyesWrappedElement')} EyesWrappedElement
 * @typedef {import('./EyesWrappedElement').UnwrappedElement} UnwrappedElement
 * @typedef {import('./EyesWrappedElement').UniversalSelector} UniversalSelector
 */

/**
 * An interface for element finder
 * @interface
 */
class EyesElementFinder {
  /**
   * Returns first founded element
   * @param {UniversalSelector} selector - selector supported by current implementation
   * @param {EyesWrappedElement|UnwrappedElement} parentElement - parent element to search only among child elements
   * @return {Promise<EyesWrappedElement>}
   */
  async findElement(locator, parentElement) {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Returns all founded element
   * @param {UniversalSelector} selector - selector supported by current implementation
   * @param {EyesWrappedElement|UnwrappedElement} parentElement - parent element to search only among child elements
   * @return {Promise<EyesWrappedElement[]>}
   */
  async findElements(locator, parentElement) {
    throw new TypeError('The method is not implemented!')
  }
}

module.exports = EyesElementFinder
