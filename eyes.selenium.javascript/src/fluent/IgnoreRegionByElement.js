'use strict';

const {GetRegion, Region} = require('eyes.sdk');

class IgnoreRegionByElement extends GetRegion {

    /**
     * @param {WebElement} webElement
     */
    constructor(webElement) {
        super();
        this._element = webElement;
    }

    // noinspection JSCheckFunctionSignatures
    /**
     * @override
     * @param {Eyes} eyesBase
     */
    getRegion(eyesBase) {
        const that = this;
        return that._element.getLocation().then(point => {
            return that._element.getSize().then(size => {
                return new Region(point.x, point.y, size.width, size.height);
            });
        });
    }
}

module.exports = IgnoreRegionByElement;
