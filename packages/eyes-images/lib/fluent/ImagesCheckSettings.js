'use strict';

const { CheckSettings } = require('@applitools/eyes-sdk-core');

class ImagesCheckSettings extends CheckSettings {
  /**
   * @param {MutableImage} [image]
   * @param {Buffer} [buffer]
   * @param {string} [base64]
   * @param {string} [path]
   * @param {string} [url]
   */
  constructor(image, buffer, base64, path, url) {
    super();

    this._image = image;
    this._imageBuffer = buffer;
    this._imageBase64 = base64;
    this._imagePath = path;
    this._imageUrl = url;

    this._imageSize = null;
    this._domString = null;
    this._ignoreMismatch = false;
  }

  /**
   * @package
   * @return {MutableImage}
   */
  getMutableImage() {
    return this._image;
  }

  /**
   * @package
   * @return {Buffer}
   */
  getImageBuffer() {
    return this._imageBuffer;
  }

  /**
   * @package
   * @return {string}
   */
  getImageString() {
    return this._imageBase64;
  }

  /**
   * @package
   * @return {string}
   */
  getImagePath() {
    return this._imagePath;
  }

  /**
   * @package
   * @return {string}
   */
  getImageUrl() {
    return this._imageUrl;
  }

  /**
   * @param {RectangleSize} imageSize
   * @return {this} This instance of the settings object.
   */
  imageSize(imageSize) {
    this._imageSize = imageSize;
    return this;
  }

  /**
   * @package
   * @return {RectangleSize}
   */
  getImageSize() {
    return this._imageSize;
  }

  /**
   * @param {String} domString
   * @return {this} This instance of the settings object.
   */
  withDom(domString) {
    this._sendDom = true;
    this._domString = domString;
    return this;
  }

  /**
   * @package
   * @return {String}
   */
  getDomString() {
    return this._domString;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} [ignoreMismatch=true] True if the server should ignore a negative result for the visual validation.
   *  Default value is `false`, but if you call to .ignoreMismatch() without arguments it will set value to `true`.
   * @return {this}
   */
  ignoreMismatch(ignoreMismatch = true) {
    this._ignoreMismatch = ignoreMismatch;
    return this;
  }

  /**
   * @package
   * @return {boolean}
   */
  getIgnoreMismatch() {
    return this._ignoreMismatch;
  }

  /**
   * @param {Region|RegionObject} region The region to validate.
   * @return {this}
   */
  region(region) {
    super.updateTargetRegion(region);
    return this;
  }
}

exports.ImagesCheckSettings = ImagesCheckSettings;
