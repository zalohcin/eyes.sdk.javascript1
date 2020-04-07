'use strict'

/**
 * An interface for driver wrappers
 *
 * @ignore
 * @interface
 */
class EyesWrappedDriver {
  /**
   * @return {Object} unwrapped driver for specific SDK
   */
  get unwrapped() {}
  /**
   * @return {EyesJsExecutor} implementation of JavaScript executor interface for specific SDK
   */
  get executor() {}
  /**
   * @return {EyesBrowsingContext} implementation of browsing context switcher interface for specific SDK
   */
  get context() {}
  /**
   * @return {EyesElementFinder} implementation of element finder interface for specific SDK
   */
  get finder() {}
}

exports.EyesWrappedDriver = EyesWrappedDriver
