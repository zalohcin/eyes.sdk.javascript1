'use strict';

const { ContextBasedScaleProviderFactory } = require('@applitools/eyes.sdk.core');
const { EyesSeleniumUtils } = require('@applitools/eyes.selenium');

const AppiumImageOrientationHandler = require('./AppiumImageOrientationHandler');
const AppiumJavascriptHandler = require('./AppiumJavascriptHandler');
const EyesAppiumUtils = require('./EyesAppiumUtils');

const VERSION = require('../package.json').version;

/**
 * Applitools SDK for Appium integration.
 */
class Eyes extends require('@applitools/eyes.selenium').Eyes {
  /** @override */
  getBaseAgentId() {
    return `eyes.appium/${VERSION}`;
  }

  /** @override */
  _init() {
    EyesSeleniumUtils.setImageOrientationHandlerHandler(new AppiumImageOrientationHandler());
    EyesSeleniumUtils.setJavascriptHandler(new AppiumJavascriptHandler(this._driver, this.getPromiseFactory()));
  }

  /** @override */
  _getScaleProviderFactory() {
    const that = this;
    return this._positionProvider.getEntireSize()
      .then(entireSize => EyesAppiumUtils.isMobileDevice(this._driver)
        .then(isMobileDevice => new ContextBasedScaleProviderFactory(that._logger, entireSize, that._viewportSizeHandler.get(), that._devicePixelRatio, isMobileDevice, that._scaleProviderHandler)));
  }

  /** @override */
  getAppEnvironment() {
    const that = this;
    let appEnv;
    return super.getAppEnvironment()
      .then(appEnv_ => {
        appEnv = appEnv_;

        // If hostOs isn't set, we'll try and extract and OS ourselves.
        if (!appEnv.getOs()) {
          that._logger.log('No OS set, checking for mobile OS...');
          return that._driver.getCapabilities()
            .then(capabilities => {
              if (EyesAppiumUtils.isMobileDeviceFromCaps(capabilities)) {
                let platformName = null;
                that._logger.log('Mobile device detected! Checking device type..');
                if (EyesAppiumUtils.isAndroidFromCaps(capabilities)) {
                  that._logger.log('Android detected.');
                  platformName = 'Android';
                } else if (EyesAppiumUtils.isIOSFromCaps(capabilities)) {
                  that._logger.log('iOS detected.');
                  platformName = 'iOS';
                } else {
                  that._logger.log('Unknown device type.');
                }

                // We only set the OS if we identified the device type.
                if (platformName) {
                  let os = platformName;
                  const platformVersion = EyesAppiumUtils.getPlatformVersionFromCaps(capabilities);
                  if (platformVersion) {
                    const majorVersion = platformVersion.split('.', 2)[0];
                    if (majorVersion) {
                      os += ` ${majorVersion}`;
                    }
                  }

                  that._logger.verbose(`Setting OS: ${os}`);
                  appEnv.setOs(os);
                }
              } else {
                that._logger.log('No mobile OS detected.');
              }
            });
        }
      })
      .then(() => {
        that._logger.log('Done!');
        return appEnv;
      });
  }
}

module.exports = Eyes;
