'use strict';

const {ArgumentGuard, EyesScreenshot, CoordinatesType, Region, Location, CoordinatesTypeConversionError, OutOfBoundsError} = require('eyes.sdk');

const SeleniumJavaScriptExecutor = require('../SeleniumJavaScriptExecutor');
const ScrollPositionProvider = require('../positioning/ScrollPositionProvider');
const FrameChain = require('../frames/FrameChain');

/**
 * @readonly
 * @enum {number}
 */
const ScreenshotType = {
    VIEWPORT: 1,
    ENTIRE_FRAME: 2
};

class EyesWebDriverScreenshot extends EyesScreenshot {

    /**
     * !WARNING! After creating new instance of EyesWebDriverScreenshot, it should be initialized by calling to init or initFromFrameSize method
     *
     * @param {Logger} logger A Logger instance.
     * @param {EyesWebDriver} driver The web driver used to get the screenshot.
     * @param {MutableImage} image The actual screenshot image.
     * @param {PromiseFactory} promiseFactory
     */
    constructor(logger, driver, image, promiseFactory) {
        super(image);

        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(driver, "driver");
        ArgumentGuard.notNull(promiseFactory, "promiseFactory");

        this._logger = logger;
        this._executor = driver;
        this._promiseFactory = promiseFactory;
        /** @type {FrameChain} */
        this._frameChain = driver.getFrameChain();
        /** @type {Location} */
        this._currentFrameScrollPosition = null;
        /** @type {ScreenshotType} */
        this._screenshotType = null;

        /**
         * The top/left coordinates of the frame window(!) relative to the top/left
         * of the screenshot. Used for calculations, so can also be outside(!) the screenshot.
         *
         * @type {Location} */
        this._frameLocationInScreenshot = null;

        /**
         * The top/left coordinates of the frame window(!) relative to the top/left
         * of the screenshot. Used for calculations, so can also be outside(!) the screenshot.
         *
         * @type {Region} */
        this._frameWindow = null;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Creates a frame(!) window screenshot.
     *
     * @param {RectangleSize} entireFrameSize The full internal size of the frame.
     * @return {Promise.<EyesWebDriverScreenshot>}
     */
    initFromFrameSize(entireFrameSize) {
        // The frame comprises the entire screenshot.
        this._screenshotType = ScreenshotType.ENTIRE_FRAME;

        this._currentFrameScrollPosition = new Location(0, 0);
        this._frameLocationInScreenshot = new Location(0, 0);
        this._frameWindow = Region.fromLocationAndSize(new Location(0, 0), entireFrameSize);
        return this._promiseFactory.resolve(this);
    }

    /**
     * @param {ScreenshotType} [screenshotType] The screenshot's type (e.g., viewport/full page).
     * @param {Location} [frameLocationInScreenshot[ The current frame's location in the screenshot.
     * @return {Promise.<EyesWebDriverScreenshot>}
     */
    init(screenshotType, frameLocationInScreenshot) {
        const that = this;
        return that._updateScreenshotType(screenshotType, that._image).then(screenshotType => {
            that._screenshotType = screenshotType;

            const jsExecutor = new SeleniumJavaScriptExecutor(that._executor);
            const positionProvider = new ScrollPositionProvider(that._logger, jsExecutor);

            that._frameChain = that._executor.getFrameChain();
            return that._getFrameSize(positionProvider).then(frameSize => {
                return that._getUpdatedScrollPosition(positionProvider).then(currentFrameScrollPosition => {
                    that._currentFrameScrollPosition = currentFrameScrollPosition;
                    return that._getUpdatedFrameLocationInScreenshot(frameLocationInScreenshot);
                }).then(frameLocationInScreenshot => {
                    that._frameLocationInScreenshot = frameLocationInScreenshot;

                    that._logger.verbose("Calculating frame window...");
                    that._frameWindow = Region.fromLocationAndSize(frameLocationInScreenshot, frameSize);
                    that._frameWindow.intersect(new Region(0, 0, that._image.getWidth(), that._image.getHeight()));
                    if (that._frameWindow.getWidth() <= 0 || that._frameWindow.getHeight() <= 0) {
                        throw new Error("Got empty frame window for screenshot!");
                    }

                    that._logger.verbose("Done!");
                    return that;
                });
            });
        });
    }

    /**
     * @private
     * @return {Promise.<Location>}
     */
    _getDefaultContentScrollPosition() {
        const jsExecutor = new SeleniumJavaScriptExecutor(this._executor);
        const positionProvider = new ScrollPositionProvider(this._logger, jsExecutor);
        if (this._frameChain.size() === 0) {
            return positionProvider.getCurrentPosition();
        }

        /** @type {TargetLocator} */
        const switchTo = this._executor.getRemoteWebDriver().switchTo();

        const that = this;
        return switchTo.defaultContent().then(() => {
            return positionProvider.getCurrentPosition();
        }).then(defaultContentScrollPosition => {
            return that._switchFrameLoop(switchTo).then(() => defaultContentScrollPosition);
        });
    }

    /**
     * @private
     * @param {TargetLocator} switchTo
     * @return {Promise.<Location>}
     */
    _switchFrameLoop(switchTo) {
        return this._frameChain.getFrames().reduce((promise, frame) => {
            return promise.then(() => {
                const frameElement = frame.getReference();
                return switchTo.frame(frameElement);
            });
        }, this._promiseFactory.resolve());
    }

    /**
     * @private
     * @return {Promise.<Location>}
     */
    _calcFrameLocationInScreenshot() {
        this._logger.verbose("Getting first frame..");
        const firstFrame = this._frameChain.getFrame(0);
        this._logger.verbose("Done!");
        let promise = this._promiseFactory.resolve();
        let locationInScreenshot = Location.copy(firstFrame.getLocation());

        // We only consider scroll of the default content if this is a viewport screenshot.
        if (this._screenshotType === ScreenshotType.VIEWPORT) {
            promise = promise.then(() => this._getDefaultContentScrollPosition()).then(windowScroll => {
                locationInScreenshot = locationInScreenshot.offset(-windowScroll.getX(), -windowScroll.getY());
            });
        }

        const that = this;
        return promise.then(() => {
            that._logger.verbose("Iterating over frames..");
            let frame;
            for (let i = 1, l = that._frameChain.size(); i < l; ++i) {
                that._logger.verbose("Getting next frame...");
                frame = that._frameChain.getFrame(i);
                that._logger.verbose("Done!");
                const frameLocation = frame.getLocation();
                // For inner frames we must consider the scroll
                const frameParentScrollPosition = frame.getParentScrollPosition();
                // Offsetting the location in the screenshot
                locationInScreenshot = locationInScreenshot.offset(frameLocation.getX() - frameParentScrollPosition.getX(), frameLocation.getY() - frameParentScrollPosition.getY());
            }

            that._logger.verbose("Done!");
            return locationInScreenshot;
        })
    }

    /**
     * @private
     * @param {Location} frameLocationInScreenshot
     * @return {Promise.<Location>}
     */
    _getUpdatedFrameLocationInScreenshot(frameLocationInScreenshot) {
        // This is used for frame related calculations.
        if (!frameLocationInScreenshot) {
            if (this._frameChain.size() > 0) {
               return this._calcFrameLocationInScreenshot();
            } else {
                return this._promiseFactory.resolve(new Location(0, 0));
            }
        }
        return this._promiseFactory.resolve(frameLocationInScreenshot);
    }

    /**
     * @private
     * @param {ScrollPositionProvider} positionProvider
     * @return {Promise.<Location>}
     */
    _getUpdatedScrollPosition(positionProvider) {
        return positionProvider.getCurrentPosition().catch(() => {
            return new Location(0, 0);
        });
    }

    /**
     * @private
     * @param {ScrollPositionProvider} positionProvider
     * @return {Promise.<RectangleSize>}
     */
    _getFrameSize(positionProvider) {
        if (this._frameChain.size() !== 0) {
            return this._promiseFactory.resolve(this._frameChain.getCurrentFrameInnerSize());
        } else {
            // get entire page size might throw an exception for applications which don't support Javascript (e.g., Appium).
            // In that case we'll use the viewport size as the frame's size.
            const that = this;
            return positionProvider.getEntireSize().catch(() => {
                return that._executor.getDefaultContentViewportSize();
            });
        }
    }

    /**
     * @private
     * @param {ScreenshotType} screenshotType
     * @param {MutableImage} image
     * @return {Promise.<ScreenshotType>}
     */
    _updateScreenshotType(screenshotType, image) {
        if (!screenshotType) {
            const that = this;
            return that._executor.getDefaultContentViewportSize().then(viewportSize => {
                const scaleViewport = that._executor.getEyes().shouldStitchContent();

                if (scaleViewport) {
                    const pixelRatio = that._executor.getEyes().getDevicePixelRatio();
                    viewportSize = viewportSize.scale(pixelRatio);
                }

                if (image.getWidth() <= viewportSize.getWidth() && image.getHeight() <= viewportSize.getHeight()) {
                    return ScreenshotType.VIEWPORT;
                } else {
                    return ScreenshotType.ENTIRE_FRAME;
                }
            })
        }
        return this._promiseFactory.resolve(screenshotType);
    }

    /**
     * @return {Region} The region of the frame which is available in the screenshot, in screenshot coordinates.
     */
    getFrameWindow() {
        return this._frameWindow;
    }

    /**
     * @return {FrameChain} A copy of the frame chain which was available when the screenshot was created.
     */
    getFrameChain() {
        return new FrameChain(this._logger, this._frameChain);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Returns a part of the screenshot based on the given region.
     *
     * @override
     * @param {Region} region The region for which we should get the sub screenshot.
     * @param {Boolean} throwIfClipped Throw an EyesException if the region is not fully contained in the screenshot.
     * @return {Promise.<EyesWebDriverScreenshot>} A screenshot instance containing the given region.
     */
    getSubScreenshot(region, throwIfClipped) {
        this._logger.verbose(`getSubScreenshot([${region}], ${throwIfClipped})`);

        ArgumentGuard.notNull(region, "region");

        // We calculate intersection based on as-is coordinates.
        const asIsSubScreenshotRegion = this.getIntersectedRegion(region, region.getCoordinatesType(), CoordinatesType.SCREENSHOT_AS_IS);

        if (asIsSubScreenshotRegion.isEmpty() || (throwIfClipped && !asIsSubScreenshotRegion.getSize().equals(region.getSize()))) {
            throw new OutOfBoundsError(`Region [${region}] is out of screenshot bounds [${this._frameWindow}]`);
        }

        const that = this;
        return this._image.getImagePart(asIsSubScreenshotRegion).then(subScreenshotImage => {
            // The frame location in the sub screenshot is the negative of the context-as-is location of the region.
            const contextAsIsRegionLocation = that.convertLocation(asIsSubScreenshotRegion.getLocation(), CoordinatesType.SCREENSHOT_AS_IS, CoordinatesType.CONTEXT_AS_IS);

            const frameLocationInSubScreenshot = new Location(-contextAsIsRegionLocation.getX(), -contextAsIsRegionLocation.getY());

            const result = new EyesWebDriverScreenshot(that._logger, that._executor, subScreenshotImage, that._promiseFactory);
            return result.init(that._screenshotType, frameLocationInSubScreenshot);
        }).then(result => {
            that._logger.verbose("Done!");
            return result;
        });
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Converts a location's coordinates with the {@code from} coordinates type to the {@code to} coordinates type.
     *
     * @override
     * @param {Location} location The location which coordinates needs to be converted.
     * @param {CoordinatesType} from The current coordinates type for {@code location}.
     * @param {CoordinatesType} to The target coordinates type for {@code location}.
     * @return {Location} A new location which is the transformation of {@code location} to the {@code to} coordinates type.
     */
    convertLocation(location, from, to) {
        ArgumentGuard.notNull(location, "location");
        ArgumentGuard.notNull(from, "from");
        ArgumentGuard.notNull(to, "to");

        let result = Location.copy(location);

        if (from === to) {
            return result;
        }

        // If we're not inside a frame, and the screenshot is the entire page, then the context as-is/relative are the same (notice
        // screenshot as-is might be different, e.g., if it is actually a sub-screenshot of a region).
        if (this._frameChain.size() === 0 && this._screenshotType === ScreenshotType.ENTIRE_FRAME) {
            if ((from === CoordinatesType.CONTEXT_RELATIVE || from === CoordinatesType.CONTEXT_AS_IS) && to === CoordinatesType.SCREENSHOT_AS_IS) {
                // If this is not a sub-screenshot, this will have no effect.
                result = result.offset(this._frameLocationInScreenshot.getX(), this._frameLocationInScreenshot.getY());
            } else if (from === CoordinatesType.SCREENSHOT_AS_IS && (to === CoordinatesType.CONTEXT_RELATIVE || to === CoordinatesType.CONTEXT_AS_IS)) {
                result = result.offset(-this._frameLocationInScreenshot.getX(), -this._frameLocationInScreenshot.getY());
            }
            return result;
        }

        switch (from) {
            case CoordinatesType.CONTEXT_AS_IS:
                switch (to) {
                    case CoordinatesType.CONTEXT_RELATIVE:
                        result = result.offset(this._currentFrameScrollPosition.getX(), this._currentFrameScrollPosition.getY());
                        break;
                    case CoordinatesType.SCREENSHOT_AS_IS:
                        result = result.offset(this._frameLocationInScreenshot.getX(), this._frameLocationInScreenshot.getY());
                        break;
                    default:
                        throw new CoordinatesTypeConversionError(from, to);
                }
                break;

            case CoordinatesType.CONTEXT_RELATIVE:
                switch (to) {
                    case CoordinatesType.SCREENSHOT_AS_IS:
                        // First, convert context-relative to context-as-is.
                        result = result.offset(-this._currentFrameScrollPosition.getX(), -this._currentFrameScrollPosition.getY());
                        // Now convert context-as-is to screenshot-as-is.
                        result = result.offset(this._frameLocationInScreenshot.getX(), this._frameLocationInScreenshot.getY());
                        break;
                    case CoordinatesType.CONTEXT_AS_IS:
                        result = result.offset(-this._currentFrameScrollPosition.getX(), -this._currentFrameScrollPosition.getY());
                        break;
                    default:
                        throw new CoordinatesTypeConversionError(from, to);
                }
                break;

            case CoordinatesType.SCREENSHOT_AS_IS:
                switch (to) {
                    case CoordinatesType.CONTEXT_RELATIVE:
                        // First convert to context-as-is.
                        result = result.offset(-this._frameLocationInScreenshot.getX(), -this._frameLocationInScreenshot.getY());
                        // Now convert to context-relative.
                        result = result.offset(this._currentFrameScrollPosition.getX(), this._currentFrameScrollPosition.getY());
                        break;
                    case CoordinatesType.CONTEXT_AS_IS:
                        result = result.offset(-this._frameLocationInScreenshot.getX(), -this._frameLocationInScreenshot.getY());
                        break;
                    default:
                        throw new CoordinatesTypeConversionError(from, to);
                }
                break;

            default:
                throw new CoordinatesTypeConversionError(from, to);
        }
        return result;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @override
     * @param {Location} location
     * @param {CoordinatesType} coordinatesType
     * @return {Location}
     */
    getLocationInScreenshot(location, coordinatesType) {
        this._location = this.convertLocation(location, coordinatesType, CoordinatesType.SCREENSHOT_AS_IS);

        // Making sure it's within the screenshot bounds
        if (!this._frameWindow.containsLocation(location)) {
            throw new OutOfBoundsError(`Location ${location} ('${coordinatesType}') is not visible in screenshot!`);
        }
        return this._location;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @override
     * @param {Region} region
     * @param {CoordinatesType} originalCoordinatesType
     * @param {CoordinatesType} [resultCoordinatesType]
     * @return {Region}
     */
    getIntersectedRegion(region, originalCoordinatesType, resultCoordinatesType = originalCoordinatesType) {
        if (region.isEmpty()) {
            return Region.copy(region);
        }

        let intersectedRegion = this.convertRegionLocation(region, originalCoordinatesType, CoordinatesType.SCREENSHOT_AS_IS);

        switch (originalCoordinatesType) {
            // If the request was context based, we intersect with the frame window.
            case CoordinatesType.CONTEXT_AS_IS:
            case CoordinatesType.CONTEXT_RELATIVE:
                intersectedRegion.intersect(this._frameWindow);
                break;
            // If the request is screenshot based, we intersect with the image
            case CoordinatesType.SCREENSHOT_AS_IS:
                intersectedRegion.intersect(new Region(0, 0, this._image.getWidth(), this._.getHeight()));
                break;
            default:
                throw new CoordinatesTypeConversionError(from, to);
        }

        // If the intersection is empty we don't want to convert the coordinates.
        if (intersectedRegion.isEmpty()) {
            return intersectedRegion;
        }

        // Converting the result to the required coordinates type.
        intersectedRegion = this.convertRegionLocation(intersectedRegion, CoordinatesType.SCREENSHOT_AS_IS, resultCoordinatesType);
        return intersectedRegion;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Gets the elements region in the screenshot.
     *
     * @param {WebElement} element The element which region we want to intersect.
     * @return {Promise.<Region>} The intersected region, in {@code SCREENSHOT_AS_IS} coordinates type.
     */
    getIntersectedRegionFromElement(element) {
        ArgumentGuard.notNull(element, "element");

        const that = this;
        return element.getLocation().then(point => {
            return element.getSize().then(size => {
                // Since the element coordinates are in context relative
                let elementRegion = new Region(point.x, point.y, size.width, size.height);

                // Since the element coordinates are in context relative
                elementRegion = that.getIntersectedRegion(elementRegion, CoordinatesType.CONTEXT_RELATIVE);

                if (!elementRegion.isEmpty()) {
                    elementRegion = that.convertRegionLocation(elementRegion, CoordinatesType.CONTEXT_RELATIVE, CoordinatesType.SCREENSHOT_AS_IS);
                }

                return elementRegion;
            });
        });
    }
}

EyesWebDriverScreenshot.ScreenshotType = Object.freeze(ScreenshotType);
module.exports = EyesWebDriverScreenshot;
