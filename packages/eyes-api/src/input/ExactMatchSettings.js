"use strict";
exports.__esModule = true;
var ExactMatchSettingsData = /** @class */ (function () {
    function ExactMatchSettingsData(settings) {
        this._minDiffIntensity = settings.minDiffIntensity || 0;
        this._minDiffWidth = settings.minDiffWidth || 0;
        this._minDiffHeight = settings.minDiffHeight || 0;
        this._matchThreshold = settings.matchThreshold || 0;
    }
    Object.defineProperty(ExactMatchSettingsData.prototype, "minDiffIntensity", {
        get: function () {
            return this._minDiffIntensity;
        },
        set: function (value) {
            this._minDiffIntensity = value;
        },
        enumerable: false,
        configurable: true
    });
    ExactMatchSettingsData.prototype.getMinDiffIntensity = function () {
        return this._minDiffIntensity;
    };
    ExactMatchSettingsData.prototype.setMinDiffIntensity = function (value) {
        this._minDiffIntensity = value;
    };
    Object.defineProperty(ExactMatchSettingsData.prototype, "minDiffWidth", {
        get: function () {
            return this._minDiffWidth;
        },
        set: function (value) {
            this._minDiffWidth = value;
        },
        enumerable: false,
        configurable: true
    });
    ExactMatchSettingsData.prototype.getMinDiffWidth = function () {
        return this._minDiffWidth;
    };
    ExactMatchSettingsData.prototype.setMinDiffWidth = function (value) {
        this._minDiffWidth = value;
    };
    Object.defineProperty(ExactMatchSettingsData.prototype, "minDiffHeight", {
        get: function () {
            return this._minDiffHeight;
        },
        set: function (value) {
            this._minDiffHeight = value;
        },
        enumerable: false,
        configurable: true
    });
    ExactMatchSettingsData.prototype.getMinDiffHeight = function () {
        return this._minDiffHeight;
    };
    ExactMatchSettingsData.prototype.setMinDiffHeight = function (value) {
        this._minDiffHeight = value;
    };
    Object.defineProperty(ExactMatchSettingsData.prototype, "matchThreshold", {
        get: function () {
            return this._matchThreshold;
        },
        set: function (value) {
            this._matchThreshold = value;
        },
        enumerable: false,
        configurable: true
    });
    ExactMatchSettingsData.prototype.getMatchThreshold = function () {
        return this._matchThreshold;
    };
    ExactMatchSettingsData.prototype.setMatchThreshold = function (value) {
        this._matchThreshold = value;
    };
    return ExactMatchSettingsData;
}());
exports["default"] = ExactMatchSettingsData;
