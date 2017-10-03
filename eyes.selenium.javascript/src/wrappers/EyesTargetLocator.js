'use strict';

const {ArgumentGuard, GeneralUtils} = require('eyes.sdk');

const FrameChain = require('../frames/FrameChain');
const ScrollPositionProvider = require('../positioning/ScrollPositionProvider');
const EyesRemoteWebElement = require('./EyesRemoteWebElement');

/**
 * @enum {number}
 * @readonly
 */
EyesTargetLocator.TargetType = {
    FRAME: 1,
    PARENT_FRAME: 2,
    DEFAULT_CONTENT: 3
};

//noinspection JSUnusedLocalSymbols
/**
 * A wrapper for an action to be performed before the actual switch is made.
 */
function OnWillSwitch() {
    /**
     * Will be called before switching into a frame.
     * @param {TargetType} targetType The type of frame we're about to switch into.
     * @param {WebElement} targetFrame The element about to be switched to,
     * if available. Otherwise, null.
     */
    this.prototype.willSwitchToFrame = (targetType, targetFrame) => {
    };

    /**
     * Will be called before switching into a window.
     * @param {string} nameOrHandle The name/handle of the window to be switched to.
     */
    this.prototype.willSwitchToWindow = nameOrHandle => {
    };
}

class EyesTargetLocator {

    /**
     * Initialized a new EyesTargetLocator object.
     *
     * @param {Object} logger A Logger instance.
     * @param {EyesWebDriver} driver The WebDriver from which the targetLocator was received.
     * @param {TargetLocator} targetLocator The actual TargetLocator object.
     * @param {OnWillSwitch} onWillSwitch A delegate to be called whenever a relevant switch
     * @param {PromiseFactory} promiseFactory is about to be performed.
     */
    constructor(logger, driver, targetLocator, onWillSwitch, promiseFactory) {
        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(driver, "driver");
        ArgumentGuard.notNull(targetLocator, "targetLocator");
        ArgumentGuard.notNull(onWillSwitch, "onWillSwitch");

        this._logger = logger;
        this._driver = driver;
        this._targetLocator = targetLocator;
        this._onWillSwitch = onWillSwitch;
        this._promiseFactory = promiseFactory;
        this._scrollPosition = new ScrollPositionProvider(this._logger, this._driver, this._promiseFactory);
        GeneralUtils.mixin(this, targetLocator);
    }

    /**
     * @param {int|string|EyesRemoteWebElement} obj
     * @return {Promise<void>}
     */
    frame(obj) {
        const that = this;
        let frames;
        if (typeof obj === 'string' || obj instanceof String) {
            this._logger.verbose("EyesTargetLocator.frame('", obj, "')");
            // Finding the target element so we can report it.
            // We use find elements(plural) to avoid exception when the element
            // is not found.
            this._logger.verbose("Getting frames by name...");
            return this._driver.findElementsByName(obj).then(elements => {
                if (elements.length === 0) {
                    that._logger.verbose("No frames Found! Trying by id...");
                    // If there are no frames by that name, we'll try the id
                    return that._driver.findElementsById(obj);
                }

                return elements;
            }).then(elements => {
                if (elements.length === 0) {
                    // No such frame, bummer
                    throw new Error(`No frame with name or id '${obj}' exists!`);
                }

                return elements;
            }).then(frames => {
                if (frames.length === 0) {
                    that._logger.verbose("No frames Found! Trying by id...");
                    // If there are no frames by that name, we'll try the id
                    frames = that._driver.findElementsById(obj);
                    if (frames.length === 0) {
                        // No such frame, bummer
                        throw new Error(`No frame with name or id '${obj}' exists!`);
                    }
                }
                that._logger.verbose("Done! Making preparations..");
                return that._onWillSwitch.willSwitchToFrame(EyesTargetLocator.TargetType.FRAME, frames[0]);
            }).then(() => {
                that._logger.verbose("Done! Switching to frame...");
                return that._targetLocator.frame(obj)
            }).then(() => {
                that._logger.verbose("Done!");
            });
        } else if (obj instanceof EyesRemoteWebElement) {
            that._logger.verbose("EyesTargetLocator.frame(element)");
            that._logger.verbose("Making preparations..");
            return that._onWillSwitch.willSwitchToFrame(EyesTargetLocator.TargetType.FRAME, obj).then(() => {
                that._logger.verbose("Done! Switching to frame...");
                return that._targetLocator.frame(obj.getRemoteWebElement())
            }).then(() => {
                that._logger.verbose("Done!");
            });
        } else {
            that._logger.verbose("EyesTargetLocator.frame(", typeof obj, ")");
            // Finding the target element so and reporting it using onWillSwitch.
            that._logger.verbose("Getting frames list...");
            return that._driver.findElementsByCssSelector("frame, iframe").then(elements => {
                if (obj > elements.length) {
                    throw new Error(`Frame index [${obj}] is invalid!`);
                }

                return elements;
            }).then(frames => {
                that._logger.verbose("Done! getting the specific frame...");
                const targetFrame = frames[obj];
                that._logger.verbose("Done! Making preparations...");
                return that._onWillSwitch.willSwitchToFrame(EyesTargetLocator.TargetType.FRAME, targetFrame);

            }).then(() => {
                that._logger.verbose("Done! Switching to frame...");
                return that._targetLocator.frame(obj)
            }).then(() => {
                that._logger.verbose("Done!");
            });
        }
    }

    /**
     * @return {Promise.<void>}
     */

    parentFrame() {
        const that = this;
        this._logger.verbose("EyesTargetLocator.parentFrame()");
        return this._driver._promiseFactory.makePromise(resolve => {
            if (that._driver.getFrameChain().size() !== 0) {
                that._logger.verbose("Making preparations..");
                return that._onWillSwitch.willSwitchToFrame(EyesTargetLocator.TargetType.PARENT_FRAME, null).then(() => {
                    return that._targetLocator.defaultContent()
                }).then(() => {
                    that._logger.verbose("Done! Switching to parent frame..");
                    return that.frames(that._driver.getFrameChain());
                }).then(() => {
                    that._logger.verbose("Done!");
                    resolve();
                });
            }

            resolve();
        });
    }

    /**
     * Switches into every frame in the frame chain. This is used as way to
     * switch into nested frames (while considering scroll) in a single call.
     * @param {FrameChain|string[]} obj The path to the frame to switch to.
     * Or the path to the frame to check. This is a list of frame names/IDs
     * (where each frame is nested in the previous frame).
     * @return {Promise<void>} The WebDriver with the switched context.
     */
    frames(obj) {
        const that = this;
        return this._driver._promiseFactory.makePromise(resolve => {
            if (obj instanceof FrameChain) {
                that._logger.verbose("EyesTargetLocator.frames(frameChain)");
                if (obj.size() > 0) {
                    return _framesSetPosition(that, obj, obj.size() - 1, that._driver._promiseFactory).then(() => {
                        that._logger.verbose("Done switching into nested frames!");
                        resolve();
                    });
                }

                resolve();
            } else if (Array.isArray(obj)) {
                if (obj.length > 0) {
                    return _framesSetPositionFromArray(that, obj, obj.length - 1, that._driver._promiseFactory).then(() => {
                        that._logger.verbose("Done switching into nested frames!");
                        resolve();
                    });
                }

                resolve();
            }
        });
    }

    /**
     * @param {string} nameOrHandle
     * @return {Promise.<void>}
     */
    window(nameOrHandle) {
        const that = this;
        this._logger.verbose("EyesTargetLocator.window()");
        return this._driver._promiseFactory.makePromise(resolve => {
            that._logger.verbose("Making preparations..");
            that._onWillSwitch.willSwitchToWindow(nameOrHandle).then(() => {
                that._logger.verbose("Done! Switching to window..");
                return that._targetLocator.window(nameOrHandle);
            }).then(() => {
                that._logger.verbose("Done!");
                resolve();
            });
        });
    }

    /**
     * @return {Promise.<void>}
     */
    defaultContent() {
        const that = this;
        return this._driver._promiseFactory.makePromise(resolve => {
            that._logger.verbose("EyesTargetLocator.defaultContent()");
            if (that._driver.getFrameChain().size() !== 0) {
                that._logger.verbose("Making preparations..");
                that._onWillSwitch.willSwitchToFrame(EyesTargetLocator.TargetType.DEFAULT_CONTENT, null).then(() => {
                    that._logger.verbose("Done! Switching to default content..");
                    return that._targetLocator.defaultContent();
                }).then(() => {
                    that._logger.verbose("Done!");
                    resolve();
                });
            }

            resolve();
        });
    }

    /**
     * @return {Promise.<EyesRemoteWebElement>}
     */
    activeElement() {
        const that = this;
        this._logger.verbose("EyesTargetLocator.activeElement()");
        return this._driver._promiseFactory.makePromise(resolve => {
            that._logger.verbose("Switching to element..");
            that._targetLocator.activeElement().then(element => {
                const result = new EyesRemoteWebElement(element, that._driver, that._logger);
                that._logger.verbose("Done!");
                resolve(result);
            })
        });
    }

    /**
     * @return {Promise.<Alert>}
     */
    alert() {
        const that = this;
        this._logger.verbose("EyesTargetLocator.alert()");
        return this._driver._promiseFactory.makePromise(resolve => {
            that._logger.verbose("Switching to alert..");
            that._targetLocator.alert().then(alert => {
                that._logger.verbose("Done!");
                resolve(alert);
            });
        });
    }
}

function _framesSetPosition(targetLocator, obj, retries, promiseFactory) {
    return promiseFactory.makePromise(resolve => {

        // TODO: check order, if it make sense
        const frame = obj.getFrames()[retries];
        targetLocator._scrollPosition.setPosition(frame.getParentScrollPosition()).then(() => {
            targetLocator._logger.verbose("Done! Switching to frame...");
            return targetLocator._driver.switchTo().frame(frame.getReference());
        }).then(() => {
            targetLocator._logger.verbose("Done!");

            if (retries === 0) {
                resolve();
                return;
            }

            targetLocator.controlFlow().then(() => {
                _framesSetPosition(targetLocator, obj, retries - 1, promiseFactory).then(() => {
                    resolve();
                });
            });
        });
    });
}

function _framesSetPositionFromArray(targetLocator, obj, retries, promiseFactory) {
    return promiseFactory.makePromise(resolve => {

        targetLocator._logger.verbose("Switching to frame...");
        targetLocator._driver.switchTo().frame(obj[retries]).then(() => {
            targetLocator._logger.verbose("Done!");

            if (retries === 0) {
                resolve();
                return;
            }

            targetLocator.controlFlow().then(() => {
                _framesSetPositionFromArray(targetLocator, obj, retries - 1, promiseFactory).then(() => {
                    resolve();
                });
            });
        });
    });
}

module.exports = EyesTargetLocator;
