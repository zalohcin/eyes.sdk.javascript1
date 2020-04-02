'use strict'

class FrameLocator {
  constructor() {
    /** @type {EyesWebElement} */
    this._frameElement = null
    /** @type {By} */
    this._frameSelector = null
    /** @type {String} */
    this._frameNameOrId = null
    /** @type {Integer} */
    this._frameIndex = null
    /** @type {EyesWebElement} */
    this._scrollRootElement = undefined
    /** @type {By} */
    this._scrollRootSelector = undefined
  }

  /**
   * @return {EyesWebElement}
   */
  getFrameElement() {
    return this._frameElement
  }

  /**
   * @param frameElement
   */
  setFrameElement(frameElement) {
    this._frameElement = frameElement
  }

  /**
   * @return {By}
   */
  getFrameSelector() {
    return this._frameSelector
  }

  /**
   * @param frameSelector
   */
  setFrameSelector(frameSelector) {
    this._frameSelector = frameSelector
  }

  /**
   * @return {String}
   */
  getFrameNameOrId() {
    return this._frameNameOrId
  }

  /**
   * @param frameNameOrId
   */
  setFrameNameOrId(frameNameOrId) {
    this._frameNameOrId = frameNameOrId
  }

  /**
   * @return {Integer}
   */
  getFrameIndex() {
    return this._frameIndex
  }

  /**
   * @param frameIndex
   */
  setFrameIndex(frameIndex) {
    this._frameIndex = frameIndex
  }

  /**
   * @return {EyesWebElement}
   */
  getScrollRootElement() {
    return this._scrollRootElement
  }

  /**
   * @param {EyesWebElement} scrollRootElement
   */
  setScrollRootElement(scrollRootElement) {
    this._scrollRootElement = scrollRootElement
  }

  /**
   * @return {By}
   */
  getScrollRootSelector() {
    return this._scrollRootSelector
  }

  /**
   * @param {By} scrollRootSelector
   */
  setScrollRootSelector(scrollRootSelector) {
    this._scrollRootSelector = scrollRootSelector
  }
}

module.exports = FrameLocator
