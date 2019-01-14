'use strict';

const { CheckSettings } = require('@applitools/eyes-sdk-core');

const BEFORE_CAPTURE_SCREENSHOT = 'beforeCaptureScreenshot';

class CheckRGSettings extends CheckSettings {
  /**
   * @param {Region} [region]
   * @param {string} [selector]
   */
  constructor(region, selector) {
    super();

    /** @type {Region} */
    this._region = region;
    /** @type {string} */
    this._selector = selector;

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

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {Region...} regions A region to ignore when validating the screenshot.
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
    if (this._region == null && this._selector == null) {
      if (this.getStitchContent()) {
        return 'full-page';
      }
      return 'viewport';
    } if (this._region != null) {
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
   * @return {string}
   */
  getSelector() {
    return this._selector;
  }

  /**
   * @return {Region}
   */
  getRegion() {
    return this._region;
  }

  /**
   * @return {Map<string, string>}
   */
  getScriptHooks() {
    return this._scriptHooks;
  }
}

exports.CheckRGSettings = CheckRGSettings;
