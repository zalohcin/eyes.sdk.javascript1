"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArgumentGuard = require("../utils/ArgumentGuard");
const TypeUtils = require("../utils/TypeUtils");
const AccessibilityRegionType_1 = require("../enums/AccessibilityRegionType");
const MatchLevel_1 = require("../enums/MatchLevel");
class CheckSettingsFluent {
    constructor(settings) {
        this._settings = {};
        if (!settings)
            return this;
        if (settings.name)
            this.name(settings.name);
        if (settings.region)
            this.region(settings.region);
        if (settings.frames) {
            settings.frames.forEach((reference) => {
                if (TypeUtils.isNull(reference))
                    return;
                if (TypeUtils.has(reference, 'frame')) {
                    this.frame(reference.frame, reference.scrollRootElement);
                }
                else {
                    this.frame(reference);
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
            settings.ignoreRegions.forEach((ignoreRegion) => this.ignoreRegion(ignoreRegion));
        }
        if (settings.layoutRegions) {
            settings.layoutRegions.forEach((layoutRegion) => this.layoutRegion(layoutRegion));
        }
        if (settings.strictRegions) {
            settings.strictRegions.forEach((strictRegion) => this.strictRegion(strictRegion));
        }
        if (settings.contentRegions) {
            settings.contentRegions.forEach((contentRegion) => this.contentRegion(contentRegion));
        }
        if (settings.floatingRegions) {
            settings.floatingRegions.forEach((floatingRegion) => this.floatingRegion(floatingRegion));
        }
        if (settings.accessibilityRegions) {
            settings.accessibilityRegions.forEach((accessibilityRegion) => this.accessibilityRegion(accessibilityRegion));
        }
        if (!TypeUtils.isNull(settings.disableBrowserFetching))
            this.disableBrowserFetching(settings.disableBrowserFetching);
        if (!TypeUtils.isNull(settings.layoutBreakpoints))
            this.layoutBreakpoints(settings.layoutBreakpoints);
        if (settings.hooks) {
            Object.entries(settings.hooks).forEach(([name, script]) => this.hook(name, script));
        }
        if (settings.visualGridOptions) {
            Object.entries(settings.visualGridOptions).forEach(([key, value]) => this.visualGridOption(key, value));
        }
        if (settings.renderId)
            this.renderId(settings.renderId);
        if (!TypeUtils.isNull(settings.timeout))
            this.timeout(settings.timeout);
    }
    isFrameReference(value) {
        return TypeUtils.isNumber(value) || TypeUtils.isString(value) || this.isElementReference(value);
    }
    isRegionReference(value) {
        return (TypeUtils.has(value, ['x', 'y', 'width', 'height']) ||
            TypeUtils.has(value, ['left', 'top', 'width', 'height']) ||
            this.isElementReference(value));
    }
    isElementReference(value) {
        return this._spec.isElement(value) || this._spec.isSelector(value);
    }
    name(name) {
        ArgumentGuard.isString(name, { name: 'name' });
        this._settings.name = name;
        return this;
    }
    withName(name) {
        return this.name(name);
    }
    region(region) {
        ArgumentGuard.custom(region, (value) => this.isRegionReference(value), { name: 'region' });
        this._settings.region = region;
        return this;
    }
    frame(contextOrFrame, scrollRootElement) {
        const context = TypeUtils.has(contextOrFrame, 'frame')
            ? contextOrFrame
            : { frame: contextOrFrame, scrollRootElement };
        if (!this._settings.frames)
            this._settings.frames = [];
        ArgumentGuard.custom(context.frame, (value) => this.isFrameReference(value), { name: 'frame' });
        ArgumentGuard.custom(context.scrollRootElement, (value) => this.isElementReference(value), {
            name: 'scrollRootElement',
            strict: false,
        });
        this._settings.frames.push(context);
        return this;
    }
    ignoreRegion(ignoreRegion) {
        if (!this._settings.ignoreRegions)
            this._settings.ignoreRegions = [];
        this._settings.ignoreRegions.push(ignoreRegion);
        return this;
    }
    ignoreRegions(...ignoreRegions) {
        ignoreRegions.forEach((ignoreRegion) => this.ignoreRegion(ignoreRegion));
        return this;
    }
    ignore(ignoreRegion) {
        return this.ignoreRegion(ignoreRegion);
    }
    ignores(...ignoreRegions) {
        return this.ignoreRegions(...ignoreRegions);
    }
    layoutRegion(layoutRegion) {
        if (!this._settings.layoutRegions)
            this._settings.layoutRegions = [];
        this._settings.layoutRegions.push(layoutRegion);
        return this;
    }
    layoutRegions(...layoutRegions) {
        layoutRegions.forEach((layoutRegion) => this.layoutRegion(layoutRegion));
        return this;
    }
    strictRegion(strictRegion) {
        if (!this._settings.strictRegions)
            this._settings.strictRegions = [];
        this._settings.strictRegions.push(strictRegion);
        return this;
    }
    strictRegions(...regions) {
        regions.forEach((region) => this.strictRegion(region));
        return this;
    }
    contentRegion(region) {
        if (!this._settings.contentRegions)
            this._settings.contentRegions = [];
        this._settings.contentRegions.push(region);
        return this;
    }
    contentRegions(...regions) {
        regions.forEach((region) => this.contentRegion(region));
        return this;
    }
    floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
        const floatingRegion = TypeUtils.has(region, 'region')
            ? region
            : { region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset };
        ArgumentGuard.custom(floatingRegion.region, (value) => this.isRegionReference(value), {
            name: 'region',
        });
        ArgumentGuard.isNumber(floatingRegion.maxUpOffset, { name: 'region' });
        ArgumentGuard.isNumber(floatingRegion.maxDownOffset, { name: 'region' });
        ArgumentGuard.isNumber(floatingRegion.maxLeftOffset, { name: 'region' });
        ArgumentGuard.isNumber(floatingRegion.maxRightOffset, { name: 'region' });
        if (!this._settings.floatingRegions)
            this._settings.floatingRegions = [];
        this._settings.floatingRegions.push(floatingRegion);
        return this;
    }
    floatingRegions(regionOrMaxOffset, ...regions) {
        if (TypeUtils.isNumber(regionOrMaxOffset)) {
            const maxOffset = regionOrMaxOffset;
            regions.forEach((region) => this.floatingRegion({
                region,
                maxUpOffset: maxOffset,
                maxDownOffset: maxOffset,
                maxLeftOffset: maxOffset,
                maxRightOffset: maxOffset,
            }));
        }
        else {
            this.floatingRegion(regionOrMaxOffset);
            regions.forEach((floatingRegion) => this.floatingRegion(floatingRegion));
        }
        return this;
    }
    floating(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
        return this.floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset);
    }
    floatings(regionOrMaxOffset, ...regions) {
        return this.floatingRegions(regionOrMaxOffset, ...regions);
    }
    accessibilityRegion(region, type) {
        const accessibilityRegion = TypeUtils.has(region, 'region') ? region : { region, type };
        ArgumentGuard.custom(accessibilityRegion.region, (value) => this.isRegionReference(value), {
            name: 'region',
        });
        ArgumentGuard.isEnumValue(accessibilityRegion.type, AccessibilityRegionType_1.default, {
            name: 'type',
            strict: false,
        });
        if (!this._settings.accessibilityRegions)
            this._settings.accessibilityRegions = [];
        this._settings.accessibilityRegions.push(accessibilityRegion);
        return this;
    }
    accessibilityRegions(regionOrType, ...regions) {
        if (TypeUtils.isEnumValue(regionOrType, AccessibilityRegionType_1.default)) {
            const type = regionOrType;
            regions.forEach((region) => this.accessibilityRegion({ region, type }));
        }
        else {
            this.accessibilityRegion(regionOrType);
            regions.forEach((floatingRegion) => this.accessibilityRegion(floatingRegion));
        }
        return this;
    }
    accessibility(region, type) {
        return this.accessibilityRegion(region, type);
    }
    accessibilities(regionOrType, ...regions) {
        return this.accessibilityRegions(regionOrType, ...regions);
    }
    scrollRootElement(scrollRootElement) {
        ArgumentGuard.custom(scrollRootElement, (value) => this.isElementReference(value), {
            name: 'scrollRootElement',
        });
        if (this._settings.frames && this._settings.frames.length > 0) {
            const context = this._settings.frames[this._settings.frames.length - 1];
            context.scrollRootElement = scrollRootElement;
        }
        this._settings.scrollRootElement = scrollRootElement;
        return this;
    }
    fully(isFully = true) {
        ArgumentGuard.isBoolean(isFully, { name: 'isFully' });
        this._settings.isFully = isFully;
        return this;
    }
    stitchContent(stitchContent = true) {
        return this.fully(stitchContent);
    }
    matchLevel(matchLevel) {
        ArgumentGuard.isEnumValue(matchLevel, MatchLevel_1.default, { name: 'matchLevel' });
        this._settings.matchLevel = matchLevel;
        return this;
    }
    layout() {
        this._settings.matchLevel = MatchLevel_1.default.Layout;
        return this;
    }
    exact() {
        this._settings.matchLevel = MatchLevel_1.default.Exact;
        return this;
    }
    strict() {
        this._settings.matchLevel = MatchLevel_1.default.Strict;
        return this;
    }
    content() {
        this._settings.matchLevel = MatchLevel_1.default.Content;
        return this;
    }
    useDom(useDom = true) {
        ArgumentGuard.isBoolean(useDom, { name: 'useDom' });
        this._settings.useDom = useDom;
        return this;
    }
    sendDom(sendDom = true) {
        ArgumentGuard.isBoolean(sendDom, { name: 'sendDom' });
        this._settings.sendDom = sendDom;
        return this;
    }
    enablePatterns(enablePatterns = true) {
        ArgumentGuard.isBoolean(enablePatterns, { name: 'enablePatterns' });
        this._settings.enablePatterns = enablePatterns;
        return this;
    }
    ignoreDisplacements(ignoreDisplacements = true) {
        ArgumentGuard.isBoolean(ignoreDisplacements, { name: 'ignoreDisplacements' });
        this._settings.ignoreDisplacements = ignoreDisplacements;
        return this;
    }
    ignoreCaret(ignoreCaret = true) {
        ArgumentGuard.isBoolean(ignoreCaret, { name: 'ignoreCaret' });
        this._settings.ignoreCaret = ignoreCaret;
        return this;
    }
    disableBrowserFetching(disableBrowserFetching) {
        ArgumentGuard.isBoolean(disableBrowserFetching, { name: 'disableBrowserFetching' });
        this._settings.disableBrowserFetching = disableBrowserFetching;
        return this;
    }
    layoutBreakpoints(layoutBreakpoints = true) {
        if (!TypeUtils.isArray(layoutBreakpoints)) {
            this._settings.layoutBreakpoints = layoutBreakpoints;
        }
        else if (layoutBreakpoints.length === 0) {
            this._settings.layoutBreakpoints = false;
        }
        else {
            this._settings.layoutBreakpoints = Array.from(new Set(layoutBreakpoints)).sort((a, b) => a < b ? 1 : -1);
        }
        return this;
    }
    hook(name, script) {
        this._settings.hooks[name] = script;
        return this;
    }
    beforeRenderScreenshotHook(script) {
        return this.hook('beforeCaptureScreenshot', script);
    }
    webHook(script) {
        return this.beforeRenderScreenshotHook(script);
    }
    visualGridOption(key, value) {
        if (!this._settings.visualGridOptions)
            this._settings.visualGridOptions = {};
        this._settings.visualGridOptions[key] = value;
        return this;
    }
    visualGridOptions(options) {
        this._settings.visualGridOptions = options;
        return this;
    }
    renderId(renderId) {
        ArgumentGuard.isString(renderId, { name: 'renderId' });
        this._settings.renderId = renderId;
        return this;
    }
    timeout(timeout) {
        ArgumentGuard.isNumber(timeout, { name: 'timeout' });
        this._settings.timeout = timeout;
        return this;
    }
    toJSON() {
        return {};
    }
}
exports.default = CheckSettingsFluent;
//# sourceMappingURL=CheckSettings.js.map