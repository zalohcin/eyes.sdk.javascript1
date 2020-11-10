"use strict";
exports.__esModule = true;
var TypeUtils = require("../utils/TypeUtils");
var ArgumentGuard = require("../utils/ArgumentGuard");
var RectangleSizeData = /** @class */ (function () {
    function RectangleSizeData(sizeOrWidth, height) {
        if (TypeUtils.isNumber(sizeOrWidth)) {
            return new RectangleSizeData({ width: sizeOrWidth, height: height });
        }
        var size = sizeOrWidth;
        this.width = size.width;
        this.height = size.height;
    }
    Object.defineProperty(RectangleSizeData.prototype, "width", {
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
    RectangleSizeData.prototype.getWidth = function () {
        return this._width;
    };
    RectangleSizeData.prototype.setWidth = function (width) {
        this.width = width;
    };
    Object.defineProperty(RectangleSizeData.prototype, "height", {
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
    RectangleSizeData.prototype.getHeight = function () {
        return this._height;
    };
    RectangleSizeData.prototype.setHeight = function (height) {
        this.height = height;
    };
    return RectangleSizeData;
}());
exports["default"] = RectangleSizeData;
