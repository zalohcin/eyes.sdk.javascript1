'use strict';

const { EyesBase } = require('@applitools/eyes-sdk-core');

const { EyesSelenium } = require('./EyesSelenium');
const { EyesVisualGrid } = require('./EyesVisualGrid');

class Eyes extends EyesBase {
  // noinspection JSAnnotator
  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {string} [serverUrl=EyesBase.getDefaultServerUrl()] The Eyes server URL.
   * @param {boolean} [isDisabled=false] Set to true to disable Applitools Eyes and use the webdriver directly.
   * @param {boolean} [isVisualGrid]
   */
  constructor(serverUrl, isDisabled, isVisualGrid) {
    if (isVisualGrid === true) {
      return new EyesVisualGrid(serverUrl, isDisabled);
    }

    return new EyesSelenium(serverUrl, isDisabled);
  }
}

exports.Eyes = Eyes;
