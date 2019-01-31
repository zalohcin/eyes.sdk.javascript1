'use strict';

const { MutableImage, TypeUtils, ArgumentGuard } = require('@applitools/eyes-common');
const { ImageProvider } = require('@applitools/eyes-sdk-core');

const { ImagesCheckSettings } = require('./ImagesCheckSettings');

class Target {
  /**
   * @param {string|Buffer|ImageProvider|MutableImage} varArg
   * @return {ImagesCheckSettings}
   */
  static image(varArg) {
    if (varArg instanceof MutableImage) {
      return new ImagesCheckSettings(varArg);
    }

    if (varArg instanceof ImageProvider) {
      return Target.imageProvider(varArg);
    }

    if (TypeUtils.isBuffer(varArg)) {
      return Target.buffer(varArg);
    }

    if (TypeUtils.isBase64(varArg)) {
      return Target.base64(varArg);
    }

    if (TypeUtils.isUrl(varArg)) {
      return Target.url(varArg);
    }

    if (TypeUtils.isString(varArg)) {
      return Target.path(varArg);
    }

    throw new TypeError('IllegalType: unsupported type of image!');
  }

  /**
   * @param {Buffer} imageBuffer
   * @return {ImagesCheckSettings}
   */
  static buffer(imageBuffer) {
    ArgumentGuard.isBuffer(imageBuffer, 'buffer');

    const checkSettings = new ImagesCheckSettings();
    checkSettings.setImageBuffer(imageBuffer);
    return checkSettings;
  }

  /**
   * @param {string} imageBase64
   * @return {ImagesCheckSettings}
   */
  static base64(imageBase64) {
    ArgumentGuard.isBase64(imageBase64);

    const checkSettings = new ImagesCheckSettings();
    checkSettings.setImageString(imageBase64);
    return checkSettings;
  }

  /**
   * @param {string} imagePath
   * @return {ImagesCheckSettings}
   */
  static path(imagePath) {
    ArgumentGuard.isString(imagePath, 'path');

    const checkSettings = new ImagesCheckSettings();
    checkSettings.setImagePath(imagePath);
    return checkSettings;
  }

  /**
   * @param {string} imageUrl
   * @param {RectangleSize} [imageSize]
   * @return {ImagesCheckSettings}
   */
  static url(imageUrl, imageSize) {
    ArgumentGuard.isString(imageUrl, 'url');

    const checkSettings = new ImagesCheckSettings();
    checkSettings.setImageUrl(imageUrl);
    checkSettings.setImageSize(imageSize);
    return checkSettings;
  }

  /**
   * @param {ImageProvider} imageProvider
   * @return {ImagesCheckSettings}
   */
  static imageProvider(imageProvider) {
    ArgumentGuard.isValidType(imageProvider, ImageProvider);

    const checkSettings = new ImagesCheckSettings();
    checkSettings.setImageProvider(imageProvider);
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
