'use strict';

/**
 * @interface
 */
class GetRegion {
    /**
     * @param {EyesBase} eyesBase
     * @return {Promise.<Region>}
     */
    getRegion(eyesBase) {}
}

module.exports = GetRegion;
