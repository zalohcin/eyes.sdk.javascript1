'use strict'
const Region = require('../geometry/Region')
const CoordinatesType = require('../geometry/CoordinatesType')
const CheckSettings = require('./CheckSettings')
const TargetRegionByElement = require('./TargetRegionByElement')
const IgnoreRegionBySelector = require('./IgnoreRegionBySelector')
const IgnoreRegionByElement = require('./IgnoreRegionByElement')
const FloatingRegionBySelector = require('./FloatingRegionBySelector')
const FloatingRegionByElement = require('./FloatingRegionByElement')
const AccessibilityRegionBySelector = require('./AccessibilityRegionBySelector')
const AccessibilityRegionByElement = require('./AccessibilityRegionByElement')

/**
 * @typedef {import('../geometry/Region')} Region
 */

/**
 * @template E
 * @template S
 * @typedef {import('../frames/Frame')<E,S>} Frame
 */

/**
 * @template E
 * @template S
 * @typedef {import('../wrappers/EyesWrappedElement')<E,S>} EyesWrappedElement
 */

/**
 * @template E
 * @template S
 * @typedef {import('../frames/Frame').FrameReference<E,S>} FrameReference
 */

/**
 * @template E
 * @template S
 * @typedef {E|S|EyesWrappedElement<E,S>} ElementReference
 */

/**
 * @template E
 * @template S
 * @typedef {Region|ElementReference<E,S>} RegionReference
 */

/**
 * @template E
 * @template S
 * @typedef FloatingRegionReference
 * @prop {RegionReference<E,S>} region
 * @prop {number} [maxUpOffset] - how much the content can move up
 * @prop {number} [maxDownOffset] - how much the content can move down
 * @prop {number} [maxLeftOffset] - how much the content can move to the left
 * @prop {number} [maxRightOffset] - how much the content can move to the right
 */

/**
 * @template E
 * @template S
 * @typedef AccessibilityRegionReference
 * @prop {RegionReference<E,S>} region
 * @prop {AccessibilityRegionType} [type]
 */

/**
 * @template E
 * @template S
 * @typedef PlainCheckSettings
 * @prop {string} [name]
 * @prop {MatchLevel} [matchLevel]
 * @prop {number} [timeout=-1]
 * @prop {boolean} [sendDom=true]
 * @prop {boolean} [useDom=true]
 * @prop {boolean} [enablePatterns=true]
 * @prop {boolean} [ignoreDisplacements=true]
 * @prop {boolean} [ignoreCaret=true]
 * @prop {boolean} [isFully=false]
 * @prop {string} [renderId]
 * @prop {{[key: string]: string}} [hooks]
 * @prop {RegionReference<E,S>} [region]
 * @prop {({frame: FrameReference<E,S>, scrollRootElement?: ElementReference<E,S>}|FrameReference<E,S>)[]} [frames]
 * @prop {ElementReference<E,S>} [scrollRootElement]
 * @prop {RegionReference<E,S>[]} [ignoreRegions]
 * @prop {RegionReference<E,S>[]} [layoutRegion]
 * @prop {RegionReference<E,S>[]} [strictRegions]
 * @prop {RegionReference<E,S>[]} [contentRegions]
 * @prop {(FloatingRegionReference<E,S>|RegionReference<E,S>)[]} [floatingRegions]
 * @prop {(AccessibilityRegionReference<E,S>|RegionReference<E,S>)[]} [accessibilityRegions]
 */

/**
 * @template E
 * @template S
 * @typedef SpecsCheckSettings
 * @prop {(selector) => boolean} isSelector - return true if the value is a valid selector, false otherwise
 * @prop {(element) => boolean} isCompatibleElement - return true if the value is an element, false otherwise
 * @prop {(reference) => boolean} isFrameReference - return true if the value is a frame reference, false otherwise
 * @prop {(selector: S) => EyesWrappedElement<E,S>} createElementFromSelector - return partially created element
 * @prop {(element: E) => EyesWrappedElement<E,S>} createElementFromElement - return partially created element
 * @prop {(reference: FrameReference<E,S>) => Frame<E,S>} createFrameReference - return frame reference
 */

const BEFORE_CAPTURE_SCREENSHOT = 'beforeCaptureScreenshot'

/**
 * @template E
 * @template S
 */
class DriverCheckSettings extends CheckSettings {
  /**
   * @template E
   * @template S
   * @param {SpecsCheckSettings<E,S>} SpecsCheckSettings
   * @return {typeof DriverCheckSettings<E,S>} specialized version of this class
   */
  static specialize(SpecsCheckSettings) {
    return class extends DriverCheckSettings {
      /**
       * @override
       * @type {SpecsCheckSettings<E,S>}
       */
      static get specs() {
        return SpecsCheckSettings
      }
      /**
       * @override
       * @type {SpecsCheckSettings<E,S>}
       */
      get specs() {
        return SpecsCheckSettings
      }
    }
  }
  /** @type {SpecsCheckSettings<E,S>} */
  static get specs() {
    throw new TypeError('DriverCheckSettings is not specialized')
  }
  /** @type {SpecsCheckSettings<E,S>} */
  get specs() {
    throw new TypeError('DriverCheckSettings is not specialized')
  }
  /**
   * Create check settings with bound region and/or frame
   * @param {PlainCheckSettings<E,S>} [checkSettings]
   */
  constructor(checkSettings) {
    super()
    if (checkSettings instanceof DriverCheckSettings) {
      return checkSettings
    } else if (checkSettings) {
      return this.constructor.from(checkSettings)
    }
    /** @type {EyesWrappedElement} */
    this._targetElement = null
    /** @type {Frame[]} */
    this._frameChain = []
    /** @type {object<string, string>} */
    this._scriptHooks = {}
  }
  /**
   * Create check settings from an object
   * @template E
   * @template S
   * @param {PlainCheckSettings<E,S>} object
   * @return {DriverCheckSettings<E,S>} check settings instance
   */
  static from(object) {
    const settings = new this()
    if (object.name) {
      settings.withName(object.name)
    }
    if (object.scrollRootElement) {
      settings.scrollRootElement(object.scrollRootElement)
    }
    if (object.hooks) {
      Object.values(object.hooks).forEach(([name, script]) => {
        settings.hook(name, script)
      })
    }
    if (object.region) {
      settings.region(object.region)
    }
    if (object.frames) {
      object.frames.forEach(reference => {
        if (reference.frame) {
          settings.frame(reference.frame)
          if (reference.scrollRootElement) {
            settings.scrollRootElement(reference.scrollRootElement)
          }
        } else {
          settings.frame(reference)
        }
      })
    }
    if (object.ignoreRegions) {
      object.ignoreRegions.forEach(ignoreRegion => settings.ignoreRegion(ignoreRegion))
    }
    if (object.layoutRegions) {
      object.layoutRegions.forEach(layoutRegion => settings.layoutRegion(layoutRegion))
    }
    if (object.strictRegions) {
      object.strictRegions.forEach(strictRegion => settings.strictRegion(strictRegion))
    }
    if (object.contentRegions) {
      object.contentRegions.forEach(contentRegion => settings.contentRegion(contentRegion))
    }
    if (object.floatingRegions) {
      object.floatingRegions.forEach(floatingRegion =>
        floatingRegion.region
          ? settings.floatingRegion(
              floatingRegion.region,
              floatingRegion.maxUpOffset,
              floatingRegion.maxDownOffset,
              floatingRegion.maxLeftOffset,
              floatingRegion.maxRightOffset,
            )
          : settings.floatingRegion(floatingRegion),
      )
    }
    if (object.accessibilityRegions) {
      object.accessibilityRegions.forEach(accessibilityRegion =>
        accessibilityRegion.region
          ? settings.accessibilityRegion(accessibilityRegion.region, accessibilityRegion.type)
          : settings.accessibilityRegion(accessibilityRegion),
      )
    }
    if (object.matchLevel) {
      settings.matchLevel(object.matchLevel)
    }
    if (object.matchLevel) {
      settings.matchLevel(object.matchLevel)
    }
    if (object.timeout) {
      settings.timeout(object.timeout)
    }
    if (object.sendDom) {
      settings.sendDom(object.sendDom)
    }
    if (object.useDom) {
      settings.useDom(object.useDom)
    }
    if (object.enablePatterns) {
      settings.enablePatterns(object.enablePatterns)
    }
    if (object.ignoreDisplacements) {
      settings.ignoreDisplacements(object.ignoreDisplacements)
    }
    if (object.ignoreCaret) {
      settings.ignoreCaret(object.ignoreCaret)
    }
    if (object.renderId) {
      settings.renderId(object.renderId)
    }
    if (object.isFully) {
      settings.fully(object.isFully)
    }
    return settings
  }
  /**
   * Create check settings without target
   * @template E
   * @template S
   * @return {DriverCheckSettings<E,S>} check settings object
   */
  static window() {
    return new this()
  }
  /**
   * Create check settings with bound region and frame
   * @template E
   * @template S
   * @param {RegionReference<E,S>} region
   * @param {FrameReference<E,S>} [frame]
   * @return {DriverCheckSettings<E,S>} check settings object
   */
  static region(region, frame) {
    return frame ? new this().frame(frame).region(region) : new this().region(region)
  }
  /**
   * Create check settings with bound frame
   * @template E
   * @template S
   * @param {FrameReference<E,S>} frame
   * @return {DriverCheckSettings<E,S>} check settings object
   */
  static frame(frame) {
    return new this().frame(frame)
  }
  /**
   * Adds a region to ignore
   * @override
   * @param {RegionReference<E,S>} region - region reference to ignore when validating the screenshot
   * @return {this} this instance for chaining
   */
  ignoreRegion(region) {
    let ignoreRegion
    if (this.specs.isSelector(region)) {
      ignoreRegion = new IgnoreRegionBySelector(region)
    } else if (this.specs.isCompatibleElement(region)) {
      ignoreRegion = new IgnoreRegionByElement(this.specs.createElementFromElement(region))
    } else {
      return super.ignoreRegion(region)
    }
    this._ignoreRegions.push(ignoreRegion)

    return this
  }
  /**
   * Adds a layout region
   * @override
   * @param {RegionReference<E,S>} region - region reference to match as layout when validating the screenshot
   * @return {this} this instance for chaining
   */
  layoutRegion(region) {
    let layoutRegion
    if (this.specs.isSelector(region)) {
      layoutRegion = new IgnoreRegionBySelector(region)
    } else if (this.specs.isCompatibleElement(region)) {
      layoutRegion = new IgnoreRegionByElement(this.specs.createElementFromElement(region))
    } else {
      return super.layoutRegion(region)
    }
    this._layoutRegions.push(layoutRegion)

    return this
  }
  /**
   * Adds a strict region
   * @param {RegionReference<E,S>} region - region reference to match as strict when validating the screenshot
   * @return {this} this instance for chaining
   */
  strictRegion(region) {
    let strictRegion
    if (this.specs.isSelector(region)) {
      strictRegion = new IgnoreRegionBySelector(region)
    } else if (this.specs.isCompatibleElement(region)) {
      strictRegion = new IgnoreRegionByElement(this.specs.createElementFromElement(region))
    } else {
      return super.strictRegion(region)
    }
    this._strictRegions.push(strictRegion)

    return this
  }
  /**
   * Adds a content region
   * @param {RegionReference<E,S>} region - region reference to match as content when validating the screenshot
   * @return {this} this instance for chaining
   */
  contentRegion(region) {
    let contentRegion
    if (this.specs.isSelector(region)) {
      contentRegion = new IgnoreRegionBySelector(region)
    } else if (this.specs.isCompatibleElement(region)) {
      contentRegion = new IgnoreRegionByElement(this.specs.createElementFromElement(region))
    } else {
      return super.contentRegion(region)
    }
    this._contentRegions.push(contentRegion)

    return this
  }
  /**
   * Adds a floating region. A floating region is a a region that can be placed within the boundaries
   * of a bigger region
   * @param {RegionReference<E,S>} region - region reference to mark as float when validating the screenshot
   * @param {number} [maxUpOffset] - how much the content can move up
   * @param {number} [maxDownOffset] - how much the content can move down
   * @param {number} [maxLeftOffset] - how much the content can move to the left
   * @param {number} [maxRightOffset] - how much the content can move to the right
   * @return {this} this instance for chaining
   */
  floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    let floatingRegion
    if (this.specs.isSelector(region)) {
      floatingRegion = new FloatingRegionBySelector(
        region,
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset,
      )
    } else if (this.specs.isCompatibleElement(region)) {
      floatingRegion = new FloatingRegionByElement(
        this.specs.createElementFromElement(region),
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
   * @param {RegionReference<E,S>} region - region reference of content rectangle or region container
   * @param {AccessibilityRegionType} [regionType] - type of accessibility
   * @return {this} this instance for chaining
   */
  accessibilityRegion(region, regionType) {
    let accessibilityRegion
    if (this.specs.isSelector(region)) {
      accessibilityRegion = new AccessibilityRegionBySelector(region, regionType)
    } else if (this.specs.isCompatibleElement(region)) {
      accessibilityRegion = new AccessibilityRegionByElement(
        this.specs.createElementFromElement(region),
        regionType,
      )
    } else {
      return super.accessibilityRegion(region, regionType)
    }
    this._accessibilityRegions.push(accessibilityRegion)

    return this
  }
  /**
   * @param {RegionReference<E,S>} region
   * @return {this}
   */
  region(region) {
    if (Region.isRegionCompatible(region)) {
      this._targetRegion = new Region(region)
      this._targetRegion.setCoordinatesType(CoordinatesType.CONTEXT_RELATIVE)
    } else if (this.specs.isSelector(region)) {
      this._targetElement = this.specs.createElementFromSelector(region)
    } else if (this.specs.isCompatibleElement(region)) {
      this._targetElement = this.specs.createElementFromElement(region)
    } else {
      throw new TypeError('region method called with argument of unknown type!')
    }
    return this
  }
  /**
   * @param {FrameReference<E,S>} frameReference - the frame to switch to
   * @return {this}
   */
  frame(frameReference) {
    if (this.specs.isFrameReference(frameReference)) {
      this._frameChain.push(this.specs.createFrameReference(frameReference))
    } else {
      throw new TypeError('frame method called with argument of unknown type!')
    }
    return this
  }
  /**
   * @param {ElementReference<E,S>} element
   * @return {this}
   */
  scrollRootElement(element) {
    let scrollRootElement
    if (this.specs.isSelector(element)) {
      scrollRootElement = this.specs.createElementFromSelector(element)
    } else if (this.specs.isCompatibleElement(element)) {
      scrollRootElement = this.specs.createElementFromElement(element)
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
   * @return {Promise<EyesWrappedElement<E,S>>}
   */
  getScrollRootElement() {
    return this._scrollRootElement
  }
  /**
   * @return {TargetRegionByElement}
   */
  getTargetProvider() {
    if (this._targetElement) {
      return new TargetRegionByElement(this._targetElement)
    }
  }
  /**
   * @return {EyesWrappedElement<E,S>}
   */
  get targetElement() {
    return this._targetElement
  }
  /**
   * @return {Frame<E,S>[]}
   */
  getFrameChain() {
    return this._frameChain
  }
  /**
   * @return {Frame<E,S>[]}
   */
  get frameChain() {
    return Array.from(this._frameChain)
  }
  _getTargetType() {
    return !this._targetRegion && !this._targetElement ? 'window' : 'region'
  }
  /**
   * @param {string} name
   * @param {string} script
   * @return {this}
   */
  hook(name, script) {
    this._scriptHooks[name] = script
    return this
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
    return this.hook(BEFORE_CAPTURE_SCREENSHOT, hook)
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
