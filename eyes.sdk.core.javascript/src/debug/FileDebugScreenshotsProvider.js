'use strict';

const dateformat = require('dateformat');

const DebugScreenshotsProvider = require('./DebugScreenshotsProvider');

const DATE_FORMAT = "yyyy_mm_dd_HH_MM_ss_l";

/**
 * A debug screenshot provider for saving screenshots to file.
 */
class FileDebugScreenshotsProvider extends DebugScreenshotsProvider {

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {MutableImage} image
     * @param {String} suffix
     * @return {Promise.<void>}
     */
    save(image, suffix) {
        const filename = this.path + this.prefix + this.getFormattedTimeStamp() + "_" + suffix + ".png";
        return image.saveImage(filename.replace(' ', '_'));
    }

    // noinspection JSUnusedGlobalSymbols, JSMethodCanBeStatic
    /**
     * @return {Promise.<void>}
     */
    getFormattedTimeStamp() {
        return dateformat(new Date(), DATE_FORMAT);
    }
}

module.exports = FileDebugScreenshotsProvider;
