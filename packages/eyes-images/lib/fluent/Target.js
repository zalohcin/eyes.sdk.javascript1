'use strict';

const { MutableImage, TypeUtils, ArgumentGuard } = require('@applitools/eyes-sdk-core');

const { ImagesCheckSettings } = require('./ImagesCheckSettings');

class Target {
  /**
   * @param {string|Buffer|MutableImage} image
   * @return {ImagesCheckSettings}
   */
  static image(image) {
    if (image instanceof MutableImage) {
      return new ImagesCheckSettings(image);
    }

    if (TypeUtils.isBuffer(image)) {
      return new ImagesCheckSettings(undefined, image);
    }

    if (TypeUtils.isString(image)) {
      if (TypeUtils.isBase64(image)) {
        return new ImagesCheckSettings(undefined, undefined, image);
      }

      return new ImagesCheckSettings(undefined, undefined, undefined, image);
    }

    throw new TypeError('IllegalType: unsupported type of image!');
  }

  /**
   * @param {Buffer} buffer
   * @return {ImagesCheckSettings}
   */
  static buffer(buffer) {
    ArgumentGuard.isBuffer(buffer, 'buffer');

    return new ImagesCheckSettings(null, buffer);
  }

  /**
   * @param {string} string
   * @return {ImagesCheckSettings}
   */
  static base64(string) {
    ArgumentGuard.isBase64(string);

    return new ImagesCheckSettings(undefined, undefined, string);
  }

  /**
   * @param {string} string
   * @return {ImagesCheckSettings}
   */
  static path(string) {
    ArgumentGuard.isString(string, 'path');

    return new ImagesCheckSettings(undefined, undefined, undefined, string);
  }

  /**
   * @param {string} string
   * @param {RectangleSize} [imageSize]
   * @return {ImagesCheckSettings}
   */
  static url(string, imageSize) {
    ArgumentGuard.isString(string, 'url');

    const checkSettings = new ImagesCheckSettings(undefined, undefined, undefined, undefined, string);
    checkSettings.imageSize(imageSize);
    return checkSettings;
  }

  /**
   * @param {string|Buffer|MutableImage} image
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

exports.Target = Target;
