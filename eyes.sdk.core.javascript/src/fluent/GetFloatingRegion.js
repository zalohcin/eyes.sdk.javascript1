'use strict';

/**
 * @interface
 */
class GetFloatingRegion {
    /**
     * @param {EyesBase} eyesBase
     * @return {Promise.<FloatingMatchSettings>}
     */
    getRegion(eyesBase) {}
}

module.exports = GetFloatingRegion;
