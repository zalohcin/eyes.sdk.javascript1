'use strict';

const { CheckSettings } = require('@applitools/eyes-sdk-core');

const BEFORE_CAPTURE_SCREENSHOT = 'beforeCaptureScreenshot';

class CheckRGSettings extends CheckSettings {
  /**
   * @param {Region} [region]
   * @param {String} [selector]
   */
  constructor(region, selector) {
    super();

    /** @type {Region} */
    this._region = region;
    /** @type {String} */
    this._selector = selector;

    /** @type {Map<String, String>} */ this._scriptHooks = new Map();
  }

  /**
   * @param {String} script
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
   * @return {String}
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
   * @return {Map<String, String>}
   */
  getScriptHooks() {
    return this._scriptHooks;
  }
}

exports.CheckRGSettings = CheckRGSettings;
