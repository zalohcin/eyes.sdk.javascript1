'use strict';

const command = require('selenium-webdriver/lib/command');
const {TargetLocator} = require('selenium-webdriver/lib/webdriver');
const {Location, RectangleSize, ArgumentGuard} = require('eyes.sdk');

const Frame = require('../frames/Frame');
const FrameChain = require('../frames/FrameChain');
const ScrollPositionProvider = require('../positioning/ScrollPositionProvider');
const SeleniumJavaScriptExecutor = require('./../SeleniumJavaScriptExecutor');
const BordersAwareElementContentLocationProvider = require('./../BordersAwareElementContentLocationProvider');
const EyesWebElement = require('./EyesWebElement');
const EyesWebElementPromise = require('./EyesWebElementPromise');

/**
 * Wraps a target locator so we can keep track of which frames have been switched to.
 */
class EyesTargetLocator extends TargetLocator {

    /**
     * Initialized a new EyesTargetLocator object.
     *
     * @param {Logger} logger A Logger instance.
     * @param {EyesWebDriver} driver The WebDriver from which the targetLocator was received.
     * @param {TargetLocator} targetLocator The actual TargetLocator object.
     */
    constructor(logger, driver, targetLocator) {
        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(driver, "driver");
        ArgumentGuard.notNull(targetLocator, "targetLocator");

        super(driver.getRemoteWebDriver());

        this._logger = logger;
        this._driver = driver;
        this._targetLocator = targetLocator;
        this._jsExecutor = new SeleniumJavaScriptExecutor(driver);
        this._scrollPosition = new ScrollPositionProvider(this._logger, this._jsExecutor);
    }

    // noinspection JSCheckFunctionSignatures
    /**
     * Schedules a command to switch the focus of all future commands to another
     * frame on the page. The target frame may be specified as one of the following:
     *
     * - A number that specifies a (zero-based) index into [window.frames](
     *   https://developer.mozilla.org/en-US/docs/Web/API/Window.frames).
     * - A string, which correspond to a `id` or `name` of element.
     * - A {@link WebElement} reference, which correspond to a `frame` or `iframe` DOM element.
     * - The `null` value, to select the topmost frame on the page. Passing `null`
     *   is the same as calling {@link #defaultContent defaultContent()}.
     *
     * @override
     * @param {number|string|WebElement|null} locator The frame locator.
     * @return {Promise.<EyesWebDriver>}
     */
    frame(locator) {
        const that = this;
        if (!locator) {
            that._logger.verbose("EyesTargetLocator.frame(null)");
            return that.defaultContent();
        }

        if (Number.isInteger(locator)) {
            that._logger.verbose(`EyesTargetLocator.frame(${locator})`);
            // Finding the target element so and reporting it using onWillSwitch.
            that._logger.verbose("Getting frames list...");
            return that._driver.findElementsByCssSelector("frame, iframe").then(frames => {
                if (locator > frames.length) {
                    throw new TypeError(`Frame index [${locator}] is invalid!`);
                }

                that._logger.verbose("Done! getting the specific frame...");
                that._logger.verbose("Done! Making preparations...");
                return that.willSwitchToFrame(EyesTargetLocator.TargetType.FRAME, frames[locator]);
            }).then(() => {
                that._logger.verbose("Done! Switching to frame...");
                return that._targetLocator.frame(locator);
            }).then(() => {
                that._logger.verbose("Done!");
                return that._driver;
            });
        }

        if (typeof locator === 'string' || locator instanceof String) {
            that._logger.verbose(`EyesTargetLocator.frame(${locator})`);
            // Finding the target element so we can report it.
            // We use find elements(plural) to avoid exception when the element is not found.
            that._logger.verbose("Getting frames by name...");
            let frames;
            return that._driver.findElementsByName(locator).then(framesByName => {
                if (framesByName.length === 0) {
                    that._logger.verbose("No frames Found! Trying by id...");
                    // If there are no frames by that name, we'll try the id
                    return that._driver.findElementsById(locator).then(framesById => {
                        if (framesById.length === 0) {
                            // No such frame, bummer
                            throw new TypeError(`No frame with name or id '${locator}' exists!`);
                        }
                        return framesById;
                    });
                }
                return framesByName;
            }).then(frames_ => {
                frames = frames_;
                that._logger.verbose("Done! Making preparations..");
                return that.willSwitchToFrame(EyesTargetLocator.TargetType.FRAME, frames[0]);
            }).then(() => {
                that._logger.verbose("Done! Switching to frame...");
                return that._targetLocator.frame(frames[0]);
            }).then(() => {
                that._logger.verbose("Done!");
                return that._driver;
            });
        }

        that._logger.verbose("EyesTargetLocator.frame(element)");
        that._logger.verbose("Making preparations..");
        return that.willSwitchToFrame(EyesTargetLocator.TargetType.FRAME, locator).then(() => {
            that._logger.verbose("Done! Switching to frame...");
            return that._targetLocator.frame(locator);
        }).then(() => {
            that._logger.verbose("Done!");
            return that._driver;
        });
    }

    /**
     * Change focus to the parent context. If the current context is the top level browsing context, the context remains unchanged.
     *
     * @return {Promise.<EyesWebDriver>}
     */
    parentFrame() {
        const that = this;
        that._logger.verbose("EyesTargetLocator.parentFrame()");
        if (that._driver.getFrameChain().size() !== 0) {
            that._logger.verbose("Making preparations..");
            return that.willSwitchToFrame(EyesTargetLocator.TargetType.PARENT_FRAME, null).then(() => {
                that._logger.verbose("Done! Switching to parent frame..");

                // the command is not exists in selenium js sdk, we should define it manually
                that._driver.getExecutor().defineCommand('switchToParentFrame', 'POST', '/session/:sessionId/frame/parent');
                // noinspection JSCheckFunctionSignatures
                return that._driver.schedule(new command.Command('switchToParentFrame'), 'WebDriver.switchTo().parentFrame()');
            }).then(() => {
                that._logger.verbose("Done!");
                return that._driver;
            });
        }
        return that._driver.getPromiseFactory().resolve(that._driver);
    }

    /**
     * Switches into every frame in the frame chain. This is used as way to switch into nested frames (while considering scroll) in a single call.
     *
     * @param {FrameChain|string[]} obj The path to the frame to switch to. Or the path to the frame to check. This is a list of frame names/IDs (where each frame is nested in the previous frame).
     * @return {Promise.<EyesWebDriver>} The WebDriver with the switched context.
     */
    frames(obj) {
        const that = this;
        if (obj instanceof FrameChain) {
            that._logger.verbose("EyesTargetLocator.frames(frameChain)");
            return obj.getFrames().reduce((promise, frame) => {
                return promise.then(() => {
                    that._logger.verbose("Scrolling by parent scroll position...");
                    return that._scrollPosition.setPosition(frame.getParentScrollPosition());
                }).then(() => {
                    that._logger.verbose("Done! Switching to frame...");
                    return that._driver.switchTo().frame(frame.getReference());
                }).then(() => {
                    that._logger.verbose("Done!");
                });
            }, that._driver.getPromiseFactory().resolve()).then(() => {
                that._logger.verbose("Done switching into nested frames!");
                return that._driver;
            });
        } else if (Array.isArray(obj)) {
            that._logger.verbose("EyesTargetLocator.frames(framesPath)");
            return obj.reduce((promise, frameNameOrId) => {
                return promise.then(() => {
                    that._logger.verbose("Switching to frame...");
                    return that._driver.switchTo().frame(frameNameOrId);
                }).then(() => {
                    that._logger.verbose("Done!");
                });
            }, that._driver.getPromiseFactory().resolve()).then(() => {
                that._logger.verbose("Done switching into nested frames!");
                return that._driver;
            });
        }
    }

    // noinspection JSCheckFunctionSignatures
    /**
     * Schedules a command to switch the focus of all future commands to another window.
     * Windows may be specified by their {@code window.name} attribute or by its handle.
     *
     * @override
     * @param {string} nameOrHandle The name or window handle of the window to switch focus to.
     * @return {Promise.<EyesWebDriver>}
     */
    window(nameOrHandle) {
        const that = this;
        that._logger.verbose("EyesTargetLocator.window()");
        that._driver.getFrameChain().clear();
        that._logger.verbose("Done! Switching to window...");
        return that._targetLocator.window(nameOrHandle).then(() => {
            that._logger.verbose("Done!");
            return that._driver;
        });
    }

    // noinspection JSCheckFunctionSignatures
    /**
     * Schedules a command to switch focus of all future commands to the topmost frame on the page.
     *
     * @override
     * @return {Promise.<EyesWebDriver>}
     */
    defaultContent() {
        const that = this;
        that._logger.verbose("EyesTargetLocator.defaultContent()");
        if (that._driver.getFrameChain().size() !== 0) {
            that._logger.verbose("Making preparations...");
            return that.willSwitchToFrame(EyesTargetLocator.TargetType.DEFAULT_CONTENT, null).then(() => {
                that._logger.verbose("Done! Switching to default content...");
                return that._targetLocator.defaultContent();
            }).then(() => {
                that._logger.verbose("Done!");
            });
        }
        return that._driver.getPromiseFactory().resolve(that._driver);
    }

    // noinspection JSCheckFunctionSignatures
    /**
     * Schedules a command retrieve the {@code document.activeElement} element on the current document,
     * or {@code document.body} if activeElement is not available.
     *
     * @override
     * @return {!EyesWebElementPromise}
     */
    activeElement() {
        this._logger.verbose("EyesTargetLocator.activeElement()");
        this._logger.verbose("Switching to element...");
        // noinspection JSCheckFunctionSignatures
        const id = this._driver.schedule(new command.Command(command.Name.GET_ACTIVE_ELEMENT), 'WebDriver.switchTo().activeElement()');
        this._logger.verbose("Done!");
        return new EyesWebElementPromise(this._logger, this._driver, id);
    }

    /**
     * Schedules a command to change focus to the active modal dialog, such as those opened by `window.alert()`, `window.confirm()`, and `window.prompt()`.
     * The returned promise will be rejected with a {@linkplain error.NoSuchAlertError} if there are no open alerts.
     *
     * @return {!AlertPromise} The open alert.
     */
    alert() {
        this._logger.verbose("EyesTargetLocator.alert()");
        this._logger.verbose("Switching to alert...");
        const result = this._targetLocator.alert();
        this._logger.verbose("Done!");
        return result;
    }

    /**
     * Will be called before switching into a frame.
     *
     * @param {EyesTargetLocator.TargetType} targetType  The type of frame we're about to switch into.
     * @param {WebElement} targetFrame The element about to be switched to, if available. Otherwise, null.
     * @return {Promise}
     */
    willSwitchToFrame(targetType, targetFrame) {
        let promise = this._driver.getPromiseFactory().resolve();

        const that = this;
        that._logger.verbose("willSwitchToFrame()");
        switch (targetType) {
            case EyesTargetLocator.TargetType.DEFAULT_CONTENT:
                that._logger.verbose("Default content.");
                that._driver.getFrameChain().clear();
                break;
            case EyesTargetLocator.TargetType.PARENT_FRAME:
                that._logger.verbose("Parent frame.");
                that._driver.getFrameChain().pop();
                break;
            default: // Switching into a frame
                that._logger.verbose("Frame");

                const eyesFrame = (targetFrame instanceof EyesWebElement) ? targetFrame : new EyesWebElement(that._logger, that._driver, targetFrame);

                let frameId, location, rectangleSize, clientWidth, clientHeight, contentLocation, originalLocation;
                promise = eyesFrame.getId().then(id_ => {
                    frameId = id_;
                    return eyesFrame.getLocation();
                }).then(pl => {
                    location = new Location(pl);
                    return eyesFrame.getSize();
                }).then(ds => {
                    rectangleSize = new RectangleSize(ds);
                    return eyesFrame.getClientWidth();
                }).then(clientWidth_ => {
                    clientWidth = clientWidth_;
                    return eyesFrame.getClientHeight();
                }).then(clientHeight_ => {
                    clientHeight = clientHeight_;
                    // Get the frame's content location.
                    return new BordersAwareElementContentLocationProvider().getLocation(that._logger, eyesFrame, location);
                }).then(contentLocation_ => {
                    contentLocation = contentLocation_;
                    return that._scrollPosition.getCurrentPosition();
                }).then(originalLocation_ => {
                    originalLocation = originalLocation_;
                    return that._scrollPosition.setPosition(location);
                }).then(() => {
                    return that._scrollPosition.getCurrentPosition();
                }).then(currentLocation => {
                    const frame = new Frame(that._logger, targetFrame, contentLocation, rectangleSize, new RectangleSize(clientWidth, clientHeight), currentLocation, originalLocation);
                    that._driver.getFrameChain().push(frame);
                });
        }

        return promise.then(() => {
            that._logger.verbose("Done! FrameChain size: " + that._driver.getFrameChain().size());
        });
    }
}

/**
 * An enum for the different types of frames we can switch into.
 *
 * @enum {string}
 * @readonly
 */
EyesTargetLocator.TargetType = {
    FRAME: 'FRAME',
    PARENT_FRAME: 'PARENT_FRAME',
    DEFAULT_CONTENT: 'DEFAULT_CONTENT'
};

Object.freeze(EyesTargetLocator.TargetType);
module.exports = EyesTargetLocator;
