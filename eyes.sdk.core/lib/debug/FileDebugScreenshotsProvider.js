'use strict';

const { GeneralUtils } = require('../utils/GeneralUtils');
const { DebugScreenshotsProvider } = require('./DebugScreenshotsProvider');

/**
 * A debug screenshot provider for saving screenshots to file.
 */
class FileDebugScreenshotsProvider extends DebugScreenshotsProvider {
  /**
   * @param {MutableImage} image
   * @param {string} suffix
   * @return {Promise<void>}
   */
  save(image, suffix) {
    const filename = `${this._path}${this._prefix}${this.getFormattedTimeStamp()}_${suffix}.png`;
    return image.save(filename.replace(' ', '_'));
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @return {string}
   */
  getFormattedTimeStamp() {
    return GeneralUtils.toLogFileDateTime();
  }
}

exports.FileDebugScreenshotsProvider = FileDebugScreenshotsProvider;
