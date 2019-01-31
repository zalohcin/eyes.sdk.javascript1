'use strict';


const { Configuration, ArgumentGuard } = require('@applitools/eyes-common');

class RenderingConfiguration extends Configuration {
  /**
   * @param {RenderingConfiguration} configuration
   */
  constructor(configuration) {
    super(configuration);
    this._browsersInfo = [];
    this._concurrentSessions = 3;
    this._isThrowExceptionOn = false;

    if (configuration) {
      this._browsersInfo = configuration.getBrowsersInfo();
      this._concurrentSessions = configuration.getConcurrentSessions();
      this._isThrowExceptionOn = configuration.getIsThrowExceptionOn();
    }
  }

  /**
   * @param {{width: number, height: number, name: string}[]} browsersInfo
   */
  setBrowsersInfo(browsersInfo) {
    this._browsersInfo = browsersInfo;
  }

  /**
   * @return {{width: number, height: number, name: string}[]}
   */
  getBrowsersInfo() {
    return this._browsersInfo;
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
    return this._concurrentSessions;
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
    return this._isThrowExceptionOn;
  }

  /**
   * @return {RenderingConfiguration}
   */
  cloneConfig() {
    return new RenderingConfiguration(this);
  }

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
