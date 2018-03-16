'use strict';

const { EyesSeleniumUtils } = require('@applitools/eyes.selenium');

class EyesAppiumUtils extends EyesSeleniumUtils {
  /**
   * @param {IWebDriver} driver The driver for which to check if it represents a mobile device.
   * @return {Promise.<Boolean>} {@code true} if the platform running the test is a mobile platform. {@code false}
   *   otherwise.
   */
  static isMobileDevice(driver) {
    return driver.getCapabilities()
      .then(capabilities => EyesAppiumUtils.isMobileDeviceFromCaps(capabilities));
  }

  /**
   * @param {Capabilities} capabilities The driver's capabilities.
   * @return {Boolean} {@code true} if the platform running the test is a mobile platform. {@code false} otherwise.
   */
  static isMobileDeviceFromCaps(capabilities) {
    return EyesAppiumUtils.isAndroidFromCaps(capabilities) || EyesAppiumUtils.isIOSFromCaps(capabilities);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {IWebDriver} driver The driver to test.
   * @return {Promise.<Boolean>} {@code true} if the driver is an Android driver. {@code false} otherwise.
   */
  static isAndroid(driver) {
    return driver.getCapabilities()
      .then(capabilities => EyesAppiumUtils.isAndroidFromCaps(capabilities));
  }

  /**
   * @param {Capabilities} capabilities The driver's capabilities.
   * @return {Boolean} {@code true} if the driver is an Android driver. {@code false} otherwise.
   */
  static isAndroidFromCaps(capabilities) {
    return capabilities.get('platformName')
      .toUpperCase() === 'ANDROID';
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {IWebDriver} driver The driver to test.
   * @return {Promise.<Boolean>} {@code true} if the driver is an Android driver. {@code false} otherwise.
   */
  static isIOS(driver) {
    return driver.getCapabilities()
      .then(capabilities => EyesAppiumUtils.isIOSFromCaps(capabilities));
  }

  /**
   * @param {Capabilities} capabilities The driver's capabilities.
   * @return {Boolean} {@code true} if the driver is an Android driver. {@code false} otherwise.
   */
  static isIOSFromCaps(capabilities) {
    return ['MAC', 'IOS'].includes(capabilities.get('platformName')
      .toUpperCase());
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {IWebDriver} driver The driver to get the platform version from.
   * @return {Promise.<String>} The platform version or {@code null} if it is undefined.
   */
  static getPlatformVersion(driver) {
    return driver.getCapabilities()
      .then(capabilities => EyesAppiumUtils.getPlatformVersionFromCaps(capabilities));
  }

  /**
   * @param {Capabilities} capabilities The driver's capabilities.
   * @return {Boolean} The platform version or {@code null} if it is undefined.
   */
  static getPlatformVersionFromCaps(capabilities) {
    return capabilities.get('platformVersion');
  }
}

module.exports = EyesAppiumUtils;
