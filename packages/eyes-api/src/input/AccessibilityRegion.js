"use strict";
exports.__esModule = true;
var TypeUtils = require("../utils/TypeUtils");
var ArgumentGuard = require("../utils/ArgumentGuard");
var AccessibilityRegionType_1 = require("../enums/AccessibilityRegionType");
var Region_1 = require("./Region");
var AccessibilityRegionData = /** @class */ (function () {
    function AccessibilityRegionData(accessibilityRegionOrX, y, width, height, type) {
        if (TypeUtils.isNumber(accessibilityRegionOrX)) {
            return new AccessibilityRegionData({ region: { x: accessibilityRegionOrX, y: y, width: width, height: height }, type: type });
        }
        this.region = accessibilityRegionOrX.region;
        this.type = accessibilityRegionOrX.type;
    }
    Object.defineProperty(AccessibilityRegionData.prototype, "region", {
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
    AccessibilityRegionData.prototype.getRegion = function () {
        return this._region;
    };
    AccessibilityRegionData.prototype.setRegion = function (region) {
        this.region = region;
    };
    AccessibilityRegionData.prototype.getLeft = function () {
        return this._region.getLeft();
    };
    AccessibilityRegionData.prototype.setLeft = function (left) {
        this._region.setLeft(left);
    };
    AccessibilityRegionData.prototype.retTop = function () {
        return this._region.getTop();
    };
    AccessibilityRegionData.prototype.setTop = function (top) {
        this._region.setTop(top);
    };
    AccessibilityRegionData.prototype.getWidth = function () {
        return this._region.getWidth();
    };
    AccessibilityRegionData.prototype.setWidth = function (width) {
        this._region.setWidth(width);
    };
    AccessibilityRegionData.prototype.getHeight = function () {
        return this._region.getHeight();
    };
    AccessibilityRegionData.prototype.setHeight = function (height) {
        this._region.setHeight(height);
    };
    Object.defineProperty(AccessibilityRegionData.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (type) {
            ArgumentGuard.isEnumValue(type, AccessibilityRegionType_1["default"], { name: 'type', strict: false });
            this._type = type;
        },
        enumerable: false,
        configurable: true
    });
    AccessibilityRegionData.prototype.getType = function () {
        return this._type;
    };
    AccessibilityRegionData.prototype.setType = function (type) {
        this.type = type;
    };
    return AccessibilityRegionData;
}());
exports["default"] = AccessibilityRegionData;
