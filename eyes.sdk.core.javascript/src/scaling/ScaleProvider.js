'use strict';

/**
 * Encapsulates scaling logic.
 *
 * @interface
 */
class ScaleProvider {

    constructor() {
        if (new.target === ScaleProvider) {
            throw new TypeError("Can not construct `ScaleProvider` instance directly, should be used implementation!");
        }
    }

    // noinspection JSMethodCanBeStatic
    /**
     * @return {Number} The ratio by which an image will be scaled.
     */
    getScaleRatio() {
        throw new TypeError('The method `getScaleRatio` from `ScaleProvider` should be implemented!');
    }
}

module.exports = ScaleProvider;
