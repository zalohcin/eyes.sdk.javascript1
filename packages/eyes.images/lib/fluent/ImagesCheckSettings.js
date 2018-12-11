'use strict';

const { CheckSettings, RectangleSize } = require('@applitools/eyes.sdk.core');

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

    this._imageSize = undefined;
    this._targetRegion = undefined;
  }

  /**
   * @return {MutableImage}
   */
  getMutableImage() {
    return this._image;
  }

  /**
   * @return {Buffer}
   */
  getImageBuffer() {
    return this._imageBuffer;
  }

  /**
   * @return {string}
   */
  getImageString() {
    return this._imageBase64;
  }

  /**
   * @return {string}
   */
  getImagePath() {
    return this._imagePath;
  }

  /**
   * @return {string}
   */
  getImageUrl() {
    return this._imageUrl;
  }

  /**
   * @return {RectangleSize}
   */
  getImageSize() {
    return this._imageSize;
  }

  /**
   * @param {RectangleSize} imageSize
   */
  setImageSize(imageSize) {
    this._imageSize = imageSize;
  }

  /**
   * @param {Region|RegionObject} region The region to validate.
   * @return {ImagesCheckSettings}
   */
  region(region) {
    super.updateTargetRegion(region);
    return this;
  }
}

exports.ImagesCheckSettings = ImagesCheckSettings;
