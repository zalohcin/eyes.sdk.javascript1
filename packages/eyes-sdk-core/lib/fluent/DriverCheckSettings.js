'use strict'
const Region = require('../geometry/Region')
const MatchLevel = require('../config/MatchLevel')
const CoordinatesType = require('../geometry/CoordinatesType')
const FloatingMatchSettings = require('../config/FloatingMatchSettings')
const AccessibilityMatchSettings = require('../config/AccessibilityMatchSettings')
const TargetRegionByElement = require('./TargetRegionByElement')
const GetRegion = require('./GetRegion')
const IgnoreRegionByRectangle = require('./IgnoreRegionByRectangle')
const IgnoreRegionBySelector = require('./IgnoreRegionBySelector')
const IgnoreRegionByElement = require('./IgnoreRegionByElement')
const GetFloatingRegion = require('./GetFloatingRegion')
const FloatingRegionByRectangle = require('./FloatingRegionByRectangle')
const FloatingRegionBySelector = require('./FloatingRegionBySelector')
const FloatingRegionByElement = require('./FloatingRegionByElement')
const GetAccessibilityRegion = require('./GetAccessibilityRegion')
const AccessibilityRegionByRectangle = require('./AccessibilityRegionByRectangle')
const AccessibilityRegionBySelector = require('./AccessibilityRegionBySelector')
const AccessibilityRegionByElement = require('./AccessibilityRegionByElement')
const GeneralUtils = require('../utils/GeneralUtils')

/**
 * @typedef {import('../geometry/Region')} Region
 */

/**
 * @template Element, Selector
 * @typedef {import('../wrappers/EyesWrappedElement')<any, Element, Selector>} EyesWrappedElement
 */

/**
 * @template Element, Selector
 * @typedef {import('../frames/Frame')<any, Element, Selector>} Frame
 */

/**
 * @template Element, Selector
 * @typedef {import('../frames/Frame').FrameReference<any, Element, Selector>} FrameReference
 */

/**
 * @template Element, Selector
 * @typedef {EyesWrappedElement<Element, Selector>|Element|Selector} ElementReference
 */

/**
 * @template Element, Selector
 * @typedef {ElementReference<Element, Selector>|Region} RegionReference
 */

/**
 * @template Element, Selector
 * @typedef FloatingRegionReference
 * @prop {RegionReference<Element, Selector>} region
 * @prop {number} [maxUpOffset] - how much the content can move up
 * @prop {number} [maxDownOffset] - how much the content can move down
 * @prop {number} [maxLeftOffset] - how much the content can move to the left
 * @prop {number} [maxRightOffset] - how much the content can move to the right
 */

/**
 * @template Element, Selector
 * @typedef AccessibilityRegionReference
 * @prop {RegionReference<Element, Selector>} region
 * @prop {AccessibilityRegionType} [type]
 */

/**
 * @template Element, Selector
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
 * @prop {RegionReference<Element, Selector>} [region]
 * @prop {({frame: FrameReference<Element, Selector>, scrollRootElement?: ElementReference<Element, Selector>}|FrameReference<Element, Selector>)[]} [frames]
 * @prop {ElementReference<Element, Selector>} [scrollRootElement]
 * @prop {RegionReference<Element, Selector>[]} [ignoreRegions]
 * @prop {RegionReference<Element, Selector>[]} [layoutRegion]
 * @prop {RegionReference<Element, Selector>[]} [strictRegions]
 * @prop {RegionReference<Element, Selector>[]} [contentRegions]
 * @prop {(FloatingRegionReference<Element, Selector>|RegionReference<Element, Selector>)[]} [floatingRegions]
 * @prop {(AccessibilityRegionReference<Element, Selector>|RegionReference<Element, Selector>)[]} [accessibilityRegions]
 */

/**
 * @template Element, Selector
 * @typedef SpecCheckSettings
 * @prop {(selector) => boolean} isSelector - return true if the value is a valid selector, false otherwise
 * @prop {(element) => boolean} isCompatibleElement - return true if the value is an element, false otherwise
 * @prop {(reference) => boolean} isFrameReference - return true if the value is a frame reference, false otherwise
 * @prop {(selector: Selector) => EyesWrappedElement<Element, Selector>} createElementFromSelector - return partially created element
 * @prop {(element: Element) => EyesWrappedElement<Element, Selector>} createElementFromElement - return partially created element
 * @prop {(reference: FrameReference<Element, Selector>) => Frame<Element, Selector>} createFrameReference - return frame reference
 */

const BEFORE_CAPTURE_SCREENSHOT = 'beforeCaptureScreenshot'

/**
 * @template Element - Element provided by wrapped framework
 * @template Selector - Selector supported by framework
 */
class CheckSettings {
  /**
   * @template Element, Selector
   * @param {SpecCheckSettings<Element, Selector>} spec
   * @return {typeof CheckSettings<Element, Selector>} specialized version of this class
   */
  static specialize(spec) {
    return class extends CheckSettings {
      /** @override */
      get spec() {
        return spec
      }
    }
  }
  /** @type {SpecCheckSettings<Element, Selector>} */
  get spec() {
    throw new TypeError('CheckSettings is not specialized')
  }
  /**
   * Create check settings with bound region and/or frame
   * @param {PlainCheckSettings<Element, Selector>} [checkSettings]
   */
  constructor(checkSettings) {
    if (checkSettings instanceof CheckSettings) {
      return checkSettings
    } else if (checkSettings) {
      return this.constructor.from(checkSettings)
    }
    /** @private @type {EyesWrappedElement<Element, Selector>} */
    this._targetElement = null
    /** @private @type {Region} */
    this._targetRegion = null
    /** @private @type {Frame<Element, Selector>[]} */
    this._frameChain = []
    /** @private @type {GetRegion[]} */
    this._ignoreRegions = []
    /** @private @type {GetRegion[]} */
    this._layoutRegions = []
    /** @private @type {GetRegion[]} */
    this._strictRegions = []
    /** @private @type {GetRegion[]} */
    this._contentRegions = []
    /** @private @type {GetFloatingRegion[]} */
    this._floatingRegions = []
    /** @private @type {GetAccessibilityRegion[]} */
    this._accessibilityRegions = []
    /** @private @type {EyesWrappedElement<Element, Selector>} */
    this._scrollRootElement = null
    /** @private @type {string} */
    this._name = undefined
    /** @private @type {number} */
    this._timeout = undefined
    /** @private @type {boolean} */
    this._sendDom = undefined
    /** @private @type {MatchLevel} */
    this._matchLevel = undefined
    /** @private @type {AccessibilityLevel} */
    this._accessibilityLevel = undefined
    /** @private @type {boolean} */
    this._useDom = undefined
    /** @private @type {boolean} */
    this._enablePatterns = undefined
    /** @private @type {boolean} */
    this._ignoreDisplacements = undefined
    /** @private @type {boolean} */
    this._ignoreCaret = true
    /** @private @type {boolean} */
    this._stitchContent = false
    /** @private @type {string} */
    this._renderId = undefined
    /** @private @type {Object<string, string>} */
    this._scriptHooks = {}
  }
  /**
   * Create check settings from an object
   * @template Element, Selector
   * @param {PlainCheckSettings<Element, Selector>} object
   * @return {CheckSettings<Element, Selector>} check settings instance
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
   * @template Element, Selector
   * @return {CheckSettings<Element, Selector>} check settings object
   */
  static window() {
    return new this()
  }
  /**
   * Create check settings with bound region and frame
   * @template Element, Selector
   * @param {RegionReference<Element, Selector>} region
   * @param {FrameReference<Element, Selector>} [frame]
   * @return {CheckSettings<Element, Selector>} check settings object
   */
  static region(region, frame) {
    return frame ? new this().frame(frame).region(region) : new this().region(region)
  }
  /**
   * Create check settings with bound frame
   * @template Element, Selector
   * @param {FrameReference<Element, Selector>} frame
   * @return {CheckSettings<Element, Selector>} check settings object
   */
  static frame(frame) {
    return new this().frame(frame)
  }
  /**
   * @param {RegionReference<Element, Selector>} region
   * @return {this}
   */
  region(region) {
    if (Region.isRegionCompatible(region)) {
      this._targetRegion = new Region(region)
      this._targetRegion.setCoordinatesType(CoordinatesType.CONTEXT_RELATIVE)
    } else if (this.spec.isSelector(region)) {
      this._targetElement = this.spec.createElementFromSelector(region)
    } else if (this.spec.isCompatibleElement(region)) {
      this._targetElement = this.spec.createElementFromElement(region)
    } else {
      throw new TypeError('region method called with argument of unknown type!')
    }
    return this
  }
  /**
   * @private
   * @return {TargetRegionByElement}
   */
  getTargetProvider() {
    if (this._targetElement) {
      return new TargetRegionByElement(this._targetElement)
    }
  }
  /**
   * @private
   * @return {Region}
   */
  getTargetRegion() {
    return this._targetRegion
  }
  /**
   * @private
   * @type {EyesWrappedElement<Element, Selector>}
   */
  get targetElement() {
    return this._targetElement
  }
  /**
   * @param {FrameReference<Element, Selector>} frameReference - the frame to switch to
   * @return {this}
   */
  frame(frameReference) {
    if (this.spec.isFrameReference(frameReference)) {
      this._frameChain.push(this.spec.createFrameReference(frameReference))
    } else {
      throw new TypeError('frame method called with argument of unknown type!')
    }
    return this
  }
  /**
   * @private
   * @return {Frame<Element, Selector>[]}
   */
  getFrameChain() {
    return this._frameChain
  }
  /**
   * @private
   * @type {Frame<Element, Selector>[]}
   */
  get frameChain() {
    return Array.from(this._frameChain)
  }
  /**
   * Adds a region to ignore
   * @param {RegionReference<Element, Selector>} region - region reference to ignore when validating the screenshot
   * @return {this} this instance for chaining
   */
  ignoreRegion(region) {
    let ignoreRegion
    if (region instanceof GetRegion) {
      ignoreRegion = region
    } else if (Region.isRegionCompatible(region)) {
      ignoreRegion = new IgnoreRegionByRectangle(new Region(region))
    } else if (this.spec.isSelector(region)) {
      ignoreRegion = new IgnoreRegionBySelector(region)
    } else if (this.spec.isCompatibleElement(region)) {
      ignoreRegion = new IgnoreRegionByElement(this.spec.createElementFromElement(region))
    } else {
      throw new TypeError('Method called with argument of unknown type!')
    }
    this._ignoreRegions.push(ignoreRegion)

    return this
  }
  /**
   * Adds a region to ignore
   * @param {RegionReference<Element, Selector>} region - region reference to ignore when validating the screenshot
   * @return {this} this instance for chaining
   */
  ignore(region) {
    return this.ignoreRegion(region)
  }
  /**
   * Adds one or more ignore regions.
   * @param {RegionReference<Element, Selector>[]} regions - region references to ignore when validating the screenshot.
   * @return {this} this instance of the settings object.
   */
  ignoreRegions(...regions) {
    regions.forEach(region => this.ignoreRegion(region))
    return this
  }
  /**
   * Adds one or more ignore regions.
   * @param {RegionReference<Element, Selector>[]} regions - region references to ignore when validating the screenshot.
   * @return {this} this instance of the settings object.
   */
  ignores(...regions) {
    return this.ignoreRegions(...regions)
  }
  /**
   * @private
   * @return {GetRegion[]}
   */
  getIgnoreRegions() {
    return this._ignoreRegions
  }
  /**
   * Adds a layout region
   * @param {RegionReference<Element, Selector>} region - region reference to match as layout when validating the screenshot
   * @return {this} this instance for chaining
   */
  layoutRegion(region) {
    let layoutRegion
    if (region instanceof GetRegion) {
      layoutRegion = region
    } else if (Region.isRegionCompatible(region)) {
      layoutRegion = new IgnoreRegionByRectangle(new Region(region))
    } else if (this.spec.isSelector(region)) {
      layoutRegion = new IgnoreRegionBySelector(region)
    } else if (this.spec.isCompatibleElement(region)) {
      layoutRegion = new IgnoreRegionByElement(this.spec.createElementFromElement(region))
    } else {
      throw new TypeError('Method called with argument of unknown type!')
    }
    this._layoutRegions.push(layoutRegion)

    return this
  }
  /**
   * Adds one or more layout regions.
   * @param {RegionReference<Element, Selector>[]} regions - region references to match using the Layout method.
   * @return {this} this instance of the settings object.
   */
  layoutRegions(...regions) {
    regions.forEach(region => this.layoutRegion(region))
    return this
  }
  /**
   * @private
   * @return {GetRegion[]}
   */
  getLayoutRegions() {
    return this._layoutRegions
  }
  /**
   * Adds a strict region
   * @param {RegionReference<Element, Selector>} region - region reference to match as strict when validating the screenshot
   * @return {this} this instance for chaining
   */
  strictRegion(region) {
    let strictRegion
    if (region instanceof GetRegion) {
      strictRegion = region
    } else if (Region.isRegionCompatible(region)) {
      strictRegion = new IgnoreRegionByRectangle(new Region(region))
    } else if (this.spec.isSelector(region)) {
      strictRegion = new IgnoreRegionBySelector(region)
    } else if (this.spec.isCompatibleElement(region)) {
      strictRegion = new IgnoreRegionByElement(this.spec.createElementFromElement(region))
    } else {
      throw new TypeError('Method called with argument of unknown type!')
    }
    this._strictRegions.push(strictRegion)

    return this
  }
  /**
   * @private
   * @return {GetRegion[]}
   */
  getStrictRegions() {
    return this._strictRegions
  }
  /**
   * Adds one or more strict regions.
   * @param {RegionReference<Element, Selector>[]} regions - region references to match using the Strict method.
   * @return {this} this instance of the settings object.
   */
  strictRegions(...regions) {
    regions.forEach(region => this.strictRegion(region))
    return this
  }
  /**
   * Adds a content region
   * @param {RegionReference<Element, Selector>} region - region reference to match as content when validating the screenshot
   * @return {this} this instance for chaining
   */
  contentRegion(region) {
    let contentRegion
    if (region instanceof GetRegion) {
      contentRegion = region
    } else if (Region.isRegionCompatible(region)) {
      contentRegion = new IgnoreRegionByRectangle(new Region(region))
    } else if (this.spec.isSelector(region)) {
      contentRegion = new IgnoreRegionBySelector(region)
    } else if (this.spec.isCompatibleElement(region)) {
      contentRegion = new IgnoreRegionByElement(this.spec.createElementFromElement(region))
    } else {
      throw new TypeError('Method called with argument of unknown type!')
    }
    this._contentRegions.push(contentRegion)

    return this
  }
  /**
   * Adds one or more content regions.
   * @param {RegionReference<Element, Selector>[]} regions - region references to match using the Content method.
   * @return {this} this instance of the settings object.
   */
  contentRegions(...regions) {
    regions.forEach(region => this.contentRegion(region))
    return this
  }
  /**
   * @private
   * @return {GetRegion[]}
   */
  getContentRegions() {
    return this._contentRegions
  }
  /**
   * Adds a floating region. A floating region is a a region that can be placed within the boundaries
   * of a bigger region
   * @param {RegionReference<Element, Selector>} region - region reference to mark as float when validating the screenshot
   * @param {number} [maxUpOffset] - how much the content can move up
   * @param {number} [maxDownOffset] - how much the content can move down
   * @param {number} [maxLeftOffset] - how much the content can move to the left
   * @param {number} [maxRightOffset] - how much the content can move to the right
   * @return {this} this instance for chaining
   */
  floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    let floatingRegion
    if (region instanceof GetFloatingRegion) {
      floatingRegion = region
    } else if (region instanceof FloatingMatchSettings) {
      floatingRegion = new FloatingRegionByRectangle(
        region.getRegion(),
        region.getMaxUpOffset(),
        region.getMaxDownOffset(),
        region.getMaxLeftOffset(),
        region.getMaxRightOffset(),
      )
    } else if (Region.isRegionCompatible(region)) {
      floatingRegion = new FloatingRegionByRectangle(
        new Region(region),
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset,
      )
    } else if (this.spec.isSelector(region)) {
      floatingRegion = new FloatingRegionBySelector(
        region,
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset,
      )
    } else if (this.spec.isCompatibleElement(region)) {
      floatingRegion = new FloatingRegionByElement(
        this.spec.createElementFromElement(region),
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset,
      )
    } else {
      throw new TypeError('Method called with argument of unknown type!')
    }
    this._floatingRegions.push(floatingRegion)

    return this
  }
  /**
   * Adds a floating region. A floating region is a a region that can be placed within the boundaries
   * of a bigger region
   * @param {RegionReference<Element, Selector>} region - region reference to mark as float when validating the screenshot
   * @param {number} [maxUpOffset] - how much the content can move up
   * @param {number} [maxDownOffset] - how much the content can move down
   * @param {number} [maxLeftOffset] - how much the content can move to the left
   * @param {number} [maxRightOffset] - how much the content can move to the right
   * @return {this} this instance for chaining
   */
  floating(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    return this.floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset)
  }
  /**
   * Adds one or more floating regions. A floating region is a a region that can be placed within the boundaries
   * of a bigger region.
   * @param {number} maxOffset - how much each of the content rectangles can move in any direction.
   * @param {RegionReference<Element, Selector>[]} regions - one or more content rectangles or region containers
   * @return {this} this instance of the settings object.
   */
  floatingRegions(maxOffset, ...regions) {
    regions.forEach(region =>
      this.floatingRegion(region, maxOffset, maxOffset, maxOffset, maxOffset),
    )
    return this
  }
  /**
   * Adds one or more floating regions. A floating region is a a region that can be placed within the boundaries
   * of a bigger region.
   * @param {number} maxOffset - how much each of the content rectangles can move in any direction.
   * @param {RegionReference<Element, Selector>[]} regions - one or more content rectangles or region containers
   * @return {this} this instance of the settings object.
   */
  floatings(maxOffset, ...regions) {
    return this.floatingRegions(maxOffset, ...regions)
  }
  /**
   * @private
   * @return {GetFloatingRegion[]}
   */
  getFloatingRegions() {
    return this._floatingRegions
  }
  /**
   * Adds an accessibility region. An accessibility region is a region that has an accessibility type
   * @param {RegionReference<Element, Selector>} region - region reference of content rectangle or region container
   * @param {AccessibilityRegionType} [regionType] - type of accessibility
   * @return {this} this instance for chaining
   */
  accessibilityRegion(region, regionType) {
    let accessibilityRegion
    if (region instanceof GetAccessibilityRegion) {
      accessibilityRegion = region
    } else if (region instanceof AccessibilityMatchSettings) {
      accessibilityRegion = new AccessibilityRegionByRectangle(region.getRegion(), region.getType())
    } else if (Region.isRegionCompatible(region)) {
      accessibilityRegion = new AccessibilityRegionByRectangle(new Region(region), regionType)
    } else if (this.spec.isSelector(region)) {
      accessibilityRegion = new AccessibilityRegionBySelector(region, regionType)
    } else if (this.spec.isCompatibleElement(region)) {
      accessibilityRegion = new AccessibilityRegionByElement(
        this.spec.createElementFromElement(region),
        regionType,
      )
    } else {
      throw new TypeError('Method called with argument of unknown type!')
    }
    this._accessibilityRegions.push(accessibilityRegion)

    return this
  }
  /**
   * Adds an accessibility region. An accessibility region is a region that has an accessibility type
   * @param {RegionReference<Element, Selector>} region - region reference of content rectangle or region container
   * @param {AccessibilityRegionType} [regionType] - type of accessibility
   * @return {this} this instance for chaining
   */
  accessibility(region, regionType) {
    return this.accessibilityRegion(region, regionType)
  }
  /**
   * @private
   * @return {GetAccessibilityRegion[]}
   */
  getAccessibilityRegions() {
    return this._accessibilityRegions
  }
  /**
   * @param {ElementReference<Element, Selector>} element
   * @return {this}
   */
  scrollRootElement(element) {
    let scrollRootElement
    if (this.spec.isSelector(element)) {
      scrollRootElement = this.spec.createElementFromSelector(element)
    } else if (this.spec.isCompatibleElement(element)) {
      scrollRootElement = this.spec.createElementFromElement(element)
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
   * @private
   * @return {Promise<EyesWrappedElement<Element, Selector>>}
   */
  getScrollRootElement() {
    return this._scrollRootElement
  }
  /**
   * A setter for the checkpoint name.
   * @param {string} name - A name by which to identify the checkpoint.
   * @return {this} - This instance of the settings object.
   */
  withName(name) {
    this._name = name
    return this
  }
  /**
   * @private
   * @return {string}
   */
  getName() {
    return this._name
  }
  /**
   * Defines whether to send the document DOM or not.
   * @param {boolean} [sendDom=true] - When {@code true} sends the DOM to the server (the default).
   * @return {this} - This instance of the settings object.
   */
  sendDom(sendDom = true) {
    this._sendDom = sendDom
    return this
  }
  /**
   * @private
   * @return {boolean}
   */
  getSendDom() {
    return this._sendDom
  }
  /**
   * Set the render ID of the screenshot.
   * @param {string} renderId - The render ID to use.
   * @return {this} - This instance of the settings object.
   */
  renderId(renderId) {
    this._renderId = renderId
    return this
  }
  /**
   * @private
   * @return {string}
   */
  getRenderId() {
    return this._renderId
  }
  /**
   * Set the match level by which to compare the screenshot.
   * @param {MatchLevel} matchLevel - The match level to use.
   * @return {this} - This instance of the settings object.
   */
  matchLevel(matchLevel) {
    this._matchLevel = matchLevel
    return this
  }
  /**
   * Shortcut to set the match level to {@code MatchLevel.LAYOUT}.
   * @return {this} - This instance of the settings object.
   */
  layout() {
    this._matchLevel = MatchLevel.Layout
    return this
  }
  /**
   * Shortcut to set the match level to {@code MatchLevel.EXACT}.
   * @return {this} - This instance of the settings object.
   */
  exact() {
    this._matchLevel = MatchLevel.Exact
    return this
  }
  /**
   * Shortcut to set the match level to {@code MatchLevel.STRICT}.
   * @return {this} - This instance of the settings object.
   */
  strict() {
    this._matchLevel = MatchLevel.Strict
    return this
  }
  /**
   * Shortcut to set the match level to {@code MatchLevel.CONTENT}.
   * @return {this} - This instance of the settings object.
   */
  content() {
    this._matchLevel = MatchLevel.Content
    return this
  }
  /**
   * @private
   * @return {MatchLevel}
   */
  getMatchLevel() {
    return this._matchLevel
  }
  /**
   * Defines if to detect and ignore a blinking caret in the screenshot.
   * @param {boolean} [ignoreCaret=true] - Whether or not to detect and ignore a blinking caret in the screenshot.
   * @return {this} - This instance of the settings object.
   */
  ignoreCaret(ignoreCaret = true) {
    this._ignoreCaret = ignoreCaret
    return this
  }
  /**
   * @private
   * @return {boolean}
   */
  getIgnoreCaret() {
    return this._ignoreCaret
  }
  /**
   * Defines that the screenshot will contain the entire element or region, even if it's outside the view.
   * @param {boolean} [fully=true]
   * @return {this} - This instance of the settings object.
   */
  fully(fully = true) {
    this._stitchContent = fully
    return this
  }
  /**
   * @param {boolean} [stitchContent=true]
   * @return {this}
   */
  stitchContent(stitchContent = true) {
    return this.fully(stitchContent)
  }
  /**
   * @private
   * @return {boolean}
   */
  getStitchContent() {
    return this._stitchContent
  }
  /**
   * Defines useDom for enabling the match algorithm to use dom.
   * @param {boolean} [useDom=true]
   * @return {this} - This instance of the settings object.
   */
  useDom(useDom = true) {
    this._useDom = useDom
    return this
  }
  /**
   * @private
   * @return {boolean}
   */
  getUseDom() {
    return this._useDom
  }
  /**
   * Enabling the match algorithms for pattern detection
   * @param {boolean} [enablePatterns=true]
   * @return {this} - This instance of the settings object.
   */
  enablePatterns(enablePatterns = true) {
    this._enablePatterns = enablePatterns
    return this
  }
  /**
   * @private
   * @return {boolean}
   */
  getEnablePatterns() {
    return this._enablePatterns
  }
  /**
   * @param {boolean} [ignoreDisplacements=true]
   * @return {this} - This instance of the settings object.
   */
  ignoreDisplacements(ignoreDisplacements = true) {
    this._ignoreDisplacements = ignoreDisplacements
    return this
  }
  /**
   * @private
   * @return {boolean}
   */
  getIgnoreDisplacements() {
    return this._ignoreDisplacements
  }
  /**
   * Defines the timeout to use when acquiring and comparing screenshots.
   * @param {number} timeoutMilliseconds - The timeout to use in milliseconds.
   * @return {this} - This instance of the settings object.
   */
  timeout(timeoutMilliseconds = -1) {
    this._timeout = timeoutMilliseconds
    return this
  }
  /**
   * @private
   * @return {number}
   */
  getTimeout() {
    return this._timeout
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
   * @param {String} hook
   * @return {this}
   */
  beforeRenderScreenshotHook(hook) {
    return this.hook(BEFORE_CAPTURE_SCREENSHOT, hook)
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
   * @private
   * @return {Map<string, string>}
   */
  getScriptHooks() {
    return this._scriptHooks
  }
  /**
   * @override
   */
  toString() {
    return `${this.constructor.name} ${GeneralUtils.toString(this)}`
  }
  /**
   * @private
   */
  _getTargetType() {
    return !this._targetRegion && !this._targetElement ? 'window' : 'region'
  }
  /**
   * @private
   */
  async toCheckWindowConfiguration(eyesWebDriver) {
    const regions = await this._getPersistedRegions(eyesWebDriver)
    return {
      ...regions,
      target: this._getTargetType(),
      fully: this.getStitchContent(),
      tag: this.getName(),
      scriptHooks: this.getScriptHooks(),
      sendDom: this.getSendDom(),
      matchLevel: this.getMatchLevel(),
    }
  }
  /**
   * @private
   */
  async _getPersistedRegions(eyesWebDriver) {
    const [ignore, floating, strict, layout, content, accessibility] = await Promise.all([
      persistRegions(this.getIgnoreRegions()),
      persistRegions(this.getFloatingRegions()),
      persistRegions(this.getStrictRegions()),
      persistRegions(this.getLayoutRegions()),
      persistRegions(this.getContentRegions()),
      persistRegions(this.getAccessibilityRegions()),
    ])

    return {ignore, floating, strict, layout, content, accessibility}

    async function persistRegions(regions) {
      const persisted = await Promise.all(regions.map(r => r.toPersistedRegions(eyesWebDriver)))
      return [].concat(...persisted)
    }
  }
}

module.exports = CheckSettings
