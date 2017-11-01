'use strict';

const {GetRegion, Region} = require('eyes.sdk');

class IgnoreRegionBySelector extends GetRegion {

    /**
     * @param {By} regionSelector
     */
    constructor(regionSelector) {
        super();
        this._element = regionSelector;
    }

    // noinspection JSCheckFunctionSignatures
    /**
     * @override
     * @param {Eyes} eyesBase
     */
    getRegion(eyesBase) {
        const that = this;
        return eyesBase.getDriver().findElement(that._element).then(element => {
            return element.getLocation().then(point => {
                return element.getSize().then(size => {
                    return new Region(point.x, point.y, size.width, size.height);
                });
            });
        });
    }
}

module.exports = IgnoreRegionBySelector;
