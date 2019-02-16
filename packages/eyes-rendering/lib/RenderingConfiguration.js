'use strict';

const { Configuration, ArgumentGuard, TypeUtils } = require('@applitools/eyes-common');

/**
 * @typedef {{width: number, height: number, name: RenderingConfiguration.BrowserType}} BrowserInfo
 * @typedef {{deviceName: string, screenOrientation: RenderingConfiguration.Orientation}} DeviceInfo
 */

const DEFAULT_VALUES = {
  browsersInfo: [],
  concurrentSessions: 3,
  isThrowExceptionOn: false,
};

class RenderingConfiguration extends Configuration {
  /**
   * @param {RenderingConfiguration} [configuration]
   */
  constructor(configuration) {
    super();

    /** @type {(BrowserInfo|DeviceInfo)[]} */ this._browsersInfo = undefined;
    /** @type {number} */ this._concurrentSessions = undefined;
    /** @type {boolean} */ this._isThrowExceptionOn = undefined;

    if (configuration) {
      this.mergeConfig(configuration);
    }
  }

  /**
   * @param {(BrowserInfo|DeviceInfo)[]} browsersInfo
   */
  setBrowsersInfo(browsersInfo) {
    this._browsersInfo = browsersInfo;
  }

  /**
   * @return {(BrowserInfo|DeviceInfo)[]}
   */
  getBrowsersInfo() {
    return TypeUtils.getOrDefault(this._browsersInfo, DEFAULT_VALUES.browsersInfo);
  }

  /**
   * @param {number} width
   * @param {number} height
   * @param {RenderingConfiguration.BrowserType} browserType
   * @return {RenderingConfiguration}
   */
  addBrowser(width, height, browserType) {
    const browserInfo = {
      width, height, name: browserType,
    };

    if (this._browsersInfo === undefined) {
      this._browsersInfo = [];
    }

    this._browsersInfo.push(browserInfo);
    return this;
  }

  /**
   * @param {string} deviceName
   * @param {RenderingConfiguration.Orientation} screenOrientation
   * @return {RenderingConfiguration}
   */
  addDevice(deviceName, screenOrientation) {
    const deviceInfo = {
      deviceName, screenOrientation,
    };

    if (this._browsersInfo === undefined) {
      this._browsersInfo = [];
    }

    this._browsersInfo.push(deviceInfo);
    return this;
  }

  /**
   * @param {number} concurrentSessions
   */
  setConcurrentSessions(concurrentSessions) {
    this._concurrentSessions = concurrentSessions;
  }

  /**
   * @return {number}
   */
  getConcurrentSessions() {
    return TypeUtils.getOrDefault(this._concurrentSessions, DEFAULT_VALUES.concurrentSessions);
  }

  /**
   * @param {boolean} isThrowExceptionOn
   */
  setIsThrowExceptionOn(isThrowExceptionOn) {
    this._isThrowExceptionOn = isThrowExceptionOn;
  }

  /**
   * @return {boolean}
   */
  getIsThrowExceptionOn() {
    return TypeUtils.getOrDefault(this._isThrowExceptionOn, DEFAULT_VALUES.isThrowExceptionOn);
  }

  /**
   * TODO: rename this method, the name of method should clearly declare that it only works for browsers and devices
   *
   * @deprecated This method is not doing what it should do, don't use it
   * @param config
   * @return {RenderingConfiguration}
   */
  static fromObject(config) {
    ArgumentGuard.isValidType(config, Object);

    const cfg = new RenderingConfiguration();
    if (config.browser) {
      const browsers = Array.isArray(config.browser) ? config.browser : [config.browser];
      browsers.forEach(browser => {
        if (browser.name) {
          cfg.addBrowser(browser.width, browser.height, browser.name);
        } else if (browser.deviceName) {
          cfg.addDevice(browser.deviceName, browser.screenOrientation);
        }
      });
    }

    return cfg;
  }

  /**
   * @return {RenderingConfiguration}
   */
  cloneConfig() {
    return new RenderingConfiguration(this);
  }
}

/**
 * @readonly
 * @enum {string}
 */
RenderingConfiguration.BrowserType = {
  CHROME: 'chrome',
  FIREFOX: 'firefox',
};

/**
 * @readonly
 * @enum {string}
 */
RenderingConfiguration.Orientation = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
};

Object.freeze(RenderingConfiguration.BrowserType);
Object.freeze(RenderingConfiguration.Orientation);
exports.RenderingConfiguration = RenderingConfiguration;
