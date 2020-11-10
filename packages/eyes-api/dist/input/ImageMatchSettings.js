"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExactMatchSettings_1 = require("./ExactMatchSettings");
const Region_1 = require("./Region");
const AccessibilityRegion_1 = require("./AccessibilityRegion");
const MatchLevel_1 = require("../enums/MatchLevel");
const AccessibilityLevel_1 = require("../enums/AccessibilityLevel");
const AccessibilityGuidelinesVersion_1 = require("../enums/AccessibilityGuidelinesVersion");
const ArgumentGuard = require("../utils/ArgumentGuard");
class ImageMatchSettingsData {
    constructor(settings) {
        this._matchLevel = MatchLevel_1.default.Strict;
        this._ignoreCaret = true;
        this._useDom = false;
        this._enablePatterns = false;
        this._ignoreDisplacements = false;
        if (!settings)
            return this;
        const self = this;
        for (const [key, value] of Object.entries(settings)) {
            if (key in this && !key.startsWith('_')) {
                self[key] = value;
            }
        }
    }
    get exact() {
        return this._exact;
    }
    set exact(exact) {
        this._exact = new ExactMatchSettings_1.default(exact);
    }
    getExact() {
        return this._exact;
    }
    setExact(exact) {
        this.exact = exact;
    }
    get matchLevel() {
        return this._matchLevel;
    }
    set matchLevel(matchLevel) {
        ArgumentGuard.isEnumValue(matchLevel, MatchLevel_1.default, { name: 'matchLevel' });
        this._matchLevel = matchLevel;
    }
    getMatchLevel() {
        return this._matchLevel;
    }
    setMatchLevel(matchLevel) {
        this.matchLevel = matchLevel;
    }
    get ignoreCaret() {
        return this._ignoreCaret;
    }
    set ignoreCaret(ignoreCaret) {
        ArgumentGuard.isBoolean(ignoreCaret, { name: 'ignoreCaret', strict: false });
        this._ignoreCaret = ignoreCaret;
    }
    getIgnoreCaret() {
        return this._ignoreCaret;
    }
    setIgnoreCaret(ignoreCaret) {
        this.ignoreCaret = ignoreCaret;
    }
    get useDom() {
        return this._useDom;
    }
    set useDom(useDom) {
        ArgumentGuard.isBoolean(useDom, { name: 'useDom', strict: false });
        this._useDom = useDom;
    }
    getUseDom() {
        return this._useDom;
    }
    setUseDom(useDom) {
        this.useDom = useDom;
    }
    get enablePatterns() {
        return this._enablePatterns;
    }
    set enablePatterns(enablePatterns) {
        ArgumentGuard.isBoolean(enablePatterns, { name: 'enablePatterns', strict: false });
        this._enablePatterns = enablePatterns;
    }
    getEnablePatterns() {
        return this._enablePatterns;
    }
    setEnablePatterns(enablePatterns) {
        this.enablePatterns = enablePatterns;
    }
    get ignoreDisplacements() {
        return this._ignoreDisplacements;
    }
    set ignoreDisplacements(ignoreDisplacements) {
        ArgumentGuard.isBoolean(ignoreDisplacements, { name: 'ignoreDisplacements', strict: false });
        this._ignoreDisplacements = ignoreDisplacements;
    }
    getIgnoreDisplacements() {
        return this._ignoreDisplacements;
    }
    setIgnoreDisplacements(ignoreDisplacements) {
        this.ignoreDisplacements = ignoreDisplacements;
    }
    get ignoreRegions() {
        return this._ignoreRegions;
    }
    set ignoreRegions(ignoreRegions) {
        ArgumentGuard.isArray(ignoreRegions, { name: 'ignoreRegions', strict: false });
        this._ignoreRegions = ignoreRegions ? ignoreRegions.map((region) => new Region_1.default(region)) : [];
    }
    get ignore() {
        return this.ignoreRegions;
    }
    set ignore(ignoreRegions) {
        this.ignoreRegions = ignoreRegions;
    }
    getIgnoreRegions() {
        return this._ignoreRegions;
    }
    setIgnoreRegions(ignoreRegions) {
        this.ignoreRegions = ignoreRegions;
    }
    get layoutRegions() {
        return this._layoutRegions;
    }
    set layoutRegions(layoutRegions) {
        ArgumentGuard.isArray(layoutRegions, { name: 'layoutRegions', strict: false });
        this._layoutRegions = layoutRegions ? layoutRegions.map((region) => new Region_1.default(region)) : [];
    }
    get layout() {
        return this.layoutRegions;
    }
    set layout(layoutRegions) {
        this.layoutRegions = layoutRegions;
    }
    getLayoutRegions() {
        return this._layoutRegions;
    }
    setLayoutRegions(layoutRegions) {
        this.layoutRegions = layoutRegions;
    }
    get strictRegions() {
        return this._strictRegions;
    }
    set strictRegions(strictRegions) {
        ArgumentGuard.isArray(strictRegions, { name: 'strictRegions', strict: false });
        this._strictRegions = strictRegions ? strictRegions.map((region) => new Region_1.default(region)) : [];
    }
    get strict() {
        return this.strictRegions;
    }
    set strict(strictRegions) {
        this.strictRegions = strictRegions;
    }
    getStrictRegions() {
        return this._strictRegions;
    }
    setStrictRegions(strictRegions) {
        this.strictRegions = strictRegions;
    }
    get contentRegions() {
        return this._contentRegions;
    }
    set contentRegions(contentRegions) {
        ArgumentGuard.isArray(contentRegions, { name: 'contentRegions', strict: false });
        this._contentRegions = contentRegions ? contentRegions.map((region) => new Region_1.default(region)) : [];
    }
    get content() {
        return this.contentRegions;
    }
    set content(contentRegions) {
        this.contentRegions = contentRegions;
    }
    getContentRegions() {
        return this._contentRegions;
    }
    setContentRegions(contentRegions) {
        this.contentRegions = contentRegions;
    }
    get floatingRegions() {
        return this._floatingRegions;
    }
    set floatingRegions(floatingRegions) {
        ArgumentGuard.isArray(floatingRegions, { name: 'floatingRegions', strict: false });
        this._floatingRegions = floatingRegions ? floatingRegions.map((region) => new Region_1.default(region)) : [];
    }
    get floating() {
        return this.floatingRegions;
    }
    set floating(floatingRegions) {
        this.floatingRegions = floatingRegions;
    }
    getFloatingRegions() {
        return this._floatingRegions;
    }
    setFloatingRegions(floatingRegions) {
        this.floatingRegions = floatingRegions;
    }
    get accessibilityRegions() {
        return this._accessibilityRegions;
    }
    set accessibilityRegions(accessibilityRegions) {
        ArgumentGuard.isArray(accessibilityRegions, { name: 'accessibilityRegions', strict: false });
        this._accessibilityRegions = accessibilityRegions
            ? accessibilityRegions.map((region) => new AccessibilityRegion_1.default(region))
            : [];
    }
    get accessibility() {
        return this.accessibilityRegions;
    }
    set accessibility(accessibilityRegions) {
        this.accessibilityRegions = accessibilityRegions;
    }
    getAccessibilityRegions() {
        return this._accessibilityRegions;
    }
    setAccessibilityRegions(accessibilityRegions) {
        this.accessibilityRegions = accessibilityRegions;
    }
    get accessibilitySettings() {
        return this._accessibilitySettings;
    }
    set accessibilitySettings(accessibilitySettings) {
        if (accessibilitySettings) {
            const { level, guidelinesVersion } = accessibilitySettings;
            ArgumentGuard.isEnumValue(level, AccessibilityLevel_1.default, { name: 'accessibilitySettings.level' });
            ArgumentGuard.isEnumValue(guidelinesVersion, AccessibilityGuidelinesVersion_1.default, {
                name: 'accessibilitySettings.guidelinesVersion',
            });
        }
        this._accessibilitySettings = accessibilitySettings;
    }
    getAccessibilitySettings() {
        return this._accessibilitySettings;
    }
    setAccessibilitySettings(accessibilitySettings) {
        this._accessibilitySettings = accessibilitySettings;
    }
}
exports.default = ImageMatchSettingsData;
//# sourceMappingURL=ImageMatchSettings.js.map