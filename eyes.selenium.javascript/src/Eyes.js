'use strict';

const {WebDriver, WebElement, By} = require('selenium-webdriver').webdriver;
const {
    EyesBase, FixedScaleProvider, FixedScaleProviderFactory, NullScaleProvider,
    ScaleProviderIdentityFactory, PromiseFactory, ArgumentGuard, SimplePropertyHandler,
    Logger, CoordinatesType, MutableImage, ContextBasedScaleProviderFactory,
    EyesError, UserAgent, ReadOnlyPropertyHandler
} = require('eyes.sdk');

const ImageProviderFactory = require('./capture/ImageProviderFactory');
const FrameChain = require('./frames/FrameChain');
const RegionPositionCompensationFactory = require('./positioning/RegionPositionCompensationFactory');
const EyesWebDriver = require('./wrappers/EyesWebDriver');
const EyesSeleniumUtils = require('./EyesSeleniumUtils');
const EyesRemoteWebElement = require('./wrappers/EyesRemoteWebElement');
const EyesWebDriverScreenshot = require('./capture/EyesWebDriverScreenshot');
const ElementFinderWrapper = require('./wrappers/ElementFinderWrappers').ElementFinderWrapper;
const ElementArrayFinderWrapper = require('./wrappers/ElementFinderWrappers').ElementArrayFinderWrapper;
const ScrollPositionProvider = require('./positioning/ScrollPositionProvider');
const CssTranslatePositionProvider = require('./positioning/CssTranslatePositionProvider');
const ElementPositionProvider = require('./positioning/ElementPositionProvider');
const EyesRegionProvider = require('./EyesRegionProvider');
const StitchMode = require('./StitchMode');
const Target = require('./fluent/Target');

const VERSION = require('../package.json').version;

const USE_DEFAULT_MATCH_TIMEOUT = -1;
const RESPONSE_TIME_DEFAULT_DEADLINE = 10; // Seconds
const RESPONSE_TIME_DEFAULT_DIFF_FROM_DEADLINE = 20; // Seconds
const DEFAULT_WAIT_BEFORE_SCREENSHOTS = 100; // Milliseconds

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
        this._regionVisibilityStrategy = new MoveToRegionVisibilityStrategy(logger);
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
        /**
         * @type {int}
         * @protected
         */
        this._stitchingOverlap = 50;


        this._imageRotationDegrees = 0;
        this._automaticRotation = true;
        this._isLandscape = false;
        this._promiseFactory = promiseFactory;
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
     * Forces a full page screenshot (by scrolling and stitching) if the browser only ﻿supports viewport screenshots).
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

    // TODO: setScrollToRegion, getScrollToRegion

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
                    this.setPositionProvider(new CssTranslatePositionProvider(this._logger, this._driver, this._promiseFactory));
                    break;
                default:
                    this.setPositionProvider(new ScrollPositionProvider(this._logger, this._driver, this._promiseFactory));
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

    // TODO: getRotation, setRotation

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
     * @param {RectangleSize} [viewportSize=null] The required browser's viewport size (i.e., the visible part of the document's body) or to use the current window's viewport.
     * @param {SessionType} [sessionType=null] The type of test (e.g.,  standard test / visual performance test).
     * @return {Promise<EyesWebDriver>} A wrapped WebDriver which enables Eyes trigger recording and frame handling.
     */
    open(driver, appName, testName, viewportSize = null, sessionType = null) {
        ArgumentGuard.notNull(driver, "driver");

        const that = this;
        that._flow = driver.controlFlow();
        // Set PromiseFactory to work with the protractor control flow and promises
        that._promiseFactory.setFactoryMethods(asyncAction => that._flow.execute(() => {
            return new Promise(asyncAction);
        }), null);

        if (this.getIsDisabled()) {
            this._logger.verbose("Ignored");
            return this._promiseFactory.resolve(driver);
        }

        if (typeof protractor !== 'undefined') {
            that._isProtractorLoaded = true;
            that._logger.verbose("Running using Protractor module");

            // extend protractor element to return ours
            const originalElementFn = global.element;
            global.element = function element(locator) {
                return new ElementFinderWrapper(originalElementFn(locator), that._driver, that._logger);
            };

            global.element.all = function all(locator) {
                return new ElementArrayFinderWrapper(originalElementFn.all(locator), that._driver, that._logger);
            };
        } else {
            that._isProtractorLoaded = false;
            that._logger.verbose("Running using Selenium module");
        }

        if (driver instanceof WebDriver) {
            that._driver = new EyesWebDriver(logger, that, driver, that._promiseFactory);
        } else if (driver instanceof EyesWebDriver) {
            that._driver = driver;
        } else {
            const errMsg = `Driver is not a RemoteWebDriver (${driver.constructor.name})`;
            that._logger.log(errMsg);
            throw new EyesError(errMsg);
        }

        return that._driver.getUserAgent().then(uaString => {
            that._userAgent = UserAgent.parseUserAgentString(uaString, true);

            that._imageProvider = ImageProviderFactory.getImageProvider(that._userAgent, that, that._logger, that._driver);
            that._regionPositionCompensation = RegionPositionCompensationFactory.getRegionPositionCompensation(that._userAgent, that, that._logger);

            return super.openBase(appName, testName, viewportSize, sessionType);
        }).then(() => {
            that._devicePixelRatio = Eyes.UNKNOWN_DEVICE_PIXEL_RATIO;
            that._jsExecutor = new SeleniumJavaScriptExecutor(that._driver);

            // Setting the correct position provider.
            const stitchMode = that.getStitchMode();
            that._logger.verbose("initializing position provider. stitchMode: " + stitchMode);
            switch (stitchMode) {
                case StitchMode.CSS:
                    that.setPositionProvider(new CssTranslatePositionProvider(that._logger, that._jsExecutor, that._promiseFactory));
                    break;
                default:
                    that.setPositionProvider(new ScrollPositionProvider(that._logger, that._jsExecutor, that._promiseFactory));
            }

            that._driver.setRotation(rotation);
            return that._driver;
        });
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Ends the test.
     * @param throwEx If true, an exception will be thrown for failed/new tests.
     * @return {*} The test results.
     */
    close(throwEx) {
        const that = this;

        if (this._isDisabled) {
            return that._flow.execute(() => {
            });
        }
        if (throwEx === undefined) {
            throwEx = true;
        }

        return that._flow.execute(() => EyesBase.prototype.close.call(that, throwEx)
            .then(results => results, err => {
                throw err;
            }));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Preform visual validation
     * @param {String} name A name to be associated with the match
     * @param {Target} target Target instance which describes whether we want a window/region/frame
     * @return {ManagedPromise} A promise which is resolved when the validation is finished.
     */
    check(name, target) {
        ArgumentGuard.notNullOrEmpty(name, "Name");
        ArgumentGuard.notNull(target, "Target");

        const that = this;

        let promise = that._promiseFactory.makePromise(resolve => {
            resolve();
        });

        if (that._isDisabled) {
            that._logger.verbose("match ignored ", name);
            return promise;
        }

        if (target.getIgnoreObjects().length) {
            target.getIgnoreObjects().forEach(obj => {
                promise = promise.then(() => findElementByLocator(that, obj.element)).then(element => {
                    if (!isElementObject(element)) {
                        throw new Error(`Unsupported ignore region type: ${typeof element}`);
                    }

                    return getRegionFromWebElement(element);
                }).then(region => {
                    target.ignore(region);
                });
            });
        }

        if (target.getFloatingObjects().length) {
            target.getFloatingObjects().forEach(obj => {
                promise = promise.then(() => findElementByLocator(that, obj.element)).then(element => {
                    if (!isElementObject(element)) {
                        throw new Error(`Unsupported floating region type: ${typeof element}`);
                    }

                    return getRegionFromWebElement(element);
                }).then(region => {
                    region.maxLeftOffset = obj.maxLeftOffset;
                    region.maxRightOffset = obj.maxRightOffset;
                    region.maxUpOffset = obj.maxUpOffset;
                    region.maxDownOffset = obj.maxDownOffset;
                    target.floating(region);
                });
            });
        }

        that._logger.verbose("match starting with params", name, target.getStitchContent(), target.getTimeout());
        let regionObject,
            regionProvider,
            // if we will switch frame then we need to restore parent
            isFrameSwitched = false,
            originalForceFullPage,
            originalOverflow,
            originalPositionProvider,
            originalHideScrollBars;

        if (target.getStitchContent()) {
            originalForceFullPage = that._forceFullPageScreenshot;
            that._forceFullPageScreenshot = true;
        }

        // If frame specified
        if (target.isUsingFrame()) {
            promise = promise.then(() => findElementByLocator(that, target.getFrame())).then(frame => {
                that._logger.verbose("Switching to frame...");
                return that._driver.switchTo().frame(frame);
            }).then(() => {
                isFrameSwitched = true;
                that._logger.verbose("Done!");

                // if we need to check entire frame, we need to update region provider
                if (!target.isUsingRegion()) {
                    that._checkFrameOrElement = true;
                    originalHideScrollBars = that._hideScrollbars;
                    that._hideScrollbars = true;
                    return getRegionProviderForCurrentFrame(that).then(regionProvider => {
                        that._regionToCheck = regionProvider;
                    });
                }
            });
        }

        // if region specified
        if (target.isUsingRegion()) {
            promise = promise.then(() => findElementByLocator(that, target.getRegion())).then(region => {
                regionObject = region;

                if (isElementObject(regionObject)) {
                    let regionPromise;
                    if (target.getStitchContent()) {
                        that._checkFrameOrElement = true;

                        originalPositionProvider = that.getPositionProvider();
                        that.setPositionProvider(new ElementPositionProvider(that._logger, that._driver, regionObject, that._promiseFactory));

                        // Set overflow to "hidden".
                        regionPromise = regionObject.getOverflow().then(value => {
                            originalOverflow = value;
                            return regionObject.setOverflow("hidden");
                        }).then(() => getRegionProviderForElement(that, regionObject)).then(regionProvider => {
                            that._regionToCheck = regionProvider;
                        });
                    } else {
                        regionPromise = getRegionFromWebElement(regionObject);
                    }

                    return regionPromise.then(region => {
                        regionProvider = new EyesRegionProvider(that._logger, that._driver, region, CoordinatesType.CONTEXT_RELATIVE);
                    });
                } else if (GeometryUtils.isRegion(regionObject)) {
                    // if regionObject is simple region
                    regionProvider = new EyesRegionProvider(that._logger, that._driver, regionObject, CoordinatesType.CONTEXT_AS_IS);
                } else {
                    throw new Error(`Unsupported region type: ${typeof regionObject}`);
                }
            });
        }

        return promise.then(() => {
            that._logger.verbose("Call to checkWindowBase...");
            const imageMatchSettings = {
                matchLevel: target.getMatchLevel(),
                ignoreCaret: target.getIgnoreCaret(),
                ignore: target.getIgnoreRegions(),
                floating: target.getFloatingRegions(),
                exact: null
            };
            return EyesBase.prototype.checkWindow.call(that, name, target.getIgnoreMismatch(), target.getTimeout(), regionProvider, imageMatchSettings);
        }).then(result => {
            that._logger.verbose("Processing results...");
            if (result.asExpected || !that._failureReportOverridden) {
                return result;
            } else {
                throw EyesBase.buildTestError(result, that._sessionStartInfo.scenarioIdOrName, that._sessionStartInfo.appIdOrName);
            }
        }).then(() => {
            that._logger.verbose("Done!");
            that._logger.verbose("Restoring temporal variables...");

            if (that._regionToCheck) {
                that._regionToCheck = null;
            }

            if (that._checkFrameOrElement) {
                that._checkFrameOrElement = false;
            }

            // restore initial values
            if (originalForceFullPage !== undefined) {
                that._forceFullPageScreenshot = originalForceFullPage;
            }

            if (originalHideScrollBars !== undefined) {
                that._hideScrollbars = originalHideScrollBars;
            }

            if (originalPositionProvider !== undefined) {
                that.setPositionProvider(originalPositionProvider);
            }

            if (originalOverflow !== undefined) {
                return regionObject.setOverflow(originalOverflow);
            }
        }).then(() => {
            that._logger.verbose("Done!");

            // restore parent frame, if another frame was selected
            if (isFrameSwitched) {
                that._logger.verbose("Switching back to parent frame...");
                return that._driver.switchTo().parentFrame().then(() => {
                    that._logger.verbose("Done!");
                });
            }
        });
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Takes a snapshot of the application under test and matches it with
     * the expected output.
     * @param {String} tag An optional tag to be associated with the snapshot.
     * @param {int} matchTimeout The amount of time to retry matching (Milliseconds).
     * @return {ManagedPromise} A promise which is resolved when the validation is finished.
     */
    checkWindow(tag, matchTimeout) {
        return this.check(tag, Target.window().timeout(matchTimeout));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Matches the frame given as parameter, by switching into the frame and
     * using stitching to get an image of the frame.
     * @param {EyesRemoteWebElement} element The element which is the frame to switch to. (as
     * would be used in a call to driver.switchTo().frame() ).
     * @param {int} matchTimeout The amount of time to retry matching (milliseconds).
     * @param {String} tag An optional tag to be associated with the match.
     * @return {ManagedPromise} A promise which is resolved when the validation is finished.
     */
    checkFrame(element, matchTimeout, tag) {
        return this.check(tag, Target.frame(element).timeout(matchTimeout));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Takes a snapshot of the application under test and matches a specific
     * element with the expected region output.
     * @param {WebElement|EyesRemoteWebElement} element The element to check.
     * @param {int|null} matchTimeout The amount of time to retry matching (milliseconds).
     * @param {String} tag An optional tag to be associated with the match.
     * @return {ManagedPromise} A promise which is resolved when the validation is finished.
     */
    checkElement(element, matchTimeout, tag) {
        return this.check(tag, Target.region(element).timeout(matchTimeout).fully());
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Takes a snapshot of the application under test and matches a specific
     * element with the expected region output.
     * @param {By} locator The element to check.
     * @param {int|null} matchTimeout The amount of time to retry matching (milliseconds).
     * @param {String} tag An optional tag to be associated with the match.
     * @return {ManagedPromise} A promise which is resolved when the validation is finished.
     */
    checkElementBy(locator, matchTimeout, tag) {
        return this.check(tag, Target.region(locator).timeout(matchTimeout).fully());
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Visually validates a region in the screenshot.
     * @param {{left: number, top: number, width: number, height: number}} region The region to
     * validate (in screenshot coordinates).
     * @param {String} tag An optional tag to be associated with the screenshot.
     * @param {int} matchTimeout The amount of time to retry matching.
     * @return {ManagedPromise} A promise which is resolved when the validation is finished.
     */
    checkRegion(region, tag, matchTimeout) {
        return this.check(tag, Target.region(region).timeout(matchTimeout));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Visually validates a region in the screenshot.
     * @param {WebElement|EyesRemoteWebElement} element The element defining the region to validate.
     * @param {String} tag An optional tag to be associated with the screenshot.
     * @param {int} matchTimeout The amount of time to retry matching.
     * @return {ManagedPromise} A promise which is resolved when the validation is finished.
     */
    checkRegionByElement(element, tag, matchTimeout) {
        return this.check(tag, Target.region(element).timeout(matchTimeout));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Visually validates a region in the screenshot.
     * @param {By} by The WebDriver selector used for finding the region to validate.
     * @param {String} tag An optional tag to be associated with the screenshot.
     * @param {int} matchTimeout The amount of time to retry matching.
     * @return {ManagedPromise} A promise which is resolved when the validation is finished.
     */
    checkRegionBy(by, tag, matchTimeout) {
        return this.check(tag, Target.region(by).timeout(matchTimeout));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Switches into the given frame, takes a snapshot of the application under
     * test and matches a region specified by the given selector.
     * @param {String} frameNameOrId The name or id of the frame to switch to. (as would be used in a call to driver.switchTo().frame()).
     * @param {By} locator A Selector specifying the region to check.
     * @param {int|null} matchTimeout The amount of time to retry matching. (Milliseconds)
     * @param {String} tag An optional tag to be associated with the snapshot.
     * @param {boolean} stitchContent If {@code true}, stitch the internal content of the region (i.e., perform
     *                  {@link #checkElement(By, int, String)} on the region.
     * @return {ManagedPromise} A promise which is resolved when the validation is finished.
     */
    checkRegionInFrame(frameNameOrId, locator, matchTimeout, tag, stitchContent) {
        return this.check(tag, Target.region(locator, frameNameOrId).timeout(matchTimeout).fully(stitchContent));
    }

    /**
     * Updates the state of scaling related parameters.
     *
     * @protected
     * @return {Promise<ScaleProviderFactory>}
     */
    updateScalingParams() {
        // Update the scaling params only if we haven't done so yet, and the user hasn't set anything else manually.
        if (this._devicePixelRatio === Eyes.UNKNOWN_DEVICE_PIXEL_RATIO && this._scaleProviderHandler.get() instanceof NullScaleProvider) {
            this._logger.verbose("Trying to extract device pixel ratio...");

            const that = this;
            return EyesSeleniumUtils.getDevicePixelRatio(that._driver, that._promiseFactory).then(ratio => {
                that._devicePixelRatio = ratio;
            }).catch(err => {
                that._logger.verbose("Failed to extract device pixel ratio! Using default.", err);
                that._devicePixelRatio = Eyes.DEFAULT_DEVICE_PIXEL_RATIO;
            }).then(() => {
                that._logger.verbose(`Device pixel ratio: ${that._devicePixelRatio}`);
                return that._positionProvider.getEntireSize();
            }).then(entireSize => {
                that._logger.verbose("Setting scale provider...");
                return new ContextBasedScaleProviderFactory(that._logger, entireSize, that._viewportSizeHandler.get(), that._devicePixelRatio, EyesSeleniumUtils.isMobileDevice(driver), that._scaleProviderHandler);
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
        return this._promiseFactory.resolve(new ScaleProviderIdentityFactory(this._scaleProviderHandler.get(), nullProvider));
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
            this._logger.verbose(`Ignoring ${action} (no screenshot)`, );
            return;
        }

        if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
            this._logger.verbose(`Ignoring ${action} (different frame)`);
            return;
        }

        super.addMouseTriggerBase(action, control, cursor);
    }

    /**
     * Adds a mouse trigger.
     *
     * @param {MouseTrigger.MouseAction} action  Mouse action.
     * @param {WebElement} element The WebElement on which the click was called.
     * @return {Promise<void>}
     */
    addMouseTriggerForElement(action, element) {
        if (this.getIsDisabled()) {
            this._logger.verbose(`Ignoring ${action} (disabled)`);
            return this._promiseFactory.resolve();
        }

        // Triggers are actually performed on the previous window.
        if (!this._lastScreenshot) {
            this._logger.verbose(`Ignoring ${action} (no screenshot)`, );
            return this._promiseFactory.resolve();
        }

        if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
            this._logger.verbose(`Ignoring ${action} (different frame)`);
            return this._promiseFactory.resolve();
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
            this._logger.verbose(`Ignoring ${action} (disabled)`);
            return;
        }

        // Triggers are actually performed on the previous window.
        if (!this._lastScreenshot) {
            this._logger.verbose(`Ignoring ${action} (no screenshot)`, );
            return;
        }

        if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
            this._logger.verbose(`Ignoring ${action} (different frame)`);
            return;
        }

        super.addTextTriggerBase(control, text);
    }

    /**
     * Adds a keyboard trigger.
     *
     * @param {WebElement} element The element for which we sent keys.
     * @param {String} text  The trigger's text.
     * @return {Promise<void>}
     */
    addTextTriggerForElement(element, text) {
        if (this.getIsDisabled()) {
            this._logger.verbose(`Ignoring ${action} (disabled)`);
            return this._promiseFactory.resolve();
        }

        // Triggers are actually performed on the previous window.
        if (!this._lastScreenshot) {
            this._logger.verbose(`Ignoring ${action} (no screenshot)`, );
            return this._promiseFactory.resolve();
        }

        if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
            this._logger.verbose(`Ignoring ${action} (different frame)`);
            return this._promiseFactory.resolve();
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
            super.addTextTrigger(elementRegion, text);
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

    /**
     * Call this method if for some reason you don't want to call {@link #open(WebDriver, String, String)} (or one of its variants) yet.
     *
     * @param {WebDriver} driver The driver to use for getting the viewport.
     * @param {PromiseFactory} [promiseFactory]
     * @return {Promise.<RectangleSize>} The viewport size of the current context.
     */
    static getViewportSize(driver, promiseFactory) {
        ArgumentGuard.notNull(driver, "driver");

        if (!promiseFactory) {
            promiseFactory = new PromiseFactory();
            promiseFactory.setFactoryMethods(asyncAction =>  new Promise(asyncAction), null);
        }

        return EyesSeleniumUtils.getViewportSizeOrDisplaySize(new Logger(), driver, promiseFactory);
    }

    /**
     * Use this method only if you made a previous call to {@link #open(WebDriver, String, String)} or one of its variants.
     *
     * @protected
     * @override
     * @inheritDoc
     * @param {RectangleSize} size
     */
    setViewportSize(size) {
        if (this._viewportSizeHandler instanceof ReadOnlyPropertyHandler) {
            logger.verbose("Ignored (viewport size given explicitly)");
            return;
        }

        const originalFrame = this._driver.getFrameChain();
        this._driver.switchTo().defaultContent();

        try {
            EyesSeleniumUtils.setViewportSize(logger, driver, size);
        } catch (err) {
            // Just in case the user catches this error
            ((EyesTargetLocator) driver.switchTo()).frames(originalFrame);

            throw new TestFailedException("Failed to set the viewport size", e);
        }

        ((EyesTargetLocator) driver.switchTo()).frames(originalFrame);
        this._viewportSizeHandler.set(new RectangleSize(size.getWidth(), size.getHeight()));
    }

    /**
     * Set the viewport size using the driver. Call this method if for some reason you don't want to call {@link #open(WebDriver, String, String)} (or one of its variants) yet.
     *
     * @param {WebDriver} driver The driver to use for setting the viewport.
     * @param {RectangleSize} size The required viewport size.
     * @param {PromiseFactory} [promiseFactory]
     * @return {Promise<void>}
     */
    static setViewportSize(driver, size, promiseFactory) {
        ArgumentGuard.notNull(driver, "driver");

        if (!promiseFactory) {
            promiseFactory = new PromiseFactory();
            promiseFactory.setFactoryMethods(asyncAction =>  new Promise(asyncAction), null);
        }

        EyesSeleniumUtils.setViewportSize(new Logger(), driver, size, promiseFactory);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get an updated screenshot.
     * @return {Promise.<MutableImage>} The image of the new screenshot.
     */
    getScreenShot() {
        const that = this;
        return that.updateScalingParams().then(scaleProviderFactory => EyesSeleniumUtils.getScreenshot(
            that._driver,
            that._promiseFactory,
            that._viewportSize,
            that._positionProvider,
            scaleProviderFactory,
            that._cutProviderHandler.get(),
            that._forceFullPageScreenshot,
            that._hideScrollbars,
            that._stitchMode === StitchMode.CSS,
            that._imageRotationDegrees,
            that._automaticRotation,
            that._hostOS === 'Android' ? 90 : 270,
            that._isLandscape,
            that._waitBeforeScreenshots,
            that._checkFrameOrElement,
            that._regionToCheck,
            that._saveDebugScreenshots,
            that._debugScreenshotsPath
        ));
    }

    //noinspection JSUnusedGlobalSymbols
    getTitle() {
        return this._driver.getTitle();
    }

    //noinspection JSUnusedGlobalSymbols
    _waitTimeout(ms) {
        return this._flow.timeout(ms);
    }

    //noinspection JSUnusedGlobalSymbols
    getInferredEnvironment() {
        const res = 'useragent:';
        return this._driver.executeScript('return navigator.userAgent')
            .then(userAgent => res + userAgent, () => res);
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
        return this._promiseFactory.makePromise(resolve => {
            if (!this._driver) {
                resolve(undefined);
                return;
            }
            this._driver.getSession().then(session => {
                resolve(session.getId());
            });
        });
    }
}

function _init(that, flow) {
    // Set PromiseFactory to work with the protractor control flow and promises
    that._promiseFactory.setFactoryMethods(asyncAction => flow.execute(() => {
        return new Promise(asyncAction);
    }), null);
}

function findElementByLocator(that, elementObject) {
    return that._promiseFactory.makePromise(resolve => {
        if (isLocatorObject(elementObject)) {
            that._logger.verbose("Trying to find element...", elementObject);
            return resolve(that._driver.findElement(elementObject));
        } else if (elementObject instanceof ElementFinderWrapper) {
            return resolve(elementObject.getWebElement());
        }

        resolve(elementObject);
    });
}

function isElementObject(o) {
    return o instanceof EyesRemoteWebElement;
}

function isLocatorObject(o) {
    return o instanceof By || o.findElementsOverride !== undefined || (o.using !== undefined && o.value !== undefined);
}

/**
 * Get the region provider for a certain element.
 * @param {Eyes} eyes The eyes instance.
 * @param {EyesRemoteWebElement|WebElement} element The element to get a region for.
 * @return {Promise<EyesRegionProvider>} The region for a certain element.
 */
function getRegionProviderForElement(eyes, element) {
    let elementLocation, elementSize, borderLeftWidth, borderRightWidth, borderTopWidth;

    eyes._logger.verbose("getRegionProviderForElement");
    return element.getLocation().then(value => {
        elementLocation = value;
        return element.getSize();
    }).then(value => {
        elementSize = value;
        return element.getBorderLeftWidth();
    }).then(value => {
        borderLeftWidth = value;
        return element.getBorderRightWidth();
    }).then(value => {
        borderRightWidth = value;
        return element.getBorderTopWidth();
    }).then(value => {
        borderTopWidth = value;
        return element.getBorderBottomWidth();
    }).then(value => { // borderBottomWidth
        const elementRegion = new Region(
            elementLocation.x + borderLeftWidth,
            elementLocation.y + borderTopWidth,
            elementSize.width - borderLeftWidth - borderRightWidth,
            elementSize.height - borderTopWidth - value
        );

        eyes._logger.verbose("Done! Element region", elementRegion);
        return new EyesRegionProvider(eyes._logger, eyes._driver, elementRegion, CoordinatesType.CONTEXT_RELATIVE);
    });
}

/**
 * Get region provider for the current frame.
 * @param {Eyes} eyes The eyes instance.
 * @return {Promise<EyesRegionProvider>} The region provider for the certain frame.
 */
function getRegionProviderForCurrentFrame(eyes) {
    let screenshot, scaleProviderFactory, mutableImage;
    eyes._logger.verbose("getRegionProviderForCurrentFrame");
    return eyes.updateScalingParams().then(factory => {
        scaleProviderFactory = factory;
        eyes._logger.verbose("Getting screenshot as base64...");
        return eyes._driver.takeScreenshot();
    }).then(image64 => MutableImage.fromBase64(image64, eyes._promiseFactory)).then(image => {
        mutableImage = image;
        return mutableImage.getSize();
    }).then(imageSize => {
        eyes._logger.verbose("Scaling image...");
        const scaleProvider = scaleProviderFactory.getScaleProvider(imageSize.width);
        return mutableImage.scaleImage(scaleProvider.getScaleRatio());
    }).then(scaledImage => {
        eyes._logger.verbose("Done! Building required object...");
        screenshot = new EyesWebDriverScreenshot(eyes._logger, eyes._driver, scaledImage, eyes._promiseFactory);
        return screenshot.buildScreenshot();
    }).then(() => {
        const frameRegion = screenshot.getFrameWindow();
        eyes._logger.verbose("Done! Frame region", frameRegion);
        return new EyesRegionProvider(eyes._logger, eyes._driver, frameRegion, CoordinatesType.SCREENSHOT_AS_IS);
    });
}

/**
 * Get the region for a certain web element.
 * @param {EyesRemoteWebElement|WebElement} element The web element to get the region from.
 * @return {Promise<Region>} The region.
 */
function getRegionFromWebElement(element) {
    return element.getSize().then(size => element.getLocation().then(point => new Region(point.x, point.y, size.width, size.height)));
}

Eyes.UNKNOWN_DEVICE_PIXEL_RATIO = 0;
Eyes.DEFAULT_DEVICE_PIXEL_RATIO = 1;
module.exports = Eyes;
