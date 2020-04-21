'use strict'

const {
  TypeUtils,
  CheckSettings,
  FrameLocator,
  Region,
  TargetRegionBySelector,
  TargetRegionByElement,
  IgnoreRegionBySelector,
  IgnoreRegionByElement,
  FloatingRegionBySelector,
  FloatingRegionByElement,
  AccessibilityRegionBySelector,
  AccessibilityRegionByElement,
} = require('@applitools/eyes-sdk-core')
const WDIOElement = require('../wrappers/WDIOElement')
const WDIOElementFinder = require('../wrappers/WDIOElementFinder')

const USE_DEFAULT_MATCH_TIMEOUT = -1
const BEFORE_CAPTURE_SCREENSHOT = 'beforeCaptureScreenshot'

class WebdriverioCheckSettings extends CheckSettings {
  /**
   *
   * @param {Region|By|String|WDIOElement} [region]
   * @param {Integer|String|By|WDIOElement} [frame]
   */
  constructor(region, frame) {
    super()

    /** @type {By|String} */
    this._targetSelector = null
    /** @type {WDIOElement|Object} */
    this._targetElement = null
    this._frameChain = []

    if (region) {
      this.region(region)
    }

    if (frame) {
      this.frame(frame)
    }

    /** @type {Map<string, string>} */ this._scriptHooks = new Map()
  }

  /**
   * @package
   * @ignore
   * @return {?GetSelector}
   */
  getTargetProvider() {
    if (this._targetSelector) {
      return new TargetRegionBySelector(this._targetSelector)
    }

    if (this._targetElement) {
      return new TargetRegionByElement(WDIOElement.partial(this._targetElement))
    }

    return undefined
  }

  /**
   *
   * @param {Region|By|String|WDIOElement} region
   * @returns {WebdriverioCheckSettings}
   */
  region(region) {
    if (Region.isRegionCompatible(region)) {
      super.updateTargetRegion(region)
    } else if (WDIOElementFinder.isLocator(region)) {
      this._targetSelector = region
    } else if (region instanceof WDIOElement || WDIOElement.isCompatible(region)) {
      this._targetElement = WDIOElement.partial(region)
    } else {
      throw new TypeError('region method called with argument of unknown type!')
    }
    return this
  }

  /**
   * @param {Integer|String|By|WDIOElement} frame The frame to switch to.
   * @returns {WebdriverioCheckSettings}
   */
  frame(frame) {
    const fl = new FrameLocator()

    if (TypeUtils.isInteger(frame)) {
      fl.setFrameIndex(frame)
    } else if (TypeUtils.isString(frame)) {
      fl.setFrameNameOrId(frame)
    } else if (WDIOElementFinder.isLocator(frame)) {
      fl.setFrameSelector(frame)
    } else if (frame instanceof WDIOElement || WDIOElement.isCompatible(frame)) {
      fl.setFrameElement(WDIOElement.partial(frame))
    } else {
      throw new TypeError('frame method called with argument of unknown type!')
    }
    this._frameChain.push(fl)
    return this
  }

  /**
   * Adds a region to ignore.
   *
   * @override
   * @param {GetRegion|Region|By|String|WDIOElement|Object} regionOrContainer The region or region container to ignore when validating the screenshot.
   * @return {WebdriverioCheckSettings} This instance of the settings object.
   */
  ignore(region) {
    if (WDIOElementFinder.isLocator(region)) {
      this._ignoreRegions.push(new IgnoreRegionBySelector(region))
    } else if (region instanceof WDIOElement || WDIOElement.isCompatible(region)) {
      const element = WDIOElement.partial(region)
      this._ignoreRegions.push(new IgnoreRegionByElement(element))
    } else {
      super.ignoreRegions(region)
    }

    return this
  }

  /**
   * Adds one or more ignore regions.
   *
   * @override
   * @param {...(GetRegion|Region|By|String|WDIOElement|Object)} regionsOrContainers One or more regions or region containers to ignore when validating the screenshot.
   * @return {WebdriverioCheckSettings} This instance of the settings object.
   */
  ignores(...regionsOrContainers) {
    super.ignoreRegions(...regionsOrContainers)
    return this
  }

  /**
   * @inheritDoc
   * @param {...(GetRegion|Region|By|String|WDIOElement|Object)} regions - A region to ignore when validating.
   * @return {this}
   */
  ignoreRegions(...regions) {
    return super.ignoreRegions(...regions)
  }

  /**
   * @inheritDoc
   * @param {...(GetRegion|Region|By|String|WDIOElement|Object)} regions - A region to match using the Layout method.
   * @return {this}
   */
  layoutRegions(...regions) {
    return super.layoutRegions(...regions)
  }

  /**
   * @inheritDoc
   * @param {...(GetRegion|Region|By|String|WDIOElement|Object)} regions - A region to match using the Strict method.
   * @return {this}
   */
  strictRegions(...regions) {
    return super.strictRegions(...regions)
  }

  /**
   * @inheritDoc
   * @protected
   * @param {(GetRegion|Region|By|String|WDIOElement|Object)} region
   */
  _regionToRegionProvider(region) {
    if (WDIOElementFinder.isLocator(region)) {
      return new IgnoreRegionBySelector(region)
    }

    if (region instanceof WDIOElement || WDIOElement.isCompatible(region)) {
      return new IgnoreRegionByElement(WDIOElement.partial(region))
    }

    return super._regionToRegionProvider(region)
  }

  /**
   * Adds a floating region. A floating region is a a region that can be placed within the boundaries of a bigger region.
   *
   * @override
   * @param {GetFloatingRegion|Region|FloatingMatchSettings|By|String|WDIOElement|Object} regionOrContainer The content rectangle or region container
   * @param {int} [maxUpOffset] How much the content can move up.
   * @param {int} [maxDownOffset] How much the content can move down.
   * @param {int} [maxLeftOffset] How much the content can move to the left.
   * @param {int} [maxRightOffset] How much the content can move to the right.
   * @return {WebdriverioCheckSettings} This instance of the settings object.
   */
  floating(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    if (WDIOElementFinder.isLocator(region)) {
      this._floatingRegions.push(
        new FloatingRegionBySelector(
          region,
          maxUpOffset,
          maxDownOffset,
          maxLeftOffset,
          maxRightOffset,
        ),
      )
    } else if (region instanceof WDIOElement || WDIOElement.isCompatible(region)) {
      const element = WDIOElement.partial(region)
      this._floatingRegions.push(
        new FloatingRegionByElement(
          element,
          maxUpOffset,
          maxDownOffset,
          maxLeftOffset,
          maxRightOffset,
        ),
      )
    } else {
      super.floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset)
    }
    return this
  }

  /**
   * Adds a floating region. A floating region is a a region that can be placed within the boundaries of a bigger region.
   *
   * @override
   * @param {int} maxOffset How much each of the content rectangles can move in any direction.
   * @param {...(GetFloatingRegion|Region|By|String|WDIOElement|Object)} regionsOrContainers One or more content rectangles or region containers
   * @return {WebdriverioCheckSettings} This instance of the settings object.
   */
  floatings(maxOffset, ...regionsOrContainers) {
    super.floatings(maxOffset, ...regionsOrContainers)
    return this
  }

  /**
   *
   * @param [timeoutMilliseconds]
   * @returns {WebdriverioCheckSettings}
   */
  timeout(timeoutMilliseconds = USE_DEFAULT_MATCH_TIMEOUT) {
    super.timeout(timeoutMilliseconds)
    return this
  }

  /**
   * Defines that the screenshot will contain the entire element or region, even if it's outside the view.
   *
   * @override
   * @param {boolean} [fully]
   * @return {WebdriverioCheckSettings} This instance of the settings object.
   */
  fully(fully) {
    super.fully(fully)
    return this
  }

  /**
   * @override
   * @param {Boolean} [stitchContent=true]
   * @return {WebdriverioCheckSettings}
   */
  stitchContent(stitchContent = true) {
    super.stitchContent(stitchContent)
    return this
  }

  /**
   * @returns {By}
   */
  get targetSelector() {
    return this._targetSelector
  }

  /**
   * @returns {WDIOElement|Object}
   */
  get targetElement() {
    return this._targetElement
  }

  /**
   * @returns {FrameLocator[]}
   */
  getFrameChain() {
    return this._frameChain
  }

  _getTargetType() {
    return !this._targetRegion && !this._targetElement && !this._targetSelector
      ? 'window'
      : 'region'
  }

  /**
   * @param {By|String|WDIOElement|Object} element
   * @return {this}
   */
  scrollRootElement(element) {
    if (WDIOElementFinder.isLocator(element)) {
      if (this._frameChain.length === 0) {
        this._scrollRootSelector = element
      } else {
        this._frameChain[this._frameChain.length - 1].setScrollRootSelector(element)
      }
    } else if (this._frameChain.length === 0) {
      this._scrollRootElement = element
    } else {
      this._frameChain[this._frameChain.length - 1].setScrollRootElement(element)
    }

    return this
  }

  /**
   * @ignore
   * @return {Promise<WDIOElement>}
   */
  getScrollRootElement() {
    return this._scrollRootElement
  }

  /**
   * @ignore
   * @return {By}
   */
  getScrollRootSelector() {
    return this._scrollRootSelector
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

  strictRegions(...regions) {
    regions.forEach(region => {
      this._processStrictRegions(region)
    })
    return this
  }

  layoutRegions(...regions) {
    regions.forEach(region => {
      this._processLayoutRegions(region)
    })
    return this
  }

  contentRegions(...regions) {
    regions.forEach(region => {
      this._processContentRegions(region)
    })
    return this
  }

  /**
   * @inheritDoc
   * @param {GetAccessibilityRegion|Region|AccessibilityMatchSettings|By|String|WDIOElement|Object} regionOrContainer -
   *   The content rectangle or region container
   * @param {AccessibilityRegionType} [regionType] - Type of accessibility.
   * @return {this}
   */
  accessibilityRegion(region, regionType) {
    if (WDIOElementFinder.isLocator(region)) {
      const accessibilityRegion = new AccessibilityRegionBySelector(region, regionType)
      this._accessibilityRegions.push(accessibilityRegion)
    } else if (region instanceof WDIOElement || WDIOElement.isCompatible(region)) {
      const element = WDIOElement.partial(region)
      const floatingRegion = new AccessibilityRegionByElement(element, regionType)
      this._accessibilityRegions.push(floatingRegion)
    } else {
      super.accessibilityRegion(region, regionType)
    }
    return this
  }

  _processStrictRegions(region) {
    if (WDIOElementFinder.isLocator(region)) {
      this._strictRegions.push(new IgnoreRegionBySelector(region))
    } else if (region instanceof WDIOElement || WDIOElement.isCompatible(region)) {
      this._strictRegions.push(new IgnoreRegionByElement(WDIOElement.partial(region)))
    } else {
      super.strictRegions(region)
    }
  }

  _processLayoutRegions(region) {
    if (WDIOElementFinder.isLocator(region)) {
      this._layoutRegions.push(new IgnoreRegionBySelector(region))
    } else if (region instanceof WDIOElement || WDIOElement.isCompatible(region)) {
      this._layoutRegions.push(new IgnoreRegionByElement(WDIOElement.partial(region)))
    } else {
      super.layoutRegions(region)
    }
  }

  _processContentRegions(region) {
    if (WDIOElementFinder.isLocator(region)) {
      this._contentRegions.push(new IgnoreRegionBySelector(region))
    } else if (region instanceof WDIOElement || WDIOElement.isCompatible(region)) {
      this._contentRegions.push(new IgnoreRegionByElement(WDIOElement.partial(region)))
    } else {
      super.contentRegions(region)
    }
  }
}

module.exports = WebdriverioCheckSettings
