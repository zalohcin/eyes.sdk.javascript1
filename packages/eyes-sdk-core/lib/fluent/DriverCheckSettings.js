'use strict'

const {Region} = require('@applitools/eyes-common')

const CheckSettings = require('./CheckSettings')
const TargetRegionByElement = require('./TargetRegionByElement')
const IgnoreRegionBySelector = require('./IgnoreRegionBySelector')
const IgnoreRegionByElement = require('./IgnoreRegionByElement')
const FloatingRegionBySelector = require('./FloatingRegionBySelector')
const FloatingRegionByElement = require('./FloatingRegionByElement')
const AccessibilityRegionBySelector = require('./AccessibilityRegionBySelector')
const AccessibilityRegionByElement = require('./AccessibilityRegionByElement')

/**
 * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
 * @typedef {import('../wrappers/EyesWrappedElement').UnwrappedElement} UnwrappedElement
 * @typedef {import('../wrappers/EyesWrappedElement').UniversalSelector} UniversalSelector
 * @typedef {import('../frames/Frame')} Frame
 * @typedef {import('../frames/Frame').FrameReference} FrameReference
 */

/**
 * Reference to the region
 * @typedef {Region|UniversalSelector|UnwrappedElement|EyesWrappedElement} RegionReference
 */

const BEFORE_CAPTURE_SCREENSHOT = 'beforeCaptureScreenshot'

class DriverCheckSettings extends CheckSettings {
  /**
   * @param {EyesWrappedElement} WrappedElement
   * @param {Frame} Frame
   */
  static specialize(WrappedElement, Frame) {
    DriverCheckSettings._WrappedElement = WrappedElement
    DriverCheckSettings._Frame = Frame
  }

  /**
   * Create check settings with bound region and/or frame
   * @param {RegionReference} [region]
   * @param {FrameReference} [frame]
   */
  constructor(region, frame) {
    super()
    /** @type {EyesWrappedElement} */
    this._targetElement = null
    /** @type {Frame[]} */
    this._frameChain = []

    if (region) {
      this.region(region)
    }
    if (frame) {
      this.frame(frame)
    }
  }

  /**
   * Create check settings without target
   * @return {DriverCheckSettings} check settings object
   */
  static window() {
    return new DriverCheckSettings()
  }

  /**
   * Create check settings with bound region and frame
   * @param {RegionReference} region
   * @param {FrameReference} [frame]
   * @return {DriverCheckSettings} check settings object
   */
  static region(region, frame) {
    return new DriverCheckSettings(region, frame)
  }

  /**
   * Create check settings with bound frame
   * @param {FrameReference} frame
   * @return {DriverCheckSettings} check settings object
   */
  static frame(frame) {
    return new DriverCheckSettings(null, frame)
  }

  /**
   * Get specified implementation of {@link EyesWrappedElement}
   * @return {EyesWrappedElement} specified implementation of {@link EyesWrappedElement}
   */
  get WrappedElement() {
    if (!DriverCheckSettings._WrappedElement) {
      throw new TypeError('You need first specialize EyesWrappedElement implementation')
    }
    return DriverCheckSettings._WrappedElement
  }

  /**
   * Get specified {@link Frame} class
   * @return {EyesWrappedElement} specified {@link Frame} class
   */
  get Frame() {
    if (!DriverCheckSettings._WrappedElement) {
      throw new TypeError('You need first specialize Frame class')
    }
    return DriverCheckSettings._Frame
  }

  /**
   * Adds a region to ignore
   * @override
   * @param {RegionReference} region - region reference to ignore when validating the screenshot
   * @return {this} this instance for chaining
   */
  ignoreRegion(region) {
    let ignoreRegion
    if (DriverCheckSettings.WrappedElement.isSelector(region)) {
      ignoreRegion = new IgnoreRegionBySelector(region)
    } else if (DriverCheckSettings.WrappedElement.isCompatible(region)) {
      ignoreRegion = new IgnoreRegionByElement(
        DriverCheckSettings.WrappedElement.fromElement(region),
      )
    } else {
      return super.ignoreRegion(region)
    }
    this._ignoreRegions.push(ignoreRegion)

    return this
  }

  /**
   * Adds a layout region
   * @override
   * @param {RegionReference} region - region reference to match as layout when validating the screenshot
   * @return {this} this instance for chaining
   */
  layoutRegion(region) {
    let layoutRegion
    if (DriverCheckSettings.WrappedElement.isSelector(region)) {
      layoutRegion = new IgnoreRegionBySelector(region)
    } else if (DriverCheckSettings.WrappedElement.isCompatible(region)) {
      layoutRegion = new IgnoreRegionByElement(
        DriverCheckSettings.WrappedElement.fromElement(region),
      )
    } else {
      return super.layoutRegion(region)
    }
    this._layoutRegions.push(layoutRegion)

    return this
  }

  /**
   * Adds a strict region
   * @param {RegionReference} region - region reference to match as strict when validating the screenshot
   * @return {this} this instance for chaining
   */
  strictRegion(region) {
    let strictRegion
    if (DriverCheckSettings.WrappedElement.isSelector(region)) {
      strictRegion = new IgnoreRegionBySelector(region)
    } else if (DriverCheckSettings.WrappedElement.isCompatible(region)) {
      strictRegion = new IgnoreRegionByElement(
        DriverCheckSettings.WrappedElement.fromElement(region),
      )
    } else {
      return super.strictRegion(region)
    }
    this._strictRegions.push(strictRegion)

    return this
  }

  /**
   * Adds a content region
   * @param {RegionReference} region - region reference to match as content when validating the screenshot
   * @return {this} this instance for chaining
   */
  contentRegion(region) {
    let contentRegion
    if (DriverCheckSettings.WrappedElement.isSelector(region)) {
      contentRegion = new IgnoreRegionBySelector(region)
    } else if (DriverCheckSettings.WrappedElement.isCompatible(region)) {
      contentRegion = new IgnoreRegionByElement(
        DriverCheckSettings.WrappedElement.fromElement(region),
      )
    } else {
      return super.contentRegion(region)
    }
    this._contentRegions.push(contentRegion)

    return this
  }

  /**
   * Adds a floating region. A floating region is a a region that can be placed within the boundaries
   * of a bigger region
   * @param {RegionReference} region - region reference to mark as float when validating the screenshot
   * @param {number} [maxUpOffset] - how much the content can move up
   * @param {number} [maxDownOffset] - how much the content can move down
   * @param {number} [maxLeftOffset] - how much the content can move to the left
   * @param {number} [maxRightOffset] - how much the content can move to the right
   * @return {this} this instance for chaining
   */
  floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    let floatingRegion
    if (DriverCheckSettings.WrappedElement.isSelector(region)) {
      floatingRegion = new FloatingRegionBySelector(
        region,
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset,
      )
    } else if (DriverCheckSettings.WrappedElement.isCompatible(region)) {
      floatingRegion = new FloatingRegionByElement(
        DriverCheckSettings.WrappedElement.fromElement(region),
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset,
      )
    } else {
      return super.floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset)
    }
    this._floatingRegions.push(floatingRegion)

    return this
  }

  /**
   * Adds an accessibility region. An accessibility region is a region that has an accessibility type
   * @param {RegionReference} region - region reference of content rectangle or region container
   * @param {AccessibilityRegionType} [regionType] - type of accessibility
   * @return {this} this instance for chaining
   */
  accessibilityRegion(region, regionType) {
    let accessibilityRegion
    if (DriverCheckSettings.WrappedElement.isSelector(region)) {
      accessibilityRegion = new AccessibilityRegionBySelector(region, regionType)
    } else if (DriverCheckSettings.WrappedElement.isCompatible(region)) {
      accessibilityRegion = new AccessibilityRegionByElement(
        DriverCheckSettings.WrappedElement.fromElement(region),
        regionType,
      )
    } else {
      return super.accessibilityRegion(region, regionType)
    }
    this._accessibilityRegions.push(accessibilityRegion)

    return this
  }

  /**
   * @param {RegionReference} region
   * @returns {this}
   */
  region(region) {
    if (Region.isRegionCompatible(region)) {
      this._targetRegion = new Region(region)
    } else if (DriverCheckSettings.WrappedElement.isSelector(region)) {
      this._targetElement = DriverCheckSettings.WrappedElement.fromSelector(region)
    } else if (DriverCheckSettings.WrappedElement.isCompatible(region)) {
      this._targetElement = DriverCheckSettings.WrappedElement.fromElement(region)
    } else {
      throw new TypeError('region method called with argument of unknown type!')
    }
    return this
  }

  /**
   * @param {FrameReference} frame - the frame to switch to
   * @returns {this}
   */
  frame(frameReference) {
    if (DriverCheckSettings.Frame.isReference(frameReference)) {
      this._frameChain.push(DriverCheckSettings.Frame.fromReference(frameReference))
    } else {
      throw new TypeError('frame method called with argument of unknown type!')
    }
    return this
  }

  /**
   * @param {UniversalSelector|UnwrappedElement|EyesWrappedElement} element
   * @return {this}
   */
  scrollRootElement(element) {
    let scrollRootElement
    if (DriverCheckSettings.WrappedElement.isSelector(element)) {
      scrollRootElement = DriverCheckSettings.WrappedElement.fromSelector(element)
    } else if (DriverCheckSettings.WrappedElement.isCompatible(element)) {
      scrollRootElement = DriverCheckSettings.WrappedElement.fromElement(element)
    } else {
      throw new TypeError('scrollRootElement method called with argument of unknown type!')
    }

    if (this._frameChain.length === 0) {
      this._scrollRootElement = scrollRootElement
    } else {
      const frameReference = this._frameChain[this._frameChain.length - 1]
      frameReference.scrollRootElement = scrollRootElement
    }

    return this
  }

  /**
   * @ignore
   * @return {Promise<EyesWrappedElement>}
   */
  getScrollRootElement() {
    return this._scrollRootElement
  }

  /**
   * @return {?TargetRegionByElement}
   */
  getTargetProvider() {
    if (this._targetElement) {
      return new TargetRegionByElement(this._targetElement)
    }
  }

  /**
   * @return {EyesWrappedElement}
   */
  get targetElement() {
    return this._targetElement
  }

  /**
   * @return {Frame[]}
   */
  getFrameChain() {
    return this._frameChain
  }

  /**
   * @return {Frame[]}
   */
  get frameChain() {
    return Array.from(this._frameChain)
  }

  _getTargetType() {
    return !this._targetRegion && !this._targetElement ? 'window' : 'region'
  }

  /**
   * @param {string} script
   */
  addScriptHook(script) {
    let scripts = this._scriptHooks.get(BEFORE_CAPTURE_SCREENSHOT)
    if (scripts == null) {
      scripts = []
      this._scriptHooks.set(BEFORE_CAPTURE_SCREENSHOT, scripts)
    }
    scripts.add(script)
  }

  /**
   * @deprecated
   * @param {String} hook
   * @return {this}
   */
  webHook(hook) {
    return this.beforeRenderScreenshotHook(hook)
  }

  /**
   * @param {String} hook
   * @return {this}
   */
  beforeRenderScreenshotHook(hook) {
    this._scriptHooks[BEFORE_CAPTURE_SCREENSHOT] = hook
    return this
  }

  /**
   * @ignore
   * @return {Map<string, string>}
   */
  getScriptHooks() {
    return this._scriptHooks
  }
}

module.exports = DriverCheckSettings
