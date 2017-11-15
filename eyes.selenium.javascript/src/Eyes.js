'use strict';

const {WebDriver} = require('selenium-webdriver');
const {
    EyesBase, FixedScaleProviderFactory, NullScaleProvider, RegionProvider, NullRegionProvider,
    ScaleProviderIdentityFactory, PromiseFactory, ArgumentGuard, SimplePropertyHandler,
    Logger, CoordinatesType, ContextBasedScaleProviderFactory, TestFailedError,
    EyesError, UserAgent, ReadOnlyPropertyHandler, Region, Location, RectangleSize
} = require('eyes.sdk');

const ImageProviderFactory = require('./capture/ImageProviderFactory');
const EyesWebDriverScreenshotFactory = require('./capture/EyesWebDriverScreenshotFactory');
const FullPageCaptureAlgorithm = require('./capture/FullPageCaptureAlgorithm');
const FrameChain = require('./frames/FrameChain');
const RegionPositionCompensationFactory = require('./positioning/RegionPositionCompensationFactory');
const EyesWebDriver = require('./wrappers/EyesWebDriver');
const EyesSeleniumUtils = require('./EyesSeleniumUtils');
const EyesWebElement = require('./wrappers/EyesWebElement');
const EyesWebDriverScreenshot = require('./capture/EyesWebDriverScreenshot');
const ScrollPositionProvider = require('./positioning/ScrollPositionProvider');
const CssTranslatePositionProvider = require('./positioning/CssTranslatePositionProvider');
const ElementPositionProvider = require('./positioning/ElementPositionProvider');
const MoveToRegionVisibilityStrategy = require('./regionVisibility/MoveToRegionVisibilityStrategy');
const NopRegionVisibilityStrategy = require('./regionVisibility/NopRegionVisibilityStrategy');
const SeleniumJavaScriptExecutor = require('./SeleniumJavaScriptExecutor');
const StitchMode = require('./StitchMode');
const Target = require('./fluent/Target');

const VERSION = require('../package.json').version;

const DEFAULT_STITCHING_OVERLAP = 50; // px
const DEFAULT_WAIT_BEFORE_SCREENSHOTS = 100; // Milliseconds
const DEFAULT_WAIT_SCROLL_STABILIZATION = 200; // Milliseconds

/**
 * The main API gateway for the SDK.
 */
class Eyes extends EyesBase {

    /**
     * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
     *
     * @param {String} [serverUrl] The Eyes server URL.
     * @param {Boolean} [isDisabled] Set to true to disable Applitools Eyes and use the webdriver directly.
     **/
    constructor(serverUrl = EyesBase.DEFAULT_EYES_SERVER, isDisabled = false) {
        const promiseFactory = new PromiseFactory();
        super(promiseFactory, serverUrl, isDisabled);

        /** @type {EyesWebDriver} */
        this._driver = undefined;
        /** @type {boolean} */
        this._dontGetTitle = false;

        /** @type {boolean} */
        this._forceFullPageScreenshot = false;
        /** @type {boolean} */
        this._checkFrameOrElement = false;

        /** @type {Region} */
        this._regionToCheck = null;
        /** @type {boolean} */
        this._hideScrollbars = false;
        /** @type {ImageRotation} */
        this._rotation = undefined;
        /** @type {number} */
        this._devicePixelRatio = Eyes.UNKNOWN_DEVICE_PIXEL_RATIO;
        /** @type {StitchMode} */
        this._stitchMode = StitchMode.SCROLL;
        /** @type {int} */
        this._waitBeforeScreenshots = DEFAULT_WAIT_BEFORE_SCREENSHOTS;
        /** @type {RegionVisibilityStrategy} */
        this._regionVisibilityStrategy = new MoveToRegionVisibilityStrategy(this._logger, this.getPromiseFactory());
        /** @type {ElementPositionProvider} */
        this._elementPositionProvider = undefined;
        /** @type {SeleniumJavaScriptExecutor} */
        this._jsExecutor = undefined;

        /** @type {UserAgent} */
        this._userAgent = undefined;
        /** @type {ImageProvider} */
        this._imageProvider = undefined;
        /** @type {RegionPositionCompensation} */
        this._regionPositionCompensation = undefined;

        /** @type {boolean} */
        this._stitchContent = false;
        /** @type {int} */
        this._stitchingOverlap = DEFAULT_STITCHING_OVERLAP;

        this._imageRotationDegrees = 0;
        this._automaticRotation = true;
    }

    // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
    /**
     * @override
     */
    getBaseAgentId() {
        return `selenium-js/${VERSION}`;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Region}
     */
    getRegionToCheck() {
        return this._regionToCheck;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {boolean}
     */
    shouldStitchContent() {
        return this._stitchContent;
    }

    /**
     * @return {?EyesWebDriver}
     */
    getDriver() {
        return this._driver;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Forces a full page screenshot (by scrolling and stitching) if the browser only supports viewport screenshots).
     *
     * @param {boolean} shouldForce Whether to force a full page screenshot or not.
     */
    setForceFullPageScreenshot(shouldForce) {
        this._forceFullPageScreenshot = shouldForce;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {boolean} Whether Eyes should force a full page screenshot.
     */
    getForceFullPageScreenshot() {
        return this._forceFullPageScreenshot;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Sets the time to wait just before taking a screenshot (e.g., to allow positioning to stabilize when performing a full page stitching).
     *
     * @param {int} waitBeforeScreenshots The time to wait (Milliseconds). Values smaller or equal to 0, will cause the default value to be used.
     */
    setWaitBeforeScreenshots(waitBeforeScreenshots) {
        if (waitBeforeScreenshots <= 0) {
            this._waitBeforeScreenshots = DEFAULT_WAIT_BEFORE_SCREENSHOTS;
        } else {
            this._waitBeforeScreenshots = waitBeforeScreenshots;
        }
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {int} The time to wait just before taking a screenshot.
     */
    getWaitBeforeScreenshots() {
        return this._waitBeforeScreenshots;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Turns on/off the automatic scrolling to a region being checked by {@code checkRegion}.
     *
     * @param {boolean} shouldScroll Whether to automatically scroll to a region being validated.
     */
    setScrollToRegion(shouldScroll) {
        if (shouldScroll) {
            this._regionVisibilityStrategy = new MoveToRegionVisibilityStrategy(this._logger, this.getPromiseFactory());
        } else {
            this._regionVisibilityStrategy = new NopRegionVisibilityStrategy(this._logger, this.getPromiseFactory());
        }
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {boolean} Whether to automatically scroll to a region being validated.
     */
    getScrollToRegion() {
        return !(this._regionVisibilityStrategy instanceof NopRegionVisibilityStrategy);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set the type of stitching used for full page screenshots. When the page includes fixed position header/sidebar, use {@link StitchMode#CSS}.
     * Default is {@link StitchMode#SCROLL}.
     *
     * @param {StitchMode} mode The stitch mode to set.
     */
    setStitchMode(mode) {
        this._logger.verbose(`setting stitch mode to ${mode}`);

        this._stitchMode = mode;
        if (this._driver) {
            switch (mode) {
                case StitchMode.CSS:
                    this.setPositionProvider(new CssTranslatePositionProvider(this._logger, this._jsExecutor, this.getPromiseFactory()));
                    break;
                default:
                    this.setPositionProvider(new ScrollPositionProvider(this._logger, this._jsExecutor));
            }
        }
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {StitchMode}  The current stitch mode settings.
     */
    getStitchMode() {
        return this._stitchMode;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Sets the stitching overlap in pixels.
     *
     * @param {int} pixels The width (in pixels) of the overlap.
     */
    setStitchOverlap(pixels) {
        this._stitchingOverlap = pixels;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {int} Returns the stitching overlap in pixels.
     */
    getStitchOverlap() {
        return this._stitchingOverlap;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Hide the scrollbars when taking screenshots.
     *
     * @param {boolean} shouldHide Whether to hide the scrollbars or not.
     */
    setHideScrollbars(shouldHide) {
        this._hideScrollbars = shouldHide;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {boolean} Whether or not scrollbars are hidden when taking screenshots.
     */
    getHideScrollbars() {
        return this._hideScrollbars;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {ImageRotation} rotation The image rotation data.
     */
    setRotation(rotation) {
        this._rotation = rotation;
        if (this._driver) {
            this._driver.setRotation(rotation);
        }
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {ImageRotation} The image rotation data.
     */
    getRotation() {
        return this._rotation;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {number} The device pixel ratio, or {@link #UNKNOWN_DEVICE_PIXEL_RATIO} if the DPR is not known yet or if it wasn't possible to extract it.
     */
    getDevicePixelRatio() {
        return this._devicePixelRatio;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Starts a test.
     *
     * @param {WebDriver} driver The web driver that controls the browser hosting the application under test.
     * @param {String} appName The name of the application under test.
     * @param {String} testName The test name.
     * @param {RectangleSize|{width: number, height: number}} [viewportSize=null] The required browser's viewport size (i.e., the visible part of the document's body) or to use the current window's viewport.
     * @param {SessionType} [sessionType=null] The type of test (e.g.,  standard test / visual performance test).
     * @return {Promise.<EyesWebDriver>} A wrapped WebDriver which enables Eyes trigger recording and frame handling.
     */
    open(driver, appName, testName, viewportSize = null, sessionType = null) {
        ArgumentGuard.notNull(driver, "driver");

        const that = this;
        that._flow = driver.controlFlow();
        // Set PromiseFactory to work with the protractor control flow and promises
        that.getPromiseFactory().setFactoryMethods(asyncAction => that._flow.execute(() => {
            return new Promise(asyncAction);
        }), null);

        if (this.getIsDisabled()) {
            this._logger.verbose("Ignored");
            return this.getPromiseFactory().resolve(driver);
        }

        that._initDriver(driver);

        return that._driver.getUserAgent().then(uaString => {
            that._userAgent = UserAgent.parseUserAgentString(uaString, true);

            that._imageProvider = ImageProviderFactory.getImageProvider(that._userAgent, that, that._logger, that._driver);
            that._regionPositionCompensation = RegionPositionCompensationFactory.getRegionPositionCompensation(that._userAgent, that, that._logger);

            return super.openBase(appName, testName, viewportSize, sessionType);
        }).then(() => {
            that._devicePixelRatio = Eyes.UNKNOWN_DEVICE_PIXEL_RATIO;
            that._jsExecutor = new SeleniumJavaScriptExecutor(that._driver);

            that._initPositionProvider();

            that._driver.setRotation(this._rotation);
            return that._driver;
        });
    }

    /** @private */
    _initDriver(driver) {
        if (driver instanceof WebDriver) {
            this._driver = new EyesWebDriver(this._logger, this, driver);
        } else if (driver instanceof EyesWebDriver) {
            // noinspection JSValidateTypes
            this._driver = driver;
        } else {
            // noinspection JSUnresolvedVariable
            const errMsg = `Driver is not a RemoteWebDriver (${driver.constructor.name})`;
            this._logger.log(errMsg);
            throw new EyesError(errMsg);
        }
    }

    /** @private */
    _initPositionProvider() {
        // Setting the correct position provider.
        const stitchMode = this.getStitchMode();
        this._logger.verbose("initializing position provider. stitchMode: " + stitchMode);
        switch (stitchMode) {
            case StitchMode.CSS:
                this.setPositionProvider(new CssTranslatePositionProvider(this._logger, this._jsExecutor, this.getPromiseFactory()));
                break;
            default:
                this.setPositionProvider(new ScrollPositionProvider(this._logger, this._jsExecutor));
        }
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Preform visual validation
     *
     * @param {String} name A name to be associated with the match
     * @param {SeleniumCheckSettings} checkSettings Target instance which describes whether we want a window/region/frame
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    check(name, checkSettings) {
        ArgumentGuard.notNull(checkSettings, "checkSettings");

        const that = this;
        return that.getPromiseFactory().resolve().then(() => {
            that._logger.verbose(`check("${name}", checkSettings) - begin`);
            that._stitchContent = checkSettings.getStitchContent();
            const targetRegion = checkSettings.getTargetRegion();

            let switchedToFrameCount;
            return this._switchToFrame(checkSettings).then(switchedToFrameCount_ => {
                switchedToFrameCount = switchedToFrameCount_;

                if (targetRegion) {
                    return super.checkWindowBase(new RegionProvider(targetRegion, that.getPromiseFactory()), name, false, checkSettings);
                }

                if (checkSettings) {
                    const targetSelector = checkSettings.getTargetSelector();
                    let targetElement = checkSettings.getTargetElement();
                    if (!targetElement && targetSelector) {
                        targetElement = that._driver.findElement(targetSelector);
                    }

                    if (targetElement) {
                        if (that._stitchContent) {
                            return that._checkElement(targetElement, name, checkSettings);
                        } else {
                            return that._checkRegion(targetElement, name, checkSettings);
                        }
                    }

                    if (checkSettings.getFrameChain().length > 0) {
                        if (that._stitchContent) {
                            return that._checkFullFrameOrElement(name, checkSettings);
                        } else {
                            const frame = that._driver.getFrameChain().peek();
                            const element = frame.getReference();
                            return that._driver.switchTo().parentFrame().then(() => {
                                switchedToFrameCount--;

                                const CustomRegionProvider = class extends RegionProvider {
                                    /** @override */
                                    getRegion() {
                                        return element.getLocation().then(point => {
                                            return element.getSize().then(size => {
                                                return new Region(point.x, point.y, size.width, size.height, CoordinatesType.CONTEXT_RELATIVE);
                                            });
                                        });
                                    }
                                };

                                return that.checkWindowBase(new CustomRegionProvider(), name, false, checkSettings);
                            });
                        }
                    }

                    return super.checkWindowBase(new NullRegionProvider(that.getPromiseFactory()), name, false, checkSettings);
                }
            }).then(() => {
                return that._switchToParentFrame(switchedToFrameCount);
            }).then(() => {
                that._stitchContent = false;
                that._logger.verbose("check - done!");
            });
        });
    }

    /**
     * @private
     * @return {Promise.<int>}
     */
    _switchToParentFrame(switchedToFrameCount) {
        if (switchedToFrameCount > 0) {
            const that = this;
            return that._driver.switchTo().parentFrame().then(() => {
                switchedToFrameCount--;
                return that._switchToParentFrame(switchedToFrameCount);
            });
        }

        return this.getPromiseFactory().resolve();
    }

    /**
     * @private
     * @return {Promise.<int>}
     */
    _switchToFrame(checkSettings) {
        if (!checkSettings) {
            return this.getPromiseFactory().resolve(0);
        }

        const that = this;
        const frameChain = checkSettings.getFrameChain();
        let switchedToFrameCount = 0;
        return frameChain.reduce((promise, frameLocator) => {
            return promise.then(() => that._switchToFrameLocator(frameLocator)).then(isSuccess => {
                if (isSuccess) {
                    switchedToFrameCount++;
                }
                return switchedToFrameCount;
            });
        }, this.getPromiseFactory().resolve());
    }

    /**
     * @private
     * @return {Promise.<boolean>}
     */
    _switchToFrameLocator(frameLocator) {
        if (frameLocator.getFrameIndex()) {
            return this._driver.switchTo().frame(frameLocator.getFrameIndex()).then(() => true);
        }

        if (frameLocator.getFrameNameOrId()) {
            return this._driver.switchTo().frame(frameLocator.getFrameNameOrId()).then(() => true);
        }

        if (frameLocator.getFrameSelector()) {
            const frameElement = this._driver.findElement(frameLocator.getFrameSelector());
            if (frameElement) {
                return this._driver.switchTo().frame(frameElement).then(() => true);
            }
        }

        return this.getPromiseFactory().resolve(false);
    }

    /**
     * @private
     * @return {Promise}
     */
    _checkFullFrameOrElement(name, checkSettings) {
        this._checkFrameOrElement = true;

        const that = this;
        this._logger.verbose("checkFullFrameOrElement()");

        const CustomRegionProvider = class extends RegionProvider {
            /** @override */
            getRegion () {
                if (that._checkFrameOrElement) {
                    const spp = new ScrollPositionProvider(that._logger, that._jsExecutor);
                    return spp.setPosition(Location.ZERO).then(() => {
                        // FIXME - Scaling should be handled in a single place instead
                        // noinspection JSUnresolvedFunction
                        return that._updateScalingParams();
                    }).then(scaleProviderFactory => {
                        let screenshotImage;
                        return that._imageProvider.getImage().then(screenshotImage_ => {
                            screenshotImage = screenshotImage_;
                            //byte[] screenshotBytes = driver.getScreenshotAs(OutputType.BYTES);
                            //BufferedImage screenshotImage = ImageUtils.imageFromBytes(screenshotBytes);

                            return that._debugScreenshotsProvider.save(screenshotImage_, "checkFulFrameOrElement");
                        }).then(() => {
                            const scaleProvider = scaleProviderFactory.getScaleProvider(screenshotImage.getWidth());
                            // TODO: do we need to scale image?
                            return screenshotImage.scale(scaleProvider.getScaleRatio());
                        }).then(screenshotImage_ => {
                            const screenshot = new EyesWebDriverScreenshot(that._logger, that._driver, screenshotImage_, that.getPromiseFactory());
                            return screenshot.init();
                        }).then(screenshot => {
                            that._logger.verbose("replacing regionToCheck");
                            that._regionToCheck = screenshot.getFrameWindow();
                        });
                    });
                }

                return that.getPromiseFactory().resolve(Region.EMPTY);
            }
        };

        return super.checkWindowBase(new CustomRegionProvider(), name, false, checkSettings).then(() => {
            that._checkFrameOrElement = false;
        });
    }

    /**
     * @private
     * @return {Promise}
     */
    _checkRegion(element, name, checkSettings) {
        ArgumentGuard.notNull(element, "element");

        const that = this;
        return element.getLocation().then(point => {
            const elementLocation = new Location(point);
            return element.getSize().then(size => {
                const elementSize = new RectangleSize(size);
                const region = new Region(elementLocation, elementSize, CoordinatesType.CONTEXT_RELATIVE);
                return super.checkWindowBase(new RegionProvider(region, that.getPromiseFactory()), name, false, checkSettings).then(() => {
                    that._logger.verbose("Done! trying to scroll back to original position..");
                });
            });
        });
    }

    /**
     * @private
     * @return {Promise}
     */
    _checkElement(element, name, checkSettings) {
        // Since the element might already have been found using EyesWebDriver.
        const eyesElement = (element instanceof EyesWebElement) ? element : new EyesWebElement(this._logger, this._driver, element);

        const originalPositionProvider = this._positionProvider;
        const scrollPositionProvider = new ScrollPositionProvider(this._logger, this._jsExecutor);

        const that = this;
        let originalScrollPosition, originalOverflow, error;
        return scrollPositionProvider.getCurrentPosition().then(originalScrollPosition_ => {
            originalScrollPosition = originalScrollPosition_;
            return eyesElement.getLocation();
        }).then(point => {
            that._checkFrameOrElement = true;

            let borderLeftWidth, borderTopWidth, elementWidth, elementHeight;
            return eyesElement.getComputedStyle("display").then(displayStyle => {
                if (displayStyle !== "inline") {
                    that._elementPositionProvider = new ElementPositionProvider(that._logger, that._driver, eyesElement);
                }
                return eyesElement.getOverflow();
            }).then(originalOverflow_ => {
                originalOverflow = originalOverflow_;
                // Set overflow to "hidden".
                return eyesElement.setOverflow("hidden");
            }).then(() => {
                return eyesElement.getComputedStyleInteger("border-left-width");
            }).then(borderLeftWidth_ => {
                borderLeftWidth = borderLeftWidth_;
                return eyesElement.getComputedStyleInteger("border-top-width");
            }).then(borderTopWidth_ => {
                borderTopWidth = borderTopWidth_;
                return eyesElement.getClientWidth();
            }).then(elementWidth_ => {
                elementWidth = elementWidth_;
                return eyesElement.getClientHeight();
            }).then(elementHeight_ => {
                elementHeight = elementHeight_;

                const elementRegion = new Region(point.x + borderLeftWidth, point.y + borderTopWidth, elementWidth, elementHeight, CoordinatesType.CONTEXT_RELATIVE);

                that._logger.verbose("Element region: " + elementRegion);

                that._logger.verbose("replacing regionToCheck");
                that._regionToCheck = elementRegion;

                return super.checkWindowBase(new NullRegionProvider(this.getPromiseFactory()), name, false, checkSettings);
            });
        }).catch(error_ => {
            error = error_;
        }).then(() => {
            if (originalOverflow) {
                return eyesElement.setOverflow(originalOverflow);
            }
        }).then(() => {
            that._checkFrameOrElement = false;
            that._positionProvider = originalPositionProvider;
            that._regionToCheck = Region.EMPTY;
            that._elementPositionProvider = null;

            return scrollPositionProvider.setPosition(originalScrollPosition);
        }).then(() => {
            if (error) {
                throw error;
            }
        });
    }

    /**
     * Updates the state of scaling related parameters.
     *
     * @protected
     * @return {Promise.<ScaleProviderFactory>}
     */
    _updateScalingParams() {
        // Update the scaling params only if we haven't done so yet, and the user hasn't set anything else manually.
        if (this._devicePixelRatio === Eyes.UNKNOWN_DEVICE_PIXEL_RATIO && this._scaleProviderHandler.get() instanceof NullScaleProvider) {
            this._logger.verbose("Trying to extract device pixel ratio...");

            const that = this;
            return EyesSeleniumUtils.getDevicePixelRatio(that._jsExecutor).then(ratio => {
                that._devicePixelRatio = ratio;
            }).catch(err => {
                that._logger.verbose("Failed to extract device pixel ratio! Using default.", err);
                that._devicePixelRatio = Eyes.DEFAULT_DEVICE_PIXEL_RATIO;
            }).then(() => {
                that._logger.verbose(`Device pixel ratio: ${that._devicePixelRatio}`);
                return that._positionProvider.getEntireSize();
            }).then(entireSize => {
                return EyesSeleniumUtils.isMobileDevice(that._driver).then(isMobileDevice => {
                    that._logger.verbose("Setting scale provider...");
                    return new ContextBasedScaleProviderFactory(
                        that._logger, entireSize, that._viewportSizeHandler.get(),
                        that._devicePixelRatio, isMobileDevice, that._scaleProviderHandler
                    );
                });
            }).catch(err => {
                that._logger.verbose("Failed to set ContextBasedScaleProvider.", err);
                that._logger.verbose("Using FixedScaleProvider instead...");
                return new FixedScaleProviderFactory(1 / that._devicePixelRatio, that._scaleProviderHandler);
            }).then(factory => {
                that._logger.verbose("Done!");
                return factory;
            });
        }

        // If we already have a scale provider set, we'll just use it, and pass a mock as provider handler.
        const nullProvider = new SimplePropertyHandler();
        return this.getPromiseFactory().resolve(new ScaleProviderIdentityFactory(this._scaleProviderHandler.get(), nullProvider));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Takes a snapshot of the application under test and matches it with the expected output.
     *
     * @param {String} tag An optional tag to be associated with the snapshot.
     * @param {int} matchTimeout The amount of time to retry matching (Milliseconds).
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkWindow(tag, matchTimeout) {
        return this.check(tag, Target.window().timeout(matchTimeout));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Matches the frame given as parameter, by switching into the frame and using stitching to get an image of the frame.
     *
     * @param {EyesWebElement} element The element which is the frame to switch to. (as
     * would be used in a call to driver.switchTo().frame() ).
     * @param {int} matchTimeout The amount of time to retry matching (milliseconds).
     * @param {String} tag An optional tag to be associated with the match.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkFrame(element, matchTimeout, tag) {
        return this.check(tag, Target.frame(element).timeout(matchTimeout));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Takes a snapshot of the application under test and matches a specific element with the expected region output.
     *
     * @param {WebElement|EyesWebElement} element The element to check.
     * @param {int|null} matchTimeout The amount of time to retry matching (milliseconds).
     * @param {String} tag An optional tag to be associated with the match.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkElement(element, matchTimeout, tag) {
        return this.check(tag, Target.region(element).timeout(matchTimeout).fully());
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Takes a snapshot of the application under test and matches a specific element with the expected region output.
     *
     * @param {By} locator The element to check.
     * @param {int|null} matchTimeout The amount of time to retry matching (milliseconds).
     * @param {String} tag An optional tag to be associated with the match.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkElementBy(locator, matchTimeout, tag) {
        return this.check(tag, Target.region(locator).timeout(matchTimeout).fully());
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Visually validates a region in the screenshot.
     *
     * @param {Region} region The region to validate (in screenshot coordinates).
     * @param {String} tag An optional tag to be associated with the screenshot.
     * @param {int} matchTimeout The amount of time to retry matching.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkRegion(region, tag, matchTimeout) {
        return this.check(tag, Target.region(region).timeout(matchTimeout));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Visually validates a region in the screenshot.
     *
     * @param {WebElement|EyesWebElement} element The element defining the region to validate.
     * @param {String} tag An optional tag to be associated with the screenshot.
     * @param {int} matchTimeout The amount of time to retry matching.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkRegionByElement(element, tag, matchTimeout) {
        return this.check(tag, Target.region(element).timeout(matchTimeout));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Visually validates a region in the screenshot.
     *
     * @param {By} by The WebDriver selector used for finding the region to validate.
     * @param {String} tag An optional tag to be associated with the screenshot.
     * @param {int} matchTimeout The amount of time to retry matching.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkRegionBy(by, tag, matchTimeout) {
        return this.check(tag, Target.region(by).timeout(matchTimeout));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Switches into the given frame, takes a snapshot of the application under test and matches a region specified by the given selector.
     *
     * @param {String} frameNameOrId The name or id of the frame to switch to. (as would be used in a call to driver.switchTo().frame()).
     * @param {By} locator A Selector specifying the region to check.
     * @param {int|null} matchTimeout The amount of time to retry matching. (Milliseconds)
     * @param {String} tag An optional tag to be associated with the snapshot.
     * @param {boolean} stitchContent If {@code true}, stitch the internal content of the region (i.e., perform {@link #checkElement(By, int, String)} on the region.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkRegionInFrame(frameNameOrId, locator, matchTimeout, tag, stitchContent) {
        return this.check(tag, Target.region(locator, frameNameOrId).timeout(matchTimeout).stitchContent(stitchContent));
    }

    /**
     * Adds a mouse trigger.
     *
     * @param {MouseTrigger.MouseAction} action  Mouse action.
     * @param {Region} control The control on which the trigger is activated (context relative coordinates).
     * @param {Location} cursor  The cursor's position relative to the control.
     */
    addMouseTrigger(action, control, cursor) {
        if (this.getIsDisabled()) {
            this._logger.verbose(`Ignoring ${action} (disabled)`);
            return;
        }

        // Triggers are actually performed on the previous window.
        if (!this._lastScreenshot) {
            this._logger.verbose(`Ignoring ${action} (no screenshot)`);
            return;
        }

        if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
            this._logger.verbose(`Ignoring ${action} (different frame)`);
            return;
        }

        super.addMouseTriggerBase(action, control, cursor);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a mouse trigger.
     *
     * @param {MouseTrigger.MouseAction} action  Mouse action.
     * @param {WebElement} element The WebElement on which the click was called.
     * @return {Promise}
     */
    addMouseTriggerForElement(action, element) {
        if (this.getIsDisabled()) {
            this._logger.verbose(`Ignoring ${action} (disabled)`);
            return this.getPromiseFactory().resolve();
        }

        // Triggers are actually performed on the previous window.
        if (!this._lastScreenshot) {
            this._logger.verbose(`Ignoring ${action} (no screenshot)`);
            return this.getPromiseFactory().resolve();
        }

        if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
            this._logger.verbose(`Ignoring ${action} (different frame)`);
            return this.getPromiseFactory().resolve();
        }

        ArgumentGuard.notNull(element, "element");

        let p1;
        return element.getLocation().then(loc => {
            p1 = loc;
            return element.getSize();
        }).then(ds => {
            let elementRegion = new Region(p1.x, p1.y, ds.width, ds.height);

            // Get the element region which is intersected with the screenshot,
            // so we can calculate the correct cursor position.
            elementRegion = this._lastScreenshot.getIntersectedRegion(elementRegion, CoordinatesType.CONTEXT_RELATIVE, CoordinatesType.CONTEXT_RELATIVE);
            super.addMouseTriggerBase(action, elementRegion, elementRegion.getMiddleOffset());
        });
    }

    /**
     * Adds a keyboard trigger.
     *
     * @param {Region} control The control on which the trigger is activated (context relative coordinates).
     * @param {String} text  The trigger's text.
     */
    addTextTrigger(control, text) {
        if (this.getIsDisabled()) {
            this._logger.verbose(`Ignoring ${text} (disabled)`);
            return;
        }

        // Triggers are actually performed on the previous window.
        if (!this._lastScreenshot) {
            this._logger.verbose(`Ignoring ${text} (no screenshot)`);
            return;
        }

        if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
            this._logger.verbose(`Ignoring ${text} (different frame)`);
            return;
        }

        super.addTextTriggerBase(control, text);
    }

    /**
     * Adds a keyboard trigger.
     *
     * @param {EyesWebElement} element The element for which we sent keys.
     * @param {String} text  The trigger's text.
     * @return {Promise}
     */
    addTextTriggerForElement(element, text) {
        if (this.getIsDisabled()) {
            this._logger.verbose(`Ignoring ${text} (disabled)`);
            return this.getPromiseFactory().resolve();
        }

        // Triggers are actually performed on the previous window.
        if (!this._lastScreenshot) {
            this._logger.verbose(`Ignoring ${text} (no screenshot)`);
            return this.getPromiseFactory().resolve();
        }

        if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
            this._logger.verbose(`Ignoring ${text} (different frame)`);
            return this.getPromiseFactory().resolve();
        }

        ArgumentGuard.notNull(element, "element");

        return element.getLocation().then(p1 => {
            return element.getSize().then(ds => {
                let elementRegion = new Region(p1.x, p1.y, ds.width, ds.height);

                // Get the element region which is intersected with the screenshot,
                // so we can calculate the correct cursor position.
                elementRegion = this._lastScreenshot.getIntersectedRegion(elementRegion, CoordinatesType.CONTEXT_RELATIVE, CoordinatesType.CONTEXT_RELATIVE);
                super.addTextTrigger(elementRegion, text);
            });
        });
    }

    /**
     * Use this method only if you made a previous call to {@link #open(WebDriver, String, String)} or one of its variants.
     *
     * @override
     * @inheritDoc
     * @return {Promise.<RectangleSize>}
     */
    getViewportSize() {
        return this._driver.getDefaultContentViewportSize();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Use this method only if you made a previous call to {@link #open(WebDriver, String, String)} or one of its variants.
     *
     * @protected
     * @override
     */
    setViewportSize(size) {
        if (this._viewportSizeHandler instanceof ReadOnlyPropertyHandler) {
            this._logger.verbose("Ignored (viewport size given explicitly)");
            return;
        }

        const that = this;
        const originalFrame = this._driver.getFrameChain();
        return this._driver.switchTo().defaultContent().then(() => {
            return EyesSeleniumUtils.setViewportSize(that._logger, that._driver, size).catch(err => {
                // Just in case the user catches that error
                return that._driver.switchTo().frames(originalFrame).then(() => {
                    throw new TestFailedError("Failed to set the viewport size", err);
                });
            });
        }).then(() => {
            return that._driver.switchTo().frames(originalFrame);
        }).then(() => {
            that._viewportSizeHandler.set(new RectangleSize(size));
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Call this method if for some reason you don't want to call {@link #open(WebDriver, String, String)} (or one of its variants) yet.
     *
     * @param {EyesWebDriver} driver The driver to use for getting the viewport.
     * @return {Promise.<RectangleSize>} The viewport size of the current context.
     */
    static getViewportSize(driver) {
        ArgumentGuard.notNull(driver, "driver");
        return EyesSeleniumUtils.getViewportSizeOrDisplaySize(new Logger(), driver);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Set the viewport size using the driver. Call this method if for some reason you don't want to call {@link #open(WebDriver, String, String)} (or one of its variants) yet.
     *
     * @param {EyesWebDriver} driver The driver to use for setting the viewport.
     * @param {RectangleSize} size The required viewport size.
     * @return {Promise}
     */
    static setViewportSize(driver, size) {
        ArgumentGuard.notNull(driver, "driver");
        return EyesSeleniumUtils.setViewportSize(new Logger(), driver, size);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @protected
     * @override
     */
    getScreenshot() {
        const that = this;
        that._logger.verbose("getScreenshot()");

        let result, scaleProviderFactory, originalOverflow, error;
        return that._updateScalingParams().then(scaleProviderFactory_ => {
            scaleProviderFactory = scaleProviderFactory_;

            if (that._hideScrollbars) {
                return EyesSeleniumUtils.hideScrollbars(that._jsExecutor, DEFAULT_WAIT_SCROLL_STABILIZATION).then(originalOverflow_ => {
                    originalOverflow = originalOverflow_;
                }).catch(err => {
                    that._logger.log("WARNING: Failed to hide scrollbars! Error: " + err);
                });
            }
        }).then(() => {
            const screenshotFactory = new EyesWebDriverScreenshotFactory(that._logger, that._driver, that.getPromiseFactory());

            if (that._checkFrameOrElement) {
                that._logger.verbose("Check frame/element requested");
                const algo = new FullPageCaptureAlgorithm(that._logger, that._userAgent, that.getPromiseFactory());
                return algo.getStitchedRegion(
                    that._imageProvider, that._regionToCheck, that._positionProvider,
                    that.getElementPositionProvider(), scaleProviderFactory, that._cutProviderHandler.get(),
                    that.getWaitBeforeScreenshots(), that._debugScreenshotsProvider, screenshotFactory,
                    that.getStitchOverlap(), that._regionPositionCompensation
                ).then(entireFrameOrElement => {
                    that._logger.verbose("Building screenshot object...");
                    const screenshot = new EyesWebDriverScreenshot(that._logger, that._driver, entireFrameOrElement, that.getPromiseFactory());
                    return screenshot.initFromFrameSize(new RectangleSize(entireFrameOrElement.getWidth(), entireFrameOrElement.getHeight()));
                }).then(screenshot => {
                    result = screenshot;
                });
            }

            if (that._forceFullPageScreenshot || that._stitchContent) {
                that._logger.verbose("Full page screenshot requested.");
                // Save the current frame path.
                const originalFrame = new FrameChain(that._logger, that._driver.getFrameChain());
                const originalFramePosition = originalFrame.size() > 0 ? originalFrame.getDefaultContentScrollPosition() : new Location(0, 0);
                return that._driver.switchTo().defaultContent().then(() => {
                    const algo = new FullPageCaptureAlgorithm(that._logger, that._userAgent, that.getPromiseFactory());
                    return algo.getStitchedRegion(
                        that._imageProvider, Region.EMPTY, new ScrollPositionProvider(that._logger, this._jsExecutor),
                        that._positionProvider, scaleProviderFactory, that._cutProviderHandler.get(), that.getWaitBeforeScreenshots(),
                        that._debugScreenshotsProvider, screenshotFactory, that.getStitchOverlap(), that._regionPositionCompensation
                    ).then(fullPageImage => {
                        return that._driver.switchTo().frames(originalFrame).then(() => {
                            const screenshot = new EyesWebDriverScreenshot(that._logger, that._driver, fullPageImage, that.getPromiseFactory());
                            return screenshot.init(null, originalFramePosition);
                        }).then(screenshot => {
                            result = screenshot;
                        });
                    });
                });
            }

            let screenshotImage;
            that._logger.verbose("Screenshot requested...");
            return that._imageProvider.getImage().then(screenshotImage_ => {
                screenshotImage = screenshotImage_;
                that._logger.verbose("Done! Creating image object...");
                return that._debugScreenshotsProvider.save(screenshotImage, "original");
            }).then(() => {
                const scaleProvider = scaleProviderFactory.getScaleProvider(screenshotImage.getWidth());
                return screenshotImage.scale(scaleProvider.getScaleRatio());
            }).then(screenshotImage_ => {
                screenshotImage = screenshotImage_;
                that._logger.verbose("Done!");
                return that._debugScreenshotsProvider.save(screenshotImage, "scaled");
            }).then(() => {
                return that._cutProviderHandler.get().cut(screenshotImage);
            }).then(screenshotImage_ => {
                screenshotImage = screenshotImage_;
                return that._debugScreenshotsProvider.save(screenshotImage, "cut");
            }).then(() => {
                that._logger.verbose("Creating screenshot object...");
                const screenshot = new EyesWebDriverScreenshot(that._logger, that._driver, screenshotImage, that.getPromiseFactory());
                return screenshot.init();
            }).then(screenshot => {
                result = screenshot;
            });
        }).catch(error_ => {
            error = error_;
        }).then(() => {
            if (that._hideScrollbars) {
                return EyesSeleniumUtils.setOverflow(that._driver, originalOverflow).catch(err => {
                    // Bummer, but we'll continue with the screenshot anyway :)
                    that._logger.log("WARNING: Failed to revert overflow! Error: " + err);
                });
            }
        }).then(() => {
            if (error) {
                throw error;
            }

            that._logger.verbose("Done!");
            return result;
        });
    }

    /** @override */
    getTitle() {
        const that = this;
        if (!this._dontGetTitle) {
            return that._driver.getTitle().catch(err => {
                that._logger.verbose("failed (" + err + ")");
                that._dontGetTitle = true;
                return "";
            });
        }

        return this.getPromiseFactory().resolve("");
    }

    /** @override */
    getInferredEnvironment() {
        return this._driver.getUserAgent().then(userAgent => "useragent:" + userAgent).catch(() => null);
    }

    // noinspection JSUnusedGlobalSymbols
    /** @override */
    getAppEnvironment() {
        const that = this;
        return super.getAppEnvironment().then(appEnv => {
            // If hostOs isn't set, we'll try and extract and OS ourselves.
            if (!appEnv.getOs()) {
                that._logger.log("No OS set, checking for mobile OS...");

                return EyesSeleniumUtils.isMobileDevice(that._driver).then(isMobileDevice => {
                    if (isMobileDevice) {
                        that._logger.log("Mobile device detected! Checking device type..");
                        return EyesSeleniumUtils.isAndroid(that._driver).then(isAndroid => {
                            if (isAndroid) {
                                that._logger.log("Android detected.");
                                return "Android";
                            } else {
                                return EyesSeleniumUtils.isIOS(that._driver).then(isIOS => {
                                    if (isIOS) {
                                        that._logger.log("iOS detected.");
                                        return "iOS";
                                    } else {
                                        that._logger.log("Unknown device type.");
                                        return null;
                                    }
                                });
                            }
                        }).then(platformName => {
                            // We only set the OS if we identified the device type.
                            if (platformName) {
                                let os = platformName;
                                return EyesSeleniumUtils.getPlatformVersion(that._driver).then(platformVersion => {
                                    if (platformVersion) {
                                        const majorVersion = platformVersion.split("\\.", 2)[0];
                                        if (!majorVersion.isEmpty()) {
                                            os += " " + majorVersion;
                                        }
                                    }
                                }).then(() => {
                                    that._logger.verbose("Setting OS: " + os);
                                    appEnv.setOs(os);
                                });
                            }
                        });
                    } else {
                        that._logger.log("No mobile OS detected.");
                    }
                }).then(() => appEnv);
            }
            that._logger.log("Done!");
            return appEnv;
        });
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set the failure report.
     * @param mode Use one of the values in EyesBase.FailureReport.
     */
    setFailureReport(mode) {
        if (mode === EyesBase.FailureReport.Immediate) {
            this._failureReportOverridden = true;
            mode = EyesBase.FailureReport.OnClose;
        }

        super.setFailureReport(mode);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set the image rotation degrees.
     * TODO: re-implement usage
     * @param degrees The amount of degrees to set the rotation to.
     */
    setForcedImageRotation(degrees) {
        if (typeof degrees !== 'number') {
            throw new TypeError('degrees must be a number! set to 0 to clear');
        }
        this._imageRotationDegrees = degrees;
        this._automaticRotation = false;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the rotation degrees.
     * @return {*|number} The rotation degrees.
     */
    getForcedImageRotation() {
        return this._imageRotationDegrees || 0;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the session id.
     * @return {Promise} A promise which resolves to the webdriver's session ID.
     */
    getAUTSessionId() {
        return this.getPromiseFactory().makePromise(resolve => {
            if (!this._driver) {
                resolve(undefined);
                return;
            }
            this._driver.getSession().then(session => {
                resolve(session.getId());
            });
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {PositionProvider} The currently set position provider.
     */
    getElementPositionProvider() {
        return this._elementPositionProvider ? this._elementPositionProvider : this._positionProvider;
    }
}

Eyes.UNKNOWN_DEVICE_PIXEL_RATIO = 0;
Eyes.DEFAULT_DEVICE_PIXEL_RATIO = 1;
module.exports = Eyes;
