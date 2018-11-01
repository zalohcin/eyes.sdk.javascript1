'use strict';

const { GeneralUtils } = require('../utils/GeneralUtils');
const { Region } = require('../geometry/Region');
const { FloatingMatchSettings } = require('../match/FloatingMatchSettings');

class ImageMatchSettings {
  constructor() {
    this._matchLevel = undefined;
    this._ignore = undefined;
    this._strict = undefined;
    this._content = undefined;
    this._layout = undefined;
    this._floating = undefined;
    this._splitTopHeight = undefined;
    this._splitBottomHeight = undefined;
    this._ignoreCaret = undefined;
    this._scale = undefined;
    this._remainder = undefined;
  }

  /**
   * @deprecated
   * @param {object} object
   * @return {ImageMatchSettings}
   */
  static fromObject(object) {
    return GeneralUtils.assignTo(new ImageMatchSettings(), object, {
      ignore: results => Array.from(results).map(result => new Region(result)),
      strict: results => Array.from(results).map(result => new Region(result)),
      content: results => Array.from(results).map(result => new Region(result)),
      layout: results => Array.from(results).map(result => new Region(result)),
      floating: results => Array.from(results).map(result => new FloatingMatchSettings(result)),
    });
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {MatchLevel} */
  getMatchLevel() {
    return this._matchLevel;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {MatchLevel} value */
  setMatchLevel(value) {
    this._matchLevel = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {Region[]} */
  getIgnore() {
    return this._ignore;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {Region[]} value */
  setIgnore(value) {
    this._ignore = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {Region[]} */
  getStrict() {
    return this._strict;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {Region[]} value */
  setStrict(value) {
    this._strict = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {Region[]} */
  getContent() {
    return this._content;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {Region[]} value */
  setContent(value) {
    this._content = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {Region[]} */
  getLayout() {
    return this._layout;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {Region[]} value */
  setLayout(value) {
    this._layout = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {FloatingMatchSettings[]} */
  getFloating() {
    return this._floating;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {FloatingMatchSettings[]} value */
  setFloating(value) {
    this._floating = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {number} */
  getSplitTopHeight() {
    return this._splitTopHeight;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {number} value */
  setSplitTopHeight(value) {
    this._splitTopHeight = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {number} */
  getSplitBottomHeight() {
    return this._splitBottomHeight;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {number} value */
  setSplitBottomHeight(value) {
    this._splitBottomHeight = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {boolean} */
  getIgnoreCaret() {
    return this._ignoreCaret;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {boolean} value */
  setIgnoreCaret(value) {
    this._ignoreCaret = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {number} */
  getScale() {
    return this._scale;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {number} value */
  setScale(value) {
    this._scale = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @return {number} */
  getRemainder() {
    return this._remainder;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @param {number} value */
  setRemainder(value) {
    this._remainder = value;
  }

  /** @override */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }

  /** @override */
  toString() {
    return `ImageMatchSettings { ${JSON.stringify(this)} }`;
  }
}

exports.ImageMatchSettings = ImageMatchSettings;
