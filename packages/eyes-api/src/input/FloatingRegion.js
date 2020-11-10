"use strict";
exports.__esModule = true;
var TypeUtils = require("../utils/TypeUtils");
var ArgumentGuard = require("../utils/ArgumentGuard");
var Region_1 = require("./Region");
var FloatingRegionData = /** @class */ (function () {
    function FloatingRegionData(floatingRegionOrX, y, width, height, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
        if (TypeUtils.isNumber(floatingRegionOrX)) {
            return new FloatingRegionData({
                region: { x: floatingRegionOrX, y: y, width: width, height: height },
                maxUpOffset: maxUpOffset,
                maxDownOffset: maxDownOffset,
                maxLeftOffset: maxLeftOffset,
                maxRightOffset: maxRightOffset
            });
        }
        this.region = floatingRegionOrX.region;
        this.maxUpOffset = maxUpOffset;
        this.maxDownOffset = maxDownOffset;
        this.maxLeftOffset = maxLeftOffset;
        this.maxRightOffset = maxRightOffset;
    }
    Object.defineProperty(FloatingRegionData.prototype, "region", {
        get: function () {
            return this._region;
        },
        set: function (region) {
            ArgumentGuard.isObject(region, { name: 'region' });
            this._region = new Region_1["default"](region);
        },
        enumerable: false,
        configurable: true
    });
    FloatingRegionData.prototype.getRegion = function () {
        return this._region;
    };
    FloatingRegionData.prototype.setRegion = function (region) {
        this.region = region;
    };
    FloatingRegionData.prototype.getLeft = function () {
        return this._region.getLeft();
    };
    FloatingRegionData.prototype.setLeft = function (left) {
        this._region.setLeft(left);
    };
    FloatingRegionData.prototype.retTop = function () {
        return this._region.getTop();
    };
    FloatingRegionData.prototype.setTop = function (top) {
        this._region.setTop(top);
    };
    FloatingRegionData.prototype.getWidth = function () {
        return this._region.getWidth();
    };
    FloatingRegionData.prototype.setWidth = function (width) {
        this._region.setWidth(width);
    };
    FloatingRegionData.prototype.getHeight = function () {
        return this._region.getHeight();
    };
    FloatingRegionData.prototype.setHeight = function (height) {
        this._region.setHeight(height);
    };
    Object.defineProperty(FloatingRegionData.prototype, "maxUpOffset", {
        get: function () {
            return this._maxUpOffset;
        },
        set: function (maxUpOffset) {
            ArgumentGuard.isNumber(maxUpOffset, { name: 'maxUpOffset' });
            this._maxUpOffset = maxUpOffset;
        },
        enumerable: false,
        configurable: true
    });
    FloatingRegionData.prototype.getMaxUpOffset = function () {
        return this._maxUpOffset;
    };
    FloatingRegionData.prototype.setMaxUpOffset = function (maxUpOffset) {
        this.maxUpOffset = maxUpOffset;
    };
    Object.defineProperty(FloatingRegionData.prototype, "maxDownOffset", {
        get: function () {
            return this._maxDownOffset;
        },
        set: function (maxDownOffset) {
            ArgumentGuard.isNumber(maxDownOffset, { name: 'maxDownOffset' });
            this._maxDownOffset = maxDownOffset;
        },
        enumerable: false,
        configurable: true
    });
    FloatingRegionData.prototype.getMaxDownOffset = function () {
        return this._maxDownOffset;
    };
    FloatingRegionData.prototype.setMaxDownOffset = function (maxDownOffset) {
        this.maxDownOffset = maxDownOffset;
    };
    Object.defineProperty(FloatingRegionData.prototype, "maxLeftOffset", {
        get: function () {
            return this._maxLeftOffset;
        },
        set: function (maxLeftOffset) {
            ArgumentGuard.isNumber(maxLeftOffset, { name: 'maxLeftOffset' });
            this._maxLeftOffset = maxLeftOffset;
        },
        enumerable: false,
        configurable: true
    });
    FloatingRegionData.prototype.getMaxLeftOffset = function () {
        return this._maxLeftOffset;
    };
    FloatingRegionData.prototype.setMaxLeftOffset = function (maxLeftOffset) {
        this.maxLeftOffset = maxLeftOffset;
    };
    Object.defineProperty(FloatingRegionData.prototype, "maxRightOffset", {
        get: function () {
            return this._maxRightOffset;
        },
        set: function (maxRightOffset) {
            ArgumentGuard.isNumber(maxRightOffset, { name: 'maxRightOffset' });
            this._maxRightOffset = maxRightOffset;
        },
        enumerable: false,
        configurable: true
    });
    FloatingRegionData.prototype.getMaxRightOffset = function () {
        return this._maxRightOffset;
    };
    FloatingRegionData.prototype.setMaxRightOffset = function (maxRightOffset) {
        this.maxRightOffset = maxRightOffset;
    };
    return FloatingRegionData;
}());
exports["default"] = FloatingRegionData;
