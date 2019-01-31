'use strict';

const { WebElement } = require('selenium-webdriver');
const { TypeUtils, CheckSettings, Region } = require('@applitools/eyes-sdk-core');
const { EyesWebElement } = require('@applitools/eyes-selenium');

const BEFORE_CAPTURE_SCREENSHOT = 'beforeCaptureScreenshot';

const { GetSelector } = require('./GetSelector');
const { SelectorByElement } = require('./SelectorByElement');
const { SelectorByLocator } = require('./SelectorByLocator');

class CheckRGSettings extends CheckSettings {
  /**
   * @param {Region|RegionObject|By|WebElement|EyesWebElement|string} [region]
   * @param {number|string|By|WebElement|EyesWebElement} [frame]
   */
  constructor(region, frame) {
    super();

    this._targetProvider = undefined;
    this._frameChain = [];

    if (region) {
      this.region(region);
    }

    if (frame) {
      this.frame(frame);
    }

    /** @type {Map<string, string>} */ this._scriptHooks = new Map();
  }

  /**
   * @param {string} script
   */
  addScriptHook(script) {
    let scripts = this._scriptHooks.get(BEFORE_CAPTURE_SCREENSHOT);
    if (scripts == null) {
      scripts = [];
      this._scriptHooks.set(BEFORE_CAPTURE_SCREENSHOT, scripts);
    }
    scripts.add(script);
  }

  /**
   * @package
   * @return {GetSelector}
   */
  getTargetProvider() {
    return this._targetProvider;
  }

  /**
   * @param {Region|RegionObject|By|WebElement|EyesWebElement|string} region The region to validate.
   * @return {this}
   */
  region(region) {
    // noinspection IfStatementWithTooManyBranchesJS
    if (TypeUtils.isString(region)) {
      this._targetProvider = new GetSelector(region);
    } else if (Region.isRegionCompatible(region)) {
      super.updateTargetRegion(region);
    } else if (EyesWebElement.isLocator(region)) {
      this._targetProvider = new SelectorByLocator(region);
    } else if (region instanceof WebElement) {
      this._targetProvider = new SelectorByElement(region);
    } else {
      throw new TypeError('region method called with argument of unknown type!');
    }
    return this;
  }

  /**
   * @param {number|string|By|WebElement|EyesWebElement} frame The frame to switch to.
   * @return {this}
   */
  frame(frame) { // eslint-disable-line
    // do nothing
    return this;
  }

  /**
   * @package
   * @return {FrameLocator[]}
   */
  getFrameChain() {
    return this._frameChain;
  }

  /**
   * @inheritDoc
   */
  ignoreRegions(...regions) {
    super.ignoreRegions(...regions);
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {Region|FloatingMatchSettings} regionOrContainer The content rectangle or region container
   * @param {number} [maxUpOffset] How much the content can move up.
   * @param {number} [maxDownOffset] How much the content can move down.
   * @param {number} [maxLeftOffset] How much the content can move to the left.
   * @param {number} [maxRightOffset] How much the content can move to the right.
   * @inheritDoc
   */
  floatingRegion(regionOrContainer, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    super.floatingRegion(regionOrContainer, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset);
    return this;
  }

  /**
   * @return {string}
   */
  getSizeMode() {
    if (!this._targetRegion && !this._targetProvider) {
      if (this.getStitchContent()) {
        return 'full-page';
      }
      return 'viewport';
    } if (this._targetRegion) {
      if (this.getStitchContent()) {
        return 'region';
      }
      return 'region';
    }
    if (this.getStitchContent()) {
      return 'selector';
    }
    return 'selector';
  }

  /**
   * @return {Map<string, string>}
   */
  getScriptHooks() {
    return this._scriptHooks;
  }
}

exports.CheckRGSettings = CheckRGSettings;
