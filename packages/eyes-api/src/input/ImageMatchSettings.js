"use strict";
exports.__esModule = true;
var ExactMatchSettings_1 = require("./ExactMatchSettings");
var Region_1 = require("./Region");
var FloatingRegion_1 = require("./FloatingRegion");
var AccessibilityRegion_1 = require("./AccessibilityRegion");
var MatchLevel_1 = require("../enums/MatchLevel");
var AccessibilityLevel_1 = require("../enums/AccessibilityLevel");
var AccessibilityGuidelinesVersion_1 = require("../enums/AccessibilityGuidelinesVersion");
var ArgumentGuard = require("../utils/ArgumentGuard");
var ImageMatchSettingsData = /** @class */ (function () {
    function ImageMatchSettingsData(settings) {
        this._matchLevel = MatchLevel_1["default"].Strict;
        this._ignoreCaret = true;
        this._useDom = false;
        this._enablePatterns = false;
        this._ignoreDisplacements = false;
        if (!settings)
            return this;
        var self = this;
        for (var _i = 0, _a = Object.entries(settings); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (key in this && !key.startsWith('_')) {
                self[key] = value;
            }
        }
    }
    Object.defineProperty(ImageMatchSettingsData.prototype, "exact", {
        get: function () {
            return this._exact;
        },
        set: function (exact) {
            this._exact = new ExactMatchSettings_1["default"](exact);
        },
        enumerable: false,
        configurable: true
    });
    ImageMatchSettingsData.prototype.getExact = function () {
        return this._exact;
    };
    ImageMatchSettingsData.prototype.setExact = function (exact) {
        this.exact = exact;
    };
    Object.defineProperty(ImageMatchSettingsData.prototype, "matchLevel", {
        get: function () {
            return this._matchLevel;
        },
        set: function (matchLevel) {
            ArgumentGuard.isEnumValue(matchLevel, MatchLevel_1["default"], { name: 'matchLevel' });
            this._matchLevel = matchLevel;
        },
        enumerable: false,
        configurable: true
    });
    ImageMatchSettingsData.prototype.getMatchLevel = function () {
        return this._matchLevel;
    };
    ImageMatchSettingsData.prototype.setMatchLevel = function (matchLevel) {
        this.matchLevel = matchLevel;
    };
    Object.defineProperty(ImageMatchSettingsData.prototype, "ignoreCaret", {
        get: function () {
            return this._ignoreCaret;
        },
        set: function (ignoreCaret) {
            ArgumentGuard.isBoolean(ignoreCaret, { name: 'ignoreCaret', strict: false });
            this._ignoreCaret = ignoreCaret;
        },
        enumerable: false,
        configurable: true
    });
    ImageMatchSettingsData.prototype.getIgnoreCaret = function () {
        return this._ignoreCaret;
    };
    ImageMatchSettingsData.prototype.setIgnoreCaret = function (ignoreCaret) {
        this.ignoreCaret = ignoreCaret;
    };
    Object.defineProperty(ImageMatchSettingsData.prototype, "useDom", {
        get: function () {
            return this._useDom;
        },
        set: function (useDom) {
            ArgumentGuard.isBoolean(useDom, { name: 'useDom', strict: false });
            this._useDom = useDom;
        },
        enumerable: false,
        configurable: true
    });
    ImageMatchSettingsData.prototype.getUseDom = function () {
        return this._useDom;
    };
    ImageMatchSettingsData.prototype.setUseDom = function (useDom) {
        this.useDom = useDom;
    };
    Object.defineProperty(ImageMatchSettingsData.prototype, "enablePatterns", {
        get: function () {
            return this._enablePatterns;
        },
        set: function (enablePatterns) {
            ArgumentGuard.isBoolean(enablePatterns, { name: 'enablePatterns', strict: false });
            this._enablePatterns = enablePatterns;
        },
        enumerable: false,
        configurable: true
    });
    ImageMatchSettingsData.prototype.getEnablePatterns = function () {
        return this._enablePatterns;
    };
    ImageMatchSettingsData.prototype.setEnablePatterns = function (enablePatterns) {
        this.enablePatterns = enablePatterns;
    };
    Object.defineProperty(ImageMatchSettingsData.prototype, "ignoreDisplacements", {
        get: function () {
            return this._ignoreDisplacements;
        },
        set: function (ignoreDisplacements) {
            ArgumentGuard.isBoolean(ignoreDisplacements, { name: 'ignoreDisplacements', strict: false });
            this._ignoreDisplacements = ignoreDisplacements;
        },
        enumerable: false,
        configurable: true
    });
    ImageMatchSettingsData.prototype.getIgnoreDisplacements = function () {
        return this._ignoreDisplacements;
    };
    ImageMatchSettingsData.prototype.setIgnoreDisplacements = function (ignoreDisplacements) {
        this.ignoreDisplacements = ignoreDisplacements;
    };
    Object.defineProperty(ImageMatchSettingsData.prototype, "ignoreRegions", {
        get: function () {
            return this._ignoreRegions;
        },
        set: function (ignoreRegions) {
            ArgumentGuard.isArray(ignoreRegions, { name: 'ignoreRegions', strict: false });
            this._ignoreRegions = ignoreRegions ? ignoreRegions.map(function (region) { return new Region_1["default"](region); }) : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageMatchSettingsData.prototype, "ignore", {
        get: function () {
            return this.ignoreRegions;
        },
        set: function (ignoreRegions) {
            this.ignoreRegions = ignoreRegions;
        },
        enumerable: false,
        configurable: true
    });
    ImageMatchSettingsData.prototype.getIgnoreRegions = function () {
        return this._ignoreRegions;
    };
    ImageMatchSettingsData.prototype.setIgnoreRegions = function (ignoreRegions) {
        this.ignoreRegions = ignoreRegions;
    };
    Object.defineProperty(ImageMatchSettingsData.prototype, "layoutRegions", {
        get: function () {
            return this._layoutRegions;
        },
        set: function (layoutRegions) {
            ArgumentGuard.isArray(layoutRegions, { name: 'layoutRegions', strict: false });
            this._layoutRegions = layoutRegions ? layoutRegions.map(function (region) { return new Region_1["default"](region); }) : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageMatchSettingsData.prototype, "layout", {
        get: function () {
            return this.layoutRegions;
        },
        set: function (layoutRegions) {
            this.layoutRegions = layoutRegions;
        },
        enumerable: false,
        configurable: true
    });
    ImageMatchSettingsData.prototype.getLayoutRegions = function () {
        return this._layoutRegions;
    };
    ImageMatchSettingsData.prototype.setLayoutRegions = function (layoutRegions) {
        this.layoutRegions = layoutRegions;
    };
    Object.defineProperty(ImageMatchSettingsData.prototype, "strictRegions", {
        get: function () {
            return this._strictRegions;
        },
        set: function (strictRegions) {
            ArgumentGuard.isArray(strictRegions, { name: 'strictRegions', strict: false });
            this._strictRegions = strictRegions ? strictRegions.map(function (region) { return new Region_1["default"](region); }) : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageMatchSettingsData.prototype, "strict", {
        get: function () {
            return this.strictRegions;
        },
        set: function (strictRegions) {
            this.strictRegions = strictRegions;
        },
        enumerable: false,
        configurable: true
    });
    ImageMatchSettingsData.prototype.getStrictRegions = function () {
        return this._strictRegions;
    };
    ImageMatchSettingsData.prototype.setStrictRegions = function (strictRegions) {
        this.strictRegions = strictRegions;
    };
    Object.defineProperty(ImageMatchSettingsData.prototype, "contentRegions", {
        get: function () {
            return this._contentRegions;
        },
        set: function (contentRegions) {
            ArgumentGuard.isArray(contentRegions, { name: 'contentRegions', strict: false });
            this._contentRegions = contentRegions ? contentRegions.map(function (region) { return new Region_1["default"](region); }) : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageMatchSettingsData.prototype, "content", {
        get: function () {
            return this.contentRegions;
        },
        set: function (contentRegions) {
            this.contentRegions = contentRegions;
        },
        enumerable: false,
        configurable: true
    });
    ImageMatchSettingsData.prototype.getContentRegions = function () {
        return this._contentRegions;
    };
    ImageMatchSettingsData.prototype.setContentRegions = function (contentRegions) {
        this.contentRegions = contentRegions;
    };
    Object.defineProperty(ImageMatchSettingsData.prototype, "floatingRegions", {
        get: function () {
            return this._floatingRegions;
        },
        set: function (floatingRegions) {
            ArgumentGuard.isArray(floatingRegions, { name: 'floatingRegions', strict: false });
            this._floatingRegions = floatingRegions ? floatingRegions.map(function (region) { return new FloatingRegion_1["default"](region); }) : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageMatchSettingsData.prototype, "floating", {
        get: function () {
            return this.floatingRegions;
        },
        set: function (floatingRegions) {
            this.floatingRegions = floatingRegions;
        },
        enumerable: false,
        configurable: true
    });
    ImageMatchSettingsData.prototype.getFloatingRegions = function () {
        return this._floatingRegions;
    };
    ImageMatchSettingsData.prototype.setFloatingRegions = function (floatingRegions) {
        this.floatingRegions = floatingRegions;
    };
    Object.defineProperty(ImageMatchSettingsData.prototype, "accessibilityRegions", {
        get: function () {
            return this._accessibilityRegions;
        },
        set: function (accessibilityRegions) {
            ArgumentGuard.isArray(accessibilityRegions, { name: 'accessibilityRegions', strict: false });
            this._accessibilityRegions = accessibilityRegions
                ? accessibilityRegions.map(function (region) { return new AccessibilityRegion_1["default"](region); })
                : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageMatchSettingsData.prototype, "accessibility", {
        get: function () {
            return this.accessibilityRegions;
        },
        set: function (accessibilityRegions) {
            this.accessibilityRegions = accessibilityRegions;
        },
        enumerable: false,
        configurable: true
    });
    ImageMatchSettingsData.prototype.getAccessibilityRegions = function () {
        return this._accessibilityRegions;
    };
    ImageMatchSettingsData.prototype.setAccessibilityRegions = function (accessibilityRegions) {
        this.accessibilityRegions = accessibilityRegions;
    };
    Object.defineProperty(ImageMatchSettingsData.prototype, "accessibilitySettings", {
        get: function () {
            return this._accessibilitySettings;
        },
        set: function (accessibilitySettings) {
            if (accessibilitySettings) {
                var level = accessibilitySettings.level, guidelinesVersion = accessibilitySettings.guidelinesVersion;
                ArgumentGuard.isEnumValue(level, AccessibilityLevel_1["default"], { name: 'accessibilitySettings.level' });
                ArgumentGuard.isEnumValue(guidelinesVersion, AccessibilityGuidelinesVersion_1["default"], {
                    name: 'accessibilitySettings.guidelinesVersion'
                });
            }
            this._accessibilitySettings = accessibilitySettings;
        },
        enumerable: false,
        configurable: true
    });
    ImageMatchSettingsData.prototype.getAccessibilitySettings = function () {
        return this._accessibilitySettings;
    };
    ImageMatchSettingsData.prototype.setAccessibilitySettings = function (accessibilitySettings) {
        this._accessibilitySettings = accessibilitySettings;
    };
    return ImageMatchSettingsData;
}());
exports["default"] = ImageMatchSettingsData;
