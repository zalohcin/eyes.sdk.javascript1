"use strict";
exports.__esModule = true;
var TypeUtils = require("../utils/TypeUtils");
var ArgumentGuard = require("../utils/ArgumentGuard");
var RegionData = /** @class */ (function () {
    function RegionData(regionOrLocationOrX, sizeOrY, width, height) {
        if (TypeUtils.isNumber(regionOrLocationOrX)) {
            var x = regionOrLocationOrX;
            var y = sizeOrY;
            return new RegionData({ x: x, y: y, width: width, height: height });
        }
        else if (!TypeUtils.has(regionOrLocationOrX, 'width')) {
            var _a = TypeUtils.has(regionOrLocationOrX, 'left')
                ? { x: regionOrLocationOrX.left, y: regionOrLocationOrX.top }
                : regionOrLocationOrX, x = _a.x, y = _a.y;
            var _b = sizeOrY, width_1 = _b.width, height_1 = _b.height;
            return new RegionData({ x: x, y: y, width: width_1, height: height_1 });
        }
        var region = regionOrLocationOrX;
        if (TypeUtils.has(region, 'x')) {
            this.x = region.x;
            this.y = region.y;
        }
        else {
            this.x = region.left;
            this.y = region.top;
        }
        this.width = region.width;
        this.height = region.height;
    }
    Object.defineProperty(RegionData.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (x) {
            ArgumentGuard.isNumber(x, { name: 'x' });
            this._x = x;
        },
        enumerable: false,
        configurable: true
    });
    RegionData.prototype.getX = function () {
        return this._x;
    };
    RegionData.prototype.setX = function (x) {
        this.x = x;
    };
    Object.defineProperty(RegionData.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (y) {
            ArgumentGuard.isNumber(y, { name: 'y' });
            this._y = y;
        },
        enumerable: false,
        configurable: true
    });
    RegionData.prototype.getY = function () {
        return this._y;
    };
    RegionData.prototype.setY = function (y) {
        this.y = y;
    };
    Object.defineProperty(RegionData.prototype, "left", {
        get: function () {
            return this.x;
        },
        set: function (left) {
            this.x = left;
        },
        enumerable: false,
        configurable: true
    });
    RegionData.prototype.getLeft = function () {
        return this.x;
    };
    RegionData.prototype.setLeft = function (left) {
        this.x = left;
    };
    Object.defineProperty(RegionData.prototype, "top", {
        get: function () {
            return this.y;
        },
        set: function (top) {
            this.y = top;
        },
        enumerable: false,
        configurable: true
    });
    RegionData.prototype.getTop = function () {
        return this.y;
    };
    RegionData.prototype.setTop = function (top) {
        this.y = top;
    };
    Object.defineProperty(RegionData.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (width) {
            ArgumentGuard.isNumber(width, { name: 'width', gte: 0 });
            this._width = width;
        },
        enumerable: false,
        configurable: true
    });
    RegionData.prototype.getWidth = function () {
        return this._width;
    };
    RegionData.prototype.setWidth = function (width) {
        this.width = width;
    };
    Object.defineProperty(RegionData.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (height) {
            ArgumentGuard.isNumber(height, { name: 'height', gte: 0 });
            this._height = height;
        },
        enumerable: false,
        configurable: true
    });
    RegionData.prototype.getHeight = function () {
        return this._height;
    };
    RegionData.prototype.setHeight = function (height) {
        this.height = height;
    };
    return RegionData;
}());
exports["default"] = RegionData;
