'use strict';

const { GeneralUtils } = require('@applitools/eyes-common');

class SpecificTestContextRequirements {
  /**
   * @param {Eyes} eyes
   * @param {string} testName
   */
  constructor(eyes, testName) {
    this._eyes = eyes;
    this._wrappedDriver = undefined;
    this._webDriver = undefined;
    this._testName = testName;

    this._expectedProperties = new Map();
    this._expectedIgnoreRegions = [];
    this._expectedLayoutRegions = [];
    this._expectedStrictRegions = [];
    this._expectedContentRegions = [];
    this._expectedFloatingRegions = [];
    this._expectedAccessibilityRegions = [];
  }

  /**
   * @return {Eyes}
   */
  getEyes() {
    return this._eyes;
  }

  /**
   * @return {string}
   */
  getTestName() {
    return this._testName;
  }

  /**
   * @return {EyesWebDriver}
   */
  getWrappedDriver() {
    return this._wrappedDriver;
  }

  /**
   * @param {EyesWebDriver} value
   */
  setWrappedDriver(value) {
    this._wrappedDriver = value;
  }

  /**
   * @return {IWebDriver}
   */
  getWebDriver() {
    return this._webDriver;
  }

  /**
   * @param {IWebDriver} value
   */
  setWebDriver(value) {
    this._webDriver = value;
  }

  /**
   * @return {Map<string, object>}
   */
  getExpectedProperties() {
    return this._expectedProperties;
  }

  /**
   * @param {Map<string, object>} value
   */
  setExpectedProperties(value) {
    this._expectedProperties = value;
  }

  /**
   * @return {Region[]}
   */
  getExpectedIgnoreRegions() {
    return this._expectedIgnoreRegions;
  }

  /**
   * @param {Region[]} value
   */
  setExpectedIgnoreRegions(value) {
    this._expectedIgnoreRegions = value;
  }

  /**
   * @return {Region[]}
   */
  getExpectedStrictRegions() {
    return this._expectedStrictRegions;
  }

  /**
   * @param {Region[]} value
   */
  setExpectedStrictRegions(value) {
    this._expectedStrictRegions = value;
  }

  /**
   * @return {Region[]}
   */
  getExpectedLayoutRegions() {
    return this._expectedLayoutRegions;
  }

  /**
   * @param {Region[]} value
   */
  setExpectedLayoutRegions(value) {
    this._expectedLayoutRegions = value;
  }

  /**
   * @return {Region[]}
   */
  getExpectedContentRegions() {
    return this._expectedContentRegions;
  }

  /**
   * @param {Region[]} value
   */
  setExpectedContentRegions(value) {
    this._expectedContentRegions = value;
  }

  /**
   * @return {FloatingMatchSettings[]}
   */
  getExpectedFloatingRegions() {
    return this._expectedFloatingRegions;
  }

  /**
   * @param {FloatingMatchSettings[]} value
   */
  setExpectedFloatingRegions(value) {
    this._expectedFloatingRegions = value;
  }

  /**
   * @return {AccessibilityRegionByRectangle[]}
   */
  getExpectedAccessibilityRegions() {
    return this._expectedAccessibilityRegions;
  }

  /**
   * @param {AccessibilityRegionByRectangle[]} value
   */
  setExpectedAccessibilityRegions(value) {
    this._expectedAccessibilityRegions = value;
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this, ['_eyes', '_webDriver', '_wrappedDriver']);
  }
}

exports.SpecificTestContextRequirements = SpecificTestContextRequirements;
