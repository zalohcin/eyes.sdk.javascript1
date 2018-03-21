'use strict';

const { MutableImage, GeneralUtils, ArgumentGuard } = require('@applitools/eyes.sdk.core');

const ImagesCheckSettings = require('./ImagesCheckSettings');

class Target {
  /**
   * @param {String|Buffer|MutableImage} image
   * @return {ImagesCheckSettings}
   */
  static image(image) {
    if (image instanceof MutableImage) {
      return new ImagesCheckSettings(image);
    }

    if (GeneralUtils.isBuffer(image)) {
      return new ImagesCheckSettings(null, image);
    }

    if (GeneralUtils.isString(image)) {
      if (GeneralUtils.isBase64(image)) {
        return new ImagesCheckSettings(null, null, image);
      }

      return new ImagesCheckSettings(null, null, null, image);
    }

    throw new TypeError('IllegalType: unsupported type of image!');
  }

  /**
   * @param {Buffer} buffer
   * @return {ImagesCheckSettings}
   */
  static buffer(buffer) {
    ArgumentGuard.isBuffer(buffer);

    return new ImagesCheckSettings(null, buffer);
  }

  /**
   * @param {String} string
   * @return {ImagesCheckSettings}
   */
  static base64(string) {
    ArgumentGuard.isBase64(string);

    return new ImagesCheckSettings(null, null, string);
  }

  /**
   * @param {String} string
   * @return {ImagesCheckSettings}
   */
  static path(string) {
    ArgumentGuard.isString(string);

    return new ImagesCheckSettings(null, null, null, string);
  }

  /**
   * @param {String} string
   * @param {RectangleSize} [imageSize]
   * @return {ImagesCheckSettings}
   */
  static url(string, imageSize) {
    ArgumentGuard.isString(string);

    const checkSettings = new ImagesCheckSettings(null, null, null, null, string);
    checkSettings.setImageSize(imageSize);
    return checkSettings;
  }

  /**
   * @param {String|Buffer|MutableImage} image
   * @param {Region|RegionObject} rect
   * @return {ImagesCheckSettings}
   */
  static region(image, rect) {
    const checkSettings = Target.image(image);
    // noinspection JSAccessibilityCheck
    checkSettings.region(rect);
    return checkSettings;
  }
}

module.exports = Target;
