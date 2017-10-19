'use strict';

const webdriver = require('selenium-webdriver');
const {GeneralUtils} = require('eyes.sdk');

const Frame = require('../frames/Frame');
const FrameChain = require('../frames/FrameChain');
const EyesSeleniumUtils = require('../EyesSeleniumUtils');
const EyesRemoteWebElement = require('./EyesRemoteWebElement');
const ScrollPositionProvider = require('../positioning/ScrollPositionProvider');
const EyesTargetLocator = require('./EyesTargetLocator');

/**
 * An Eyes implementation of the interfaces implemented by {@link WebDriver}.
 * Used so we'll be able to return the users an object with the same functionality as {@link WebDriver}.
 */
class EyesWebDriver {

    /**
     * @param {Logger} logger
     * @param {Eyes} eyes
     * @param {WebDriver} driver
     * @param {PromiseFactory} promiseFactory
     **/
    constructor(logger, eyes, driver, promiseFactory) {
        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(eyes, "eyes");
        ArgumentGuard.notNull(driver, "driver");
        ArgumentGuard.notNull(promiseFactory, "promiseFactory");

        this._logger = logger;
        this._eyes = eyes;
        this._driver = driver;
        this._promiseFactory = promiseFactory;

        this._rotation = null;
        this._elementsIds = new Map();
        this._frameChain = new FrameChain(logger);
        this._defaultContentViewportSize = null;

        // // initializing "touch" if possible
        // let executeMethod = null;
        // try {
        //     executeMethod = new RemoteExecuteMethod(driver);
        // } catch (err) {
        //     // If an exception occurred, we simply won't instantiate "touch".
        // }
        //
        // if (executeMethod) {
        //     touch = new EyesTouchScreen(logger, this, new RemoteTouchScreen(executeMethod));
        // } else {
        //     touch = null;
        // }

       this._logger.verbose("Driver session is " + this.getSessionId());

        // /** @type webdriver.By|ProtractorBy */
        // this._byFunctions = eyes._isProtractorLoaded ? global.by : webdriver.By;
        // this.setRemoteWebDriver(remoteWebDriver);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {Eyes}
     */
    getEyes() {
        return this._eyes;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {WebDriver}
     */
    getRemoteWebDriver() {
        return this._driver;
    }

    /**
     * @return {ImageRotation} The image rotation data.
     */
    getRotation() {
        return this._rotation;
    }

    /**
     * @param {ImageRotation} rotation The image rotation data.
     */
    setRotation(rotation) {
        this._rotation = rotation;
    }

    //noinspection JSUnusedGlobalSymbols
    setRemoteWebDriver(remoteWebDriver) {
        this._driver = remoteWebDriver;
        GeneralUtils.mixin(this, remoteWebDriver);

        // remove then method, which comes from thenableWebDriver (Selenium 3+)
        delete this.then;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {Promise<String>}
     */
    getUserAgent() {
        return this._driver.executeScript('return navigator.userAgent;');
    }

    //noinspection JSCheckFunctionSignatures
    /**
     * @param {webdriver.By|ProtractorBy} locator
     * @return {EyesRemoteWebElement}
     */
    findElement(locator) {
        const that = this;
        return new EyesRemoteWebElement(that._driver.findElement(locator), that, that._logger);
    }

    //noinspection JSCheckFunctionSignatures
    /**
     * @param {webdriver.By|ProtractorBy} locator
     * @return {Promise.<EyesRemoteWebElement[]>}
     */
    findElements(locator) {
        const that = this;
        return this._driver.findElements(locator).then(elements => elements.map(element => new EyesRemoteWebElement(element, that, that._logger)));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {String} cssSelector
     * @return {EyesRemoteWebElement}
     */
    findElementByCssSelector(cssSelector) {
        return this.findElement(this._byFunctions.css(cssSelector));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {String} cssSelector
     * @return {Promise.<EyesRemoteWebElement[]>}
     */
    findElementsByCssSelector(cssSelector) {
        return this.findElements(this._byFunctions.css(cssSelector));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {String} name
     * @return {EyesRemoteWebElement}
     */
    findElementById(name) {
        return this.findElement(this._byFunctions.id(name));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {String} name
     * @return {Promise.<EyesRemoteWebElement[]>}
     */
    findElementsById(name) {
        return this.findElements(this._byFunctions.id(name));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {String} name
     * @return {EyesRemoteWebElement}
     */
    findElementByName(name) {
        return this.findElement(this._byFunctions.name(name));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {String} name
     * @return {Promise.<EyesRemoteWebElement[]>}
     */
    findElementsByName(name) {
        return this.findElements(this._byFunctions.name(name));
    }

    //  EyesWebDriver.prototype.init = function () {
    //    return new Promise(function (resolve) {
    //      this._driver.getCapabilities().then(function (capabilities) {
    //        if (!capabilities.has(webdriver.Capability.TAKES_SCREENSHOT)) {
    //          this._screenshotTaker = new ScreenshotTaker();
    //        }
    //        resolve();
    //      }.bind(this));
    //    }.bind(this));
    //  };

    /**
     * @return {EyesTargetLocator}
     */
    switchTo() {
        const that = this;
        this._logger.verbose("switchTo()");

        class OnWillSwitch {
            /**
             * @param {EyesTargetLocator.TargetType} targetType
             * @param {EyesRemoteWebElement|WebElement} targetFrame
             * @return {Promise<void>}
             */
            static willSwitchToFrame(targetType, targetFrame) {
                that._logger.verbose("willSwitchToFrame()");
                switch (targetType) {
                    case EyesTargetLocator.TargetType.DEFAULT_CONTENT:
                        that._logger.verbose("Default content.");
                        that._frameChain.clear();
                        return that._promiseFactory.makePromise(resolve => {
                            resolve();
                        });
                    case EyesTargetLocator.TargetType.PARENT_FRAME:
                        that._logger.verbose("Parent frame.");
                        that._frameChain.pop();
                        return that._promiseFactory.makePromise(resolve => {
                            resolve();
                        });
                    default: // Switching into a frame
                        that._logger.verbose("Frame");

                        let frameId, pl, sp, size;
                        return targetFrame.getId()
                            .then(_id => {
                                frameId = _id;
                                return targetFrame.getLocation();
                            })
                            .then(_location => {
                                pl = _location;
                                return targetFrame.getSize();
                            })
                            .then(_size => {
                                size = _size;
                                return new ScrollPositionProvider(that._logger, that._driver, that._promiseFactory).getCurrentPosition();
                            })
                            .then(_scrollPosition => {
                                sp = _scrollPosition;

                                // Get the frame's content location.
                                return EyesSeleniumUtils.getLocationWithBordersAddition(that._logger, targetFrame, pl, that._promiseFactory);
                            }).then(contentLocation => {
                                that._frameChain.push(new Frame(that._logger, targetFrame, frameId, contentLocation, size, sp));
                                that._logger.verbose("Done!");
                            });
                }
            }

            //noinspection JSUnusedLocalSymbols
            static willSwitchToWindow(nameOrHandle) {
                that._logger.verbose("willSwitchToWindow()");
                that._frameChain.clear();
                that._logger.verbose("Done!");
                return that._promiseFactory.makePromise(resolve => {
                    resolve();
                });
            }
        }

        return new EyesTargetLocator(this._logger, this, this._driver.switchTo(), OnWillSwitch, this._promiseFactory);
    }

    /**
     * @param {boolean} forceQuery If true, we will perform the query even if we have a cached viewport size.
     * @return {Promise<{width: number, height: number}>} The viewport size of the default content (outer most frame).
     */
    getDefaultContentViewportSize(forceQuery = false) {
        const that = this;
        return this._promiseFactory.makePromise(resolve => {
            that._logger.verbose("getDefaultContentViewportSize()");

            if (that._defaultContentViewportSize !== null && !forceQuery) {
                that._logger.verbose("Using cached viewport size: ", that._defaultContentViewportSize);
                resolve(that._defaultContentViewportSize);
                return;
            }

            const currentFrames = that.getFrameChain();
            const promise = that._promiseFactory.makePromise(resolve => {
                resolve();
            });

            // Optimization
            if (currentFrames.size() > 0) {
                promise.then(() => that.switchTo().defaultContent());
            }

            promise.then(() => {
                that._logger.verbose("Extracting viewport size...");
                return EyesSeleniumUtils.getViewportSizeOrDisplaySize(that._logger, that._driver, that._promiseFactory);
            }).then(viewportSize => {
                that._defaultContentViewportSize = viewportSize;
                that._logger.verbose("Done! Viewport size: ", that._defaultContentViewportSize);
            });

            if (currentFrames.size() > 0) {
                promise.then(() => that.switchTo().frames(currentFrames));
            }

            promise.then(() => {
                resolve(that._defaultContentViewportSize);
            });
        });
    }

    /**
     *
     * @return {FrameChain} A copy of the current frame chain.
     */
    getFrameChain() {
        return new FrameChain(this._logger, this._frameChain);
    }

    /**
     *
     * @return {String} A copy of the current frame chain.
     */
    getSessionId() {
        return this._driver.getSession().getId();
    }
}

module.exports = EyesWebDriver;
