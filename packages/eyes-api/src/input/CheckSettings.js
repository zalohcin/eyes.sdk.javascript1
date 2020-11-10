"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var ArgumentGuard = require("../utils/ArgumentGuard");
var TypeUtils = require("../utils/TypeUtils");
var AccessibilityRegionType_1 = require("../enums/AccessibilityRegionType");
var MatchLevel_1 = require("../enums/MatchLevel");
var CheckSettingsFluent = /** @class */ (function () {
    function CheckSettingsFluent(settings) {
        var _this = this;
        this._settings = {};
        if (!settings)
            return this;
        if (settings.name)
            this.name(settings.name);
        if (settings.region)
            this.region(settings.region);
        if (settings.frames) {
            settings.frames.forEach(function (reference) {
                if (TypeUtils.isNull(reference))
                    return;
                if (TypeUtils.has(reference, 'frame')) {
                    _this.frame(reference.frame, reference.scrollRootElement);
                }
                else {
                    _this.frame(reference);
                }
            });
        }
        if (settings.scrollRootElement)
            this.scrollRootElement(settings.scrollRootElement);
        if (!TypeUtils.isNull(settings.isFully))
            this.fully(settings.isFully);
        if (settings.matchLevel)
            this.matchLevel(settings.matchLevel);
        if (!TypeUtils.isNull(settings.useDom))
            this.useDom(settings.useDom);
        if (!TypeUtils.isNull(settings.sendDom))
            this.sendDom(settings.sendDom);
        if (!TypeUtils.isNull(settings.enablePatterns))
            this.enablePatterns(settings.enablePatterns);
        if (!TypeUtils.isNull(settings.ignoreDisplacements))
            this.ignoreDisplacements(settings.ignoreDisplacements);
        if (!TypeUtils.isNull(settings.ignoreCaret))
            this.ignoreCaret(settings.ignoreCaret);
        if (settings.ignoreRegions) {
            settings.ignoreRegions.forEach(function (ignoreRegion) { return _this.ignoreRegion(ignoreRegion); });
        }
        if (settings.layoutRegions) {
            settings.layoutRegions.forEach(function (layoutRegion) { return _this.layoutRegion(layoutRegion); });
        }
        if (settings.strictRegions) {
            settings.strictRegions.forEach(function (strictRegion) { return _this.strictRegion(strictRegion); });
        }
        if (settings.contentRegions) {
            settings.contentRegions.forEach(function (contentRegion) { return _this.contentRegion(contentRegion); });
        }
        if (settings.floatingRegions) {
            settings.floatingRegions.forEach(function (floatingRegion) {
                return _this.floatingRegion(floatingRegion);
            });
        }
        if (settings.accessibilityRegions) {
            settings.accessibilityRegions.forEach(function (accessibilityRegion) {
                return _this.accessibilityRegion(accessibilityRegion);
            });
        }
        if (!TypeUtils.isNull(settings.disableBrowserFetching))
            this.disableBrowserFetching(settings.disableBrowserFetching);
        if (!TypeUtils.isNull(settings.layoutBreakpoints))
            this.layoutBreakpoints(settings.layoutBreakpoints);
        if (settings.hooks) {
            Object.entries(settings.hooks).forEach(function (_a) {
                var name = _a[0], script = _a[1];
                return _this.hook(name, script);
            });
        }
        if (settings.visualGridOptions) {
            Object.entries(settings.visualGridOptions).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                return _this.visualGridOption(key, value);
            });
        }
        if (settings.renderId)
            this.renderId(settings.renderId);
        if (!TypeUtils.isNull(settings.timeout))
            this.timeout(settings.timeout);
    }
    CheckSettingsFluent.prototype.isFrameReference = function (value) {
        return TypeUtils.isNumber(value) || TypeUtils.isString(value) || this.isElementReference(value);
    };
    CheckSettingsFluent.prototype.isRegionReference = function (value) {
        return (TypeUtils.has(value, ['x', 'y', 'width', 'height']) ||
            TypeUtils.has(value, ['left', 'top', 'width', 'height']) ||
            this.isElementReference(value));
    };
    CheckSettingsFluent.prototype.isElementReference = function (value) {
        return this._spec.isElement(value) || this._spec.isSelector(value);
    };
    CheckSettingsFluent.prototype.name = function (name) {
        ArgumentGuard.isString(name, { name: 'name' });
        this._settings.name = name;
        return this;
    };
    CheckSettingsFluent.prototype.withName = function (name) {
        return this.name(name);
    };
    CheckSettingsFluent.prototype.region = function (region) {
        var _this = this;
        ArgumentGuard.custom(region, function (value) { return _this.isRegionReference(value); }, { name: 'region' });
        this._settings.region = region;
        return this;
    };
    CheckSettingsFluent.prototype.frame = function (contextOrFrame, scrollRootElement) {
        var _this = this;
        var context = TypeUtils.has(contextOrFrame, 'frame') ? contextOrFrame : { frame: contextOrFrame, scrollRootElement: scrollRootElement };
        if (!this._settings.frames)
            this._settings.frames = [];
        ArgumentGuard.custom(context.frame, function (value) { return _this.isFrameReference(value); }, { name: 'frame' });
        ArgumentGuard.custom(context.scrollRootElement, function (value) { return _this.isElementReference(value); }, {
            name: 'scrollRootElement',
            strict: false
        });
        this._settings.frames.push(context);
        return this;
    };
    CheckSettingsFluent.prototype.ignoreRegion = function (ignoreRegion) {
        if (!this._settings.ignoreRegions)
            this._settings.ignoreRegions = [];
        this._settings.ignoreRegions.push(ignoreRegion);
        return this;
    };
    CheckSettingsFluent.prototype.ignoreRegions = function () {
        var _this = this;
        var ignoreRegions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ignoreRegions[_i] = arguments[_i];
        }
        ignoreRegions.forEach(function (ignoreRegion) { return _this.ignoreRegion(ignoreRegion); });
        return this;
    };
    CheckSettingsFluent.prototype.ignore = function (ignoreRegion) {
        return this.ignoreRegion(ignoreRegion);
    };
    CheckSettingsFluent.prototype.ignores = function () {
        var ignoreRegions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ignoreRegions[_i] = arguments[_i];
        }
        return this.ignoreRegions.apply(this, ignoreRegions);
    };
    CheckSettingsFluent.prototype.layoutRegion = function (layoutRegion) {
        if (!this._settings.layoutRegions)
            this._settings.layoutRegions = [];
        this._settings.layoutRegions.push(layoutRegion);
        return this;
    };
    CheckSettingsFluent.prototype.layoutRegions = function () {
        var _this = this;
        var layoutRegions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            layoutRegions[_i] = arguments[_i];
        }
        layoutRegions.forEach(function (layoutRegion) { return _this.layoutRegion(layoutRegion); });
        return this;
    };
    CheckSettingsFluent.prototype.strictRegion = function (strictRegion) {
        if (!this._settings.strictRegions)
            this._settings.strictRegions = [];
        this._settings.strictRegions.push(strictRegion);
        return this;
    };
    CheckSettingsFluent.prototype.strictRegions = function () {
        var _this = this;
        var regions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            regions[_i] = arguments[_i];
        }
        regions.forEach(function (region) { return _this.strictRegion(region); });
        return this;
    };
    CheckSettingsFluent.prototype.contentRegion = function (region) {
        if (!this._settings.contentRegions)
            this._settings.contentRegions = [];
        this._settings.contentRegions.push(region);
        return this;
    };
    CheckSettingsFluent.prototype.contentRegions = function () {
        var _this = this;
        var regions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            regions[_i] = arguments[_i];
        }
        regions.forEach(function (region) { return _this.contentRegion(region); });
        return this;
    };
    CheckSettingsFluent.prototype.floatingRegion = function (region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
        var _this = this;
        var floatingRegion = TypeUtils.has(region, 'region')
            ? region
            : { region: region, maxUpOffset: maxUpOffset, maxDownOffset: maxDownOffset, maxLeftOffset: maxLeftOffset, maxRightOffset: maxRightOffset };
        ArgumentGuard.custom(floatingRegion.region, function (value) { return _this.isRegionReference(value); }, {
            name: 'region'
        });
        ArgumentGuard.isNumber(floatingRegion.maxUpOffset, { name: 'region' });
        ArgumentGuard.isNumber(floatingRegion.maxDownOffset, { name: 'region' });
        ArgumentGuard.isNumber(floatingRegion.maxLeftOffset, { name: 'region' });
        ArgumentGuard.isNumber(floatingRegion.maxRightOffset, { name: 'region' });
        if (!this._settings.floatingRegions)
            this._settings.floatingRegions = [];
        this._settings.floatingRegions.push(floatingRegion);
        return this;
    };
    CheckSettingsFluent.prototype.floatingRegions = function (regionOrMaxOffset) {
        var _this = this;
        var regions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            regions[_i - 1] = arguments[_i];
        }
        if (TypeUtils.isNumber(regionOrMaxOffset)) {
            var maxOffset_1 = regionOrMaxOffset;
            regions.forEach(function (region) {
                return _this.floatingRegion({
                    region: region,
                    maxUpOffset: maxOffset_1,
                    maxDownOffset: maxOffset_1,
                    maxLeftOffset: maxOffset_1,
                    maxRightOffset: maxOffset_1
                });
            });
        }
        else {
            this.floatingRegion(regionOrMaxOffset);
            regions.forEach(function (floatingRegion) {
                return _this.floatingRegion(floatingRegion);
            });
        }
        return this;
    };
    CheckSettingsFluent.prototype.floating = function (region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
        return this.floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset);
    };
    CheckSettingsFluent.prototype.floatings = function (regionOrMaxOffset) {
        var regions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            regions[_i - 1] = arguments[_i];
        }
        return this.floatingRegions.apply(this, __spreadArrays([regionOrMaxOffset], regions));
    };
    CheckSettingsFluent.prototype.accessibilityRegion = function (region, type) {
        var _this = this;
        var accessibilityRegion = TypeUtils.has(region, 'region') ? region : { region: region, type: type };
        ArgumentGuard.custom(accessibilityRegion.region, function (value) { return _this.isRegionReference(value); }, {
            name: 'region'
        });
        ArgumentGuard.isEnumValue(accessibilityRegion.type, AccessibilityRegionType_1["default"], {
            name: 'type',
            strict: false
        });
        if (!this._settings.accessibilityRegions)
            this._settings.accessibilityRegions = [];
        this._settings.accessibilityRegions.push(accessibilityRegion);
        return this;
    };
    CheckSettingsFluent.prototype.accessibilityRegions = function (regionOrType) {
        var _this = this;
        var regions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            regions[_i - 1] = arguments[_i];
        }
        if (TypeUtils.isEnumValue(regionOrType, AccessibilityRegionType_1["default"])) {
            var type_1 = regionOrType;
            regions.forEach(function (region) { return _this.accessibilityRegion({ region: region, type: type_1 }); });
        }
        else {
            this.accessibilityRegion(regionOrType);
            regions.forEach(function (floatingRegion) {
                return _this.accessibilityRegion(floatingRegion);
            });
        }
        return this;
    };
    CheckSettingsFluent.prototype.accessibility = function (region, type) {
        return this.accessibilityRegion(region, type);
    };
    CheckSettingsFluent.prototype.accessibilities = function (regionOrType) {
        var regions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            regions[_i - 1] = arguments[_i];
        }
        return this.accessibilityRegions.apply(this, __spreadArrays([regionOrType], regions));
    };
    CheckSettingsFluent.prototype.scrollRootElement = function (scrollRootElement) {
        var _this = this;
        ArgumentGuard.custom(scrollRootElement, function (value) { return _this.isElementReference(value); }, {
            name: 'scrollRootElement'
        });
        if (this._settings.frames && this._settings.frames.length > 0) {
            var context = this._settings.frames[this._settings.frames.length - 1];
            context.scrollRootElement = scrollRootElement;
        }
        this._settings.scrollRootElement = scrollRootElement;
        return this;
    };
    CheckSettingsFluent.prototype.fully = function (isFully) {
        if (isFully === void 0) { isFully = true; }
        ArgumentGuard.isBoolean(isFully, { name: 'isFully' });
        this._settings.isFully = isFully;
        return this;
    };
    /** @deprecated */
    CheckSettingsFluent.prototype.stitchContent = function (stitchContent) {
        if (stitchContent === void 0) { stitchContent = true; }
        return this.fully(stitchContent);
    };
    CheckSettingsFluent.prototype.matchLevel = function (matchLevel) {
        ArgumentGuard.isEnumValue(matchLevel, MatchLevel_1["default"], { name: 'matchLevel' });
        this._settings.matchLevel = matchLevel;
        return this;
    };
    CheckSettingsFluent.prototype.layout = function () {
        this._settings.matchLevel = MatchLevel_1["default"].Layout;
        return this;
    };
    CheckSettingsFluent.prototype.exact = function () {
        this._settings.matchLevel = MatchLevel_1["default"].Exact;
        return this;
    };
    CheckSettingsFluent.prototype.strict = function () {
        this._settings.matchLevel = MatchLevel_1["default"].Strict;
        return this;
    };
    CheckSettingsFluent.prototype.content = function () {
        this._settings.matchLevel = MatchLevel_1["default"].Content;
        return this;
    };
    CheckSettingsFluent.prototype.useDom = function (useDom) {
        if (useDom === void 0) { useDom = true; }
        ArgumentGuard.isBoolean(useDom, { name: 'useDom' });
        this._settings.useDom = useDom;
        return this;
    };
    CheckSettingsFluent.prototype.sendDom = function (sendDom) {
        if (sendDom === void 0) { sendDom = true; }
        ArgumentGuard.isBoolean(sendDom, { name: 'sendDom' });
        this._settings.sendDom = sendDom;
        return this;
    };
    CheckSettingsFluent.prototype.enablePatterns = function (enablePatterns) {
        if (enablePatterns === void 0) { enablePatterns = true; }
        ArgumentGuard.isBoolean(enablePatterns, { name: 'enablePatterns' });
        this._settings.enablePatterns = enablePatterns;
        return this;
    };
    CheckSettingsFluent.prototype.ignoreDisplacements = function (ignoreDisplacements) {
        if (ignoreDisplacements === void 0) { ignoreDisplacements = true; }
        ArgumentGuard.isBoolean(ignoreDisplacements, { name: 'ignoreDisplacements' });
        this._settings.ignoreDisplacements = ignoreDisplacements;
        return this;
    };
    CheckSettingsFluent.prototype.ignoreCaret = function (ignoreCaret) {
        if (ignoreCaret === void 0) { ignoreCaret = true; }
        ArgumentGuard.isBoolean(ignoreCaret, { name: 'ignoreCaret' });
        this._settings.ignoreCaret = ignoreCaret;
        return this;
    };
    CheckSettingsFluent.prototype.disableBrowserFetching = function (disableBrowserFetching) {
        ArgumentGuard.isBoolean(disableBrowserFetching, { name: 'disableBrowserFetching' });
        this._settings.disableBrowserFetching = disableBrowserFetching;
        return this;
    };
    CheckSettingsFluent.prototype.layoutBreakpoints = function (layoutBreakpoints) {
        if (layoutBreakpoints === void 0) { layoutBreakpoints = true; }
        if (!TypeUtils.isArray(layoutBreakpoints)) {
            this._settings.layoutBreakpoints = layoutBreakpoints;
        }
        else if (layoutBreakpoints.length === 0) {
            this._settings.layoutBreakpoints = false;
        }
        else {
            this._settings.layoutBreakpoints = Array.from(new Set(layoutBreakpoints)).sort(function (a, b) { return (a < b ? 1 : -1); });
        }
        return this;
    };
    CheckSettingsFluent.prototype.hook = function (name, script) {
        this._settings.hooks[name] = script;
        return this;
    };
    CheckSettingsFluent.prototype.beforeRenderScreenshotHook = function (script) {
        return this.hook('beforeCaptureScreenshot', script);
    };
    /** @deprecated */
    CheckSettingsFluent.prototype.webHook = function (script) {
        return this.beforeRenderScreenshotHook(script);
    };
    CheckSettingsFluent.prototype.visualGridOption = function (key, value) {
        if (!this._settings.visualGridOptions)
            this._settings.visualGridOptions = {};
        this._settings.visualGridOptions[key] = value;
        return this;
    };
    CheckSettingsFluent.prototype.visualGridOptions = function (options) {
        this._settings.visualGridOptions = options;
        return this;
    };
    CheckSettingsFluent.prototype.renderId = function (renderId) {
        ArgumentGuard.isString(renderId, { name: 'renderId' });
        this._settings.renderId = renderId;
        return this;
    };
    CheckSettingsFluent.prototype.timeout = function (timeout) {
        ArgumentGuard.isNumber(timeout, { name: 'timeout' });
        this._settings.timeout = timeout;
        return this;
    };
    CheckSettingsFluent.prototype.toJSON = function () {
        // TODO create a plain object
        return {};
    };
    return CheckSettingsFluent;
}());
exports["default"] = CheckSettingsFluent;
