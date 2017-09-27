'use strict';

const MatchLevel = require('../match/MatchLevel');
const Region = require('../positioning/Region');
const RegionProvider = require('../positioning/RegionProvider');
const FloatingRegionProvider = require('../positioning/FloatingRegionProvider');
const IgnoreRegionByRectangle = require('./IgnoreRegionByRectangle');
const FloatingRegionByRectangle = require('./FloatingRegionByRectangle');

/**
 * The Match settings object to use in the various Eyes.Check methods.
 */
class CheckSettings {

    /**
     * @param {?int} [timeout=-1]
     * @param {Region} [region]
     */
    constructor(timeout = -1, region) {
        this._matchLevel = undefined;
        this._ignoreCaret = undefined;
        this._stitchContent = false;
        this._timeout = timeout;
        this._targetRegion = region;

        this._ignoreRegions =[];
        this._floatingRegions =[];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {CheckSettings}
     */
    layout() {
        this._matchLevel = MatchLevel.Layout;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {CheckSettings}
     */
    exact() {
        this._matchLevel = MatchLevel.Exact;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {CheckSettings}
     */
    strict() {
        this._matchLevel = MatchLevel.Strict;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {CheckSettings}
     */
    content() {
        this._matchLevel = MatchLevel.Content;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {MatchLevel} matchLevel
     * @return {CheckSettings}
     */
    matchLevel(matchLevel) {
        this._matchLevel = matchLevel;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {MatchLevel}
     */
    getMatchLevel() {
        return this._matchLevel;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {Boolean} [ignoreCaret=true]
     * @return {CheckSettings}
     */
    ignoreCaret(ignoreCaret = true) {
        this._ignoreCaret = ignoreCaret;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Boolean}
     */
    getIgnoreCaret() {
        return this._ignoreCaret;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {CheckSettings}
     */
    fully() {
        this._stitchContent = true;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {Boolean} [stitchContent=true]
     * @return {CheckSettings}
     */
    stitchContent(stitchContent = true) {
        this._stitchContent = stitchContent;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Boolean}
     */
    getStitchContent() {
        return this._stitchContent;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {int} timeoutMilliseconds
     * @return {CheckSettings}
     */
    timeout(timeoutMilliseconds) {
        this._timeout = timeoutMilliseconds;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {int}
     */
    getTimeout() {
        return this._timeout;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * TODO: why the name is not setTargetRegion?
     *
     * @protected
     * @param {Region} region
     */
    updateTargetRegion(region) {
        this._targetRegion = region;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Region}
     */
    getTargetRegion() {
        return this._targetRegion;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {RegionProvider|Region} arg
     * @return {CheckSettings}
     */
    ignore(arg) {
        if (arg instanceof Region) {
            this._ignoreRegions.push(new IgnoreRegionByRectangle(arg));
        } else if (arg instanceof RegionProvider) {
            this._ignoreRegions.push(arg);
        } else {
            throw new TypeError("ignore method called with argument of unknown type!");
        }

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {RegionProvider...|Region...} args
     * @return {CheckSettings}
     */
    ignores(...args) {
        if (!args) {
            throw new TypeError("ignores method called without arguments!");
        }

        for (const region in args) {
            // noinspection JSCheckFunctionSignatures
            this.ignore(region);
        }

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {RegionProvider[]}
     */
    getIgnoreRegions() {
        return this._ignoreRegions;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {FloatingRegionProvider|Region} arg
     * @param {int} [maxUpOffset]
     * @param {int} [maxDownOffset]
     * @param {int} [maxLeftOffset]
     * @param {int} [maxRightOffset]
     * @return {CheckSettings}
     */
    floating(arg, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
        if (arg instanceof Region) {
            this._floatingRegions.push(new FloatingRegionByRectangle(Region.fromRegion(arg), maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset));
        } else if (arg instanceof FloatingRegionProvider) {
            this._floatingRegions.push(arg);
        } else {
            throw new TypeError("floating method called with argument of unknown type!");
        }

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {int} maxOffset
     * @param {Region...} regions
     * @return {CheckSettings}
     */
    floatings(maxOffset, ...regions) {
        if (!args) {
            throw new TypeError("floatings method called without arguments!");
        }

        for (const region in regions) {
            // noinspection JSCheckFunctionSignatures
            this.floating(region, maxOffset, maxOffset, maxOffset, maxOffset);
        }

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {FloatingRegionProvider[]}
     */
    getFloatingRegions() {
        return this._floatingRegions;
    }
}

module.exports = CheckSettings;
