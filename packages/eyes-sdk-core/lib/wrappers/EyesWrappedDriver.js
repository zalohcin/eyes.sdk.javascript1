'use strict'
/* eslint-disable no-unused-vars */

/**
 * @typedef {import('./EyesJsExecutor')} EyesJsExecutor
 * @typedef {import('./EyesBrowsingContext')} EyesBrowsingContext
 * @typedef {import('./EyesElementFinder')} EyesElementFinder
 * @typedef {import('./EyesDriverController')} EyesDriverController
 */

/**
 * An interface for driver wrappers
 *
 * @interface
 */
class EyesWrappedDriver {
  /**
   * @return {Object} unwrapped driver for specific SDK
   */
  get unwrapped() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * @return {EyesJsExecutor} implementation of JavaScript executor interface for specific SDK
   */
  get executor() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * @return {EyesBrowsingContext} implementation of browsing context switcher interface for specific SDK
   */
  get context() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * @return {EyesElementFinder} implementation of element finder interface for specific SDK
   */
  get finder() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * @return {EyesDriverController} implementation of driver controller interface for specific SDK
   */
  get controller() {
    throw new TypeError('The method is not implemented!')
  }
}

module.exports = EyesWrappedDriver
