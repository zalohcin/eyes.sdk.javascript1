'use strict';

const {GeneralUtils} = require('eyes.sdk');

const EyesRemoteWebElement = require('./EyesRemoteWebElement');

// functions in ElementFinder that return a new ElementFinder and therefore we must wrap and return our own
const ELEMENT_FINDER_TO_ELEMENT_FINDER_FUNCTIONS = ['element', '$', 'evaluate', 'allowAnimations'];
// functions in ElementFinder that return a new ElementArrayFinder and therefore we must wrap and return our own
const ELEMENT_FINDER_TO_ELEMENT_ARRAY_FINDER_FUNCTIONS = ['all', '$$'];
// function in ElementArrayFinder that return a new ElementFinder and therefore we must wrap and return our own
const ELEMENT_ARRAY_FINDER_TO_ELEMENT_FINDER_FUNCTIONS = ['get', 'first', 'last'];


/**
 * Wraps Protractor's ElementFinder to make sure we return our own Web Element.
 */
class ElementFinderWrapper {

    /**
     * Wrapper for ElementFinder object from Protractor
     *
     * @param {ElementFinder} finder
     * @param {EyesWebDriver} eyesDriver
     * @param {Logger} logger
     **/
    constructor(finder, eyesDriver, logger) {
        GeneralUtils.mixin(this, finder);

        this._logger = logger;
        this._eyesDriver = eyesDriver;
        this._finder = finder;

        const that = this;
        ELEMENT_FINDER_TO_ELEMENT_FINDER_FUNCTIONS.forEach(fnName => {
            that[fnName] = (...args) => new ElementFinderWrapper(that._finder[fnName](...args), that._eyesDriver, that._logger);
        });

        ELEMENT_FINDER_TO_ELEMENT_ARRAY_FINDER_FUNCTIONS.forEach(fnName => {
            that[fnName] = (...args) => new ElementArrayFinderWrapper(that._finder[fnName](...args), that._eyesDriver, that._logger);
        });
    }

    /**
     * Wrap the getWebElement function
     *
     * @return {EyesRemoteWebElement}
     */
    getWebElement() {
        this._logger.verbose("ElementFinderWrapper:getWebElement - called");
        return new EyesRemoteWebElement(this._finder.getWebElement.apply(this._finder), this._eyesDriver, this._logger);
    }

    /**
     * Wrap the click function
     *
     * @return {Promise.<EyesRemoteWebElement>}
     */
    click() {
        this._logger.verbose("ElementFinderWrapper:click - called");
        const element = this.getWebElement();
        return element.click.apply(element);
    }

    /**
     * Wrap the functions that return objects that require pre-wrapping
     *
     * @return {Promise.<EyesRemoteWebElement>}
     */
    sendKeys(...args) {
        this._logger.verbose("ElementFinderWrapper:sendKeys - called");
        const element = this.getWebElement();
        return element.sendKeys(...args);
    }
}

class ElementArrayFinderWrapper {

    /**
     * Wrapper for ElementArrayFinder object from Protractor
     *
     * @param {ElementArrayFinder} arrayFinder
     * @param {EyesWebDriver} eyesDriver
     * @param {Logger} logger
     **/
    constructor(arrayFinder, eyesDriver, logger) {
        GeneralUtils.mixin(this, arrayFinder);

        this._logger = logger;
        this._eyesDriver = eyesDriver;
        this._arrayFinder = arrayFinder;

        const that = this;
        // Wrap the functions that return objects that require pre-wrapping
        ELEMENT_ARRAY_FINDER_TO_ELEMENT_FINDER_FUNCTIONS.forEach(fnName => {
            that[fnName] = (...args) => new ElementFinderWrapper(that._arrayFinder[fnName](...args), that._eyesDriver, that._logger);
        });

        // Patch this internal function.
        const originalFn = that._arrayFinder.asElementFinders_;
        that._arrayFinder.asElementFinders_ = () => originalFn.apply(that._arrayFinder).then(arr => {
            const list = [];
            arr.forEach(finder => {
                list.push(new ElementFinderWrapper(finder, that._eyesDriver, that._logger));
            });
            return list;
        })
    }

    /**
     * Wrap the getWebElements function
     *
     * @return {Promise.<EyesRemoteWebElement[]>}
     */
    getWebElements() {
        const that = this;
        that._logger.verbose("ElementArrayFinderWrapper:getWebElements - called");
        return that._arrayFinder.getWebElements.apply(that._arrayFinder).then(elements => {
            const res = [];
            elements.forEach(el => {
                res.push(new EyesRemoteWebElement(el, that._eyesDriver, that._logger));
            });
            return res;
        });
    }
}

module.exports.ElementFinderWrapper = ElementFinderWrapper;
module.exports.ElementArrayFinderWrapper = ElementArrayFinderWrapper;