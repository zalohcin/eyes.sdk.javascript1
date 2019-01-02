'use strict';

const { GeneralUtils } = require('@applitools/eyes-common');

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
    const filename = `${this._path}${this._prefix}${GeneralUtils.toLogFileDateTime()}_${suffix}.png`;
    return image.save(filename.replace(' ', '_'));
  }
}

exports.FileDebugScreenshotsProvider = FileDebugScreenshotsProvider;
