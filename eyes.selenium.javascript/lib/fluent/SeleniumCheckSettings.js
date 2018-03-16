'use strict';

const { By, WebElement } = require('selenium-webdriver');
const { GeneralUtils, CheckSettings, Region } = require('@applitools/eyes.sdk.core');

const IgnoreRegionBySelector = require('./IgnoreRegionBySelector');
const IgnoreRegionByElement = require('./IgnoreRegionByElement');
const FloatingRegionBySelector = require('./FloatingRegionBySelector');
const FloatingRegionByElement = require('./FloatingRegionByElement');
const FrameLocator = require('./FrameLocator');

/**
 * @return {boolean}
 */
const isProtractorBy = value =>
  Object.prototype.hasOwnProperty.call(value, 'using') &&
  Object.prototype.hasOwnProperty.call(value, 'value');

class SeleniumCheckSettings extends CheckSettings {
  /**
   * @param {Region|RegionObject|By|WebElement|EyesWebElement} [region]
   * @param {Integer|String|By|WebElement|EyesWebElement} [frame]
   */
  constructor(region, frame) {
    super();

    this._targetSelector = null;
    this._targetElement = null;
    this._frameChain = [];

    if (region) {
      this.region(region);
    }

    if (frame) {
      this.frame(frame);
    }
  }

  /**
   * @return {By}
   */
  getTargetSelector() {
    return this._targetSelector;
  }

  /**
   * @return {WebElement}
   */
  getTargetElement() {
    return this._targetElement;
  }

  /**
   * @return {FrameLocator[]}
   */
  getFrameChain() {
    return this._frameChain;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Shortcut to set the match level to {@code MatchLevel.LAYOUT}.
   *
   * @override
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  layout() {
    super.layout();
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Shortcut to set the match level to {@code MatchLevel.EXACT}.
   *
   * @override
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  exact() {
    super.exact();
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Shortcut to set the match level to {@code MatchLevel.STRICT}.
   *
   * @override
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  strict() {
    super.strict();
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Shortcut to set the match level to {@code MatchLevel.CONTENT}.
   *
   * @override
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  content() {
    super.content();
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Set the match level by which to compare the screenshot.
   *
   * @override
   * @param {MatchLevel} matchLevel The match level to use.
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  matchLevel(matchLevel) {
    super.matchLevel(matchLevel);
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Defines if to detect and ignore a blinking caret in the screenshot.
   *
   * @override
   * @param {boolean} [ignoreCaret=true] Whether or not to detect and ignore a blinking caret in the screenshot.
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  ignoreCaret(ignoreCaret = true) {
    super.ignoreCaret(ignoreCaret);
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Defines that the screenshot will contain the entire element or region, even if it's outside the view.
   *
   * @override
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  fully() {
    super.fully();
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @override
   * @param {Boolean} [stitchContent=true]
   * @return {SeleniumCheckSettings}
   */
  stitchContent(stitchContent = true) {
    super.stitchContent(stitchContent);
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Defines the timeout to use when acquiring and comparing screenshots.
   *
   * @override
   * @param {int} timeoutMilliseconds The timeout to use in milliseconds.
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  timeout(timeoutMilliseconds) {
    super.timeout(timeoutMilliseconds);
    return this;
  }

  /**
   * @param {Integer|String|By|WebElement|EyesWebElement} frame The frame to switch to.
   * @return {SeleniumCheckSettings}
   */
  frame(frame) {
    const fl = new FrameLocator();
    // noinspection IfStatementWithTooManyBranchesJS
    if (Number.isInteger(frame)) {
      fl.setFrameIndex(frame);
    } else if (GeneralUtils.isString(frame)) {
      fl.setFrameNameOrId(frame);
    } else if (frame instanceof By || isProtractorBy(frame)) {
      fl.setFrameSelector(frame);
    } else if (frame instanceof WebElement) {
      fl.setFrameElement(frame);
    } else {
      throw new TypeError('frame method called with argument of unknown type!');
    }
    this._frameChain.push(fl);
    return this;
  }

  /**
   * @param {Region|RegionObject|By|WebElement|EyesWebElement} region The region to validate.
   * @return {SeleniumCheckSettings}
   */
  region(region) {
    // noinspection IfStatementWithTooManyBranchesJS
    if (region instanceof Region) {
      super.updateTargetRegion(region);
    } else if (region instanceof By || isProtractorBy(region)) {
      this._targetSelector = region;
    } else if (region instanceof WebElement) {
      this._targetElement = region;
    } else {
      throw new TypeError('region method called with argument of unknown type!');
    }
    return this;
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * Adds a region to ignore.
   *
   * @override
   * @param {GetRegion|Region|By|WebElement|EyesWebElement} regionOrContainer The region or region container to ignore
   *   when validating the screenshot.
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  ignore(regionOrContainer) {
    if (regionOrContainer instanceof By || isProtractorBy(regionOrContainer)) {
      this._ignoreRegions.push(new IgnoreRegionBySelector(regionOrContainer));
    } else if (regionOrContainer instanceof WebElement) {
      this._ignoreRegions.push(new IgnoreRegionByElement(regionOrContainer));
    } else {
      super.ignore(regionOrContainer);
    }

    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  // noinspection JSCheckFunctionSignatures
  /**
   * Adds one or more ignore regions.
   *
   * @override
   * @param {(GetRegion|Region|By|WebElement|EyesWebElement)...} regionsOrContainers One or more regions or region
   *   containers to ignore when validating the screenshot.
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  ignores(...regionsOrContainers) {
    super.ignores(...regionsOrContainers);
    return this;
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * Adds a floating region. A floating region is a region that can be placed within the boundaries of a bigger region.
   *
   * @override
   * @param {GetFloatingRegion|Region|FloatingMatchSettings|By|WebElement|EyesWebElement} regionOrContainer The content
   *   rectangle or region container
   * @param {int} [maxUpOffset] How much the content can move up.
   * @param {int} [maxDownOffset] How much the content can move down.
   * @param {int} [maxLeftOffset] How much the content can move to the left.
   * @param {int} [maxRightOffset] How much the content can move to the right.
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  floating(regionOrContainer, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    if (regionOrContainer instanceof By || isProtractorBy(regionOrContainer)) {
      const floatingRegion = new FloatingRegionBySelector(
        regionOrContainer,
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset
      );
      this._floatingRegions.push(floatingRegion);
    } else if (regionOrContainer instanceof WebElement) {
      const floatingRegion = new FloatingRegionByElement(
        regionOrContainer,
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset
      );
      this._floatingRegions.push(floatingRegion);
    } else {
      super.floating(regionOrContainer, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset);
    }
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  // noinspection JSCheckFunctionSignatures
  /**
   * Adds a floating region. A floating region is a region that can be placed within the boundaries of a bigger region.
   *
   * @override
   * @param {int} maxOffset How much each of the content rectangles can move in any direction.
   * @param {(GetFloatingRegion|Region|By|WebElement|EyesWebElement)...} regionsOrContainers One or more content
   *   rectangles or region containers
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  floatings(maxOffset, ...regionsOrContainers) {
    super.floatings(maxOffset, ...regionsOrContainers);
    return this;
  }
}

module.exports = SeleniumCheckSettings;
