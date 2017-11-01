'use strict';

const {Location, RectangleSize, ArgumentGuard} = require('eyes.sdk');

const NATIVE_APP = 'NATIVE_APP';

const JS_GET_VIEWPORT_SIZE =
    "var height = undefined; " +
    "var width = undefined; " +
    "if (window.innerHeight) { height = window.innerHeight; } " +
    "else if (document.documentElement && document.documentElement.clientHeight) { height = document.documentElement.clientHeight; } " +
    "else { var b = document.getElementsByTagName('body')[0]; if (b.clientHeight) {height = b.clientHeight;} }; " +
    "if (window.innerWidth) { width = window.innerWidth; } " +
    "else if (document.documentElement && document.documentElement.clientWidth) { width = document.documentElement.clientWidth; } " +
    "else { var b = document.getElementsByTagName('body')[0]; if (b.clientWidth) { width = b.clientWidth;} }; " +
    "return [width, height];";

const JS_GET_CURRENT_SCROLL_POSITION =
    "var doc = document.documentElement; " +
    "var x = window.scrollX || ((window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)); " +
    "var y = window.scrollY || ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)); " +
    "return [x, y];";

// IMPORTANT: Notice there's a major difference between scrollWidth and scrollHeight.
// While scrollWidth is the maximum between an element's width and its content width,
// scrollHeight might be smaller (!) than the clientHeight, which is why we take the maximum between them.
const JS_GET_CONTENT_ENTIRE_SIZE =
    "var scrollWidth = document.documentElement.scrollWidth; " +
    "var bodyScrollWidth = document.body.scrollWidth; " +
    "var totalWidth = Math.max(scrollWidth, bodyScrollWidth); " +
    "var clientHeight = document.documentElement.clientHeight; " +
    "var bodyClientHeight = document.body.clientHeight; " +
    "var scrollHeight = document.documentElement.scrollHeight; " +
    "var bodyScrollHeight = document.body.scrollHeight; " +
    "var maxDocElementHeight = Math.max(clientHeight, scrollHeight); " +
    "var maxBodyHeight = Math.max(bodyClientHeight, bodyScrollHeight); " +
    "var totalHeight = Math.max(maxDocElementHeight, maxBodyHeight); " +
    "return [totalWidth, totalHeight];";

const JS_TRANSFORM_KEYS = ["transform", "-webkit-transform"];

// TODO: investigate usage in old sdk
// noinspection JSUnusedLocalSymbols
const JS_GET_IS_BODY_OVERFLOW_HIDDEN =
    "var styles = window.getComputedStyle(document.body, null);" +
    "var overflow = styles.getPropertyValue('overflow');" +
    "var overflowX = styles.getPropertyValue('overflow-x');" +
    "var overflowY = styles.getPropertyValue('overflow-y');" +
    "return overflow == 'hidden' || overflowX == 'hidden' || overflowY == 'hidden'";

/**
 * Handles browser related functionality.
 */
class EyesSeleniumUtils {

    /**
     * @param {IWebDriver} driver The driver for which to check if it represents a mobile device.
     * @return {Promise.<Boolean>} {@code true} if the platform running the test is a mobile platform. {@code false} otherwise.
     */
    static isMobileDevice(driver) {
        return driver.getCapabilities().then(capabilities => {
            return capabilities.get('automationName') === 'Appium';
        });
    }

    /**
     * @param {IWebDriver} driver The driver to test.
     * @return {Promise.<Boolean>} {@code true} if the driver is an Android driver. {@code false} otherwise.
     */
    static isAndroid(driver) {
        return driver.getCapabilities().then(capabilities => {
            return capabilities.get('platform') === 'ANDROID';
        });
    }

    /**
     * @param {IWebDriver} driver The driver to test.
     * @return {Promise.<Boolean>} {@code true} if the driver is an Android driver. {@code false} otherwise.
     */
    static isIOS(driver) {
        return driver.getCapabilities().then(capabilities => {
            return ['MAC', 'IOS'].includes(capabilities.get('platform'));
        });
    }

    /**
     * @param {IWebDriver} driver The driver to get the platform version from.
     * @return {Promise.<String>} The platform version or {@code null} if it is undefined.
     */
    static getPlatformVersion(driver) {
        return driver.getCapabilities().then(capabilities => {
            return capabilities.get('platformVersion');
        });
    }

    /**
     * @param {IWebDriver} driver The driver for which to check the orientation.
     * @return {Promise.<Boolean>} {@code true} if this is a mobile device and is in landscape orientation. {@code false} otherwise.
     */
    static isLandscapeOrientation(driver) {
        return driver.getCapabilities().then(capabilities => {
            const capsOrientation = capabilities.get('orientation') || capabilities.get('deviceOrientation');
            return capsOrientation === 'LANDSCAPE';
        });
    }

    /**
     * Sets the overflow of the current context's document element.
     *
     * @param {EyesJsExecutor|IWebDriver} executor The executor to use.
     * @param {String} value The overflow value to set.
     * @return {Promise.<String>} The previous value of overflow (could be {@code null} if undefined).
     */
    static setOverflow(executor, value) {
        let script;
        if (value) {
            script =
                "var origOverflow = document.documentElement.style.overflow; " +
                "document.documentElement.style.overflow = \"" + value + "\"; " +
                "return origOverflow";
        } else {
            script =
                "var origOverflow = document.documentElement.style.overflow; " +
                "document.documentElement.style.overflow = undefined; " +
                "return origOverflow";
        }

        return executor.executeScript(script).catch(err => {
            throw new Error('EyesDriverOperationException: failed to set overflow', err);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Updates the document's body "overflow" value
     *
     * @param {EyesJsExecutor|IWebDriver} executor The executor to use.
     * @param {String} overflowValue The values of the overflow to set.
     * @return {Promise.<String>} A promise which resolves to the original overflow of the document.
     */
    static setBodyOverflow(executor, overflowValue) {
        let script;
        if (overflowValue === null) {
            script =
                "var origOverflow = document.body.style.overflow; " +
                "document.body.style.overflow = undefined; " +
                "return origOverflow";
        } else {
            script =
                "var origOverflow = document.body.style.overflow; " +
                "document.body.style.overflow = \"" + overflowValue + "\"; " +
                "return origOverflow";
        }

        return executor.executeScript(script).catch(err => {
            throw new Error('EyesDriverOperationException: failed to set body overflow', err);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Hides the scrollbars of the current context's document element.
     *
     * @param {EyesJsExecutor|IWebDriver} executor The executor to use.
     * @param {int} stabilizationTimeout The amount of time to wait for the "hide scrollbars" action to take effect (Milliseconds). Zero/negative values are ignored.
     * @return {Promise.<String>} The previous value of the overflow property (could be {@code null}).
     */
    static hideScrollbars(executor, stabilizationTimeout) {
        return EyesSeleniumUtils.setOverflow(executor, "hidden").then(result => {
            if (stabilizationTimeout > 0) {
                return executor.sleep(stabilizationTimeout).then(() => result);
            }
            return result;
        });
    }

    /**
     * Gets the current scroll position.
     *
     * @param {EyesJsExecutor|IWebDriver} executor The executor to use.
     * @return {Promise.<Location>} The current scroll position of the current frame.
     */
    static getCurrentScrollPosition(executor) {
        return executor.executeScript(JS_GET_CURRENT_SCROLL_POSITION).then(result => {
            // If we can't find the current scroll position, we use 0 as default.
            return new Location(Math.ceil(result[0]) || 0, Math.ceil(result[1]) || 0);
        });
    }

    /**
     * Sets the scroll position of the current frame.
     *
     * @param {EyesJsExecutor|IWebDriver} executor The executor to use.
     * @param {Location} location Location to scroll to
     * @return {Promise} A promise which resolves after the action is performed and timeout passed.
     */
    static setCurrentScrollPosition(executor, location) {
        return executor.executeScript(`window.scrollTo(${location.getY()}, ${location.getY()})`);
    }

    /**
     * Get the entire page size.
     *
     * @param {EyesJsExecutor|IWebDriver} executor The executor to use.
     * @return {Promise.<{width: number, height: number}>} A promise which resolves to an object containing the width/height of the page.
     */
    static getCurrentFrameContentEntireSize(executor) {
        // IMPORTANT: Notice there's a major difference between scrollWidth and scrollHeight.
        // While scrollWidth is the maximum between an element's width and its content width,
        // scrollHeight might be smaller (!) than the clientHeight, which is why we take the maximum between them.
        return executor.executeScript(JS_GET_CONTENT_ENTIRE_SIZE).then(result => {
            return new RectangleSize(parseInt(result[0], 10) || 0, parseInt(result[1], 10) || 0);
        }).catch(ignored => {
            throw new Error("EyesDriverOperationError: failed to extract entire size!");
        });
    }

    /**
     * Tries to get the viewport size using Javascript. If fails, gets the entire browser window size!
     *
     * @param {EyesJsExecutor|IWebDriver} executor The executor to use.
     * @return {Promise.<RectangleSize>} The viewport size.
     */
    static getViewportSize(executor) {
        return executor.executeScript(JS_GET_VIEWPORT_SIZE).then(result => {
            return new RectangleSize(parseInt(result[0], 10) || 0, parseInt(result[1], 10) || 0);
        });
    }

    /**
     * @param {Logger} logger The logger to use.
     * @param {IWebDriver} driver The web driver to use.
     * @return {Promise.<RectangleSize>} The viewport size of the current context, or the display size if the viewport size cannot be retrieved.
     */
    static getViewportSizeOrDisplaySize(logger, driver) {
        logger.verbose("getViewportSizeOrDisplaySize()");

        return EyesSeleniumUtils.getViewportSize(driver).catch(err => {
            logger.verbose("Failed to extract viewport size using Javascript:", err);

            // If we failed to extract the viewport size using JS, will use the window size instead.
            logger.verbose("Using window size as viewport size.");
            return driver.manage().window().getSize().then(/** {width:number, height:number} */ result => {
                let width = result.width;
                let height = result.height;
                return EyesSeleniumUtils.isLandscapeOrientation(driver).then(result => {
                    if (result && height > width) {
                        const temp = width;
                        // noinspection JSSuspiciousNameCombination
                        width = height;
                        height = temp;
                    }
                }).catch(ignore => {
                    // Not every IWebDriver supports querying for orientation.
                }).then(() => {
                    logger.verbose(`Done! Size ${width} x ${height}`);
                    return new RectangleSize(width, height);
                });
            });
        });
    }

    /**
     * @param {Logger} logger The logger to use.
     * @param {IWebDriver} driver The web driver to use.
     * @param {RectangleSize} requiredSize The size to set
     * @return {Promise.<Boolean>}
     */
    static setBrowserSize(logger, driver, requiredSize) {
        // noinspection MagicNumberJS
        const SLEEP = 1000;
        const RETRIES = 3;

        return EyesSeleniumUtils._setBrowserSizeLoop(logger, driver, requiredSize, SLEEP, RETRIES);
    }

    static _setBrowserSizeLoop(logger, driver, requiredSize, sleep, retriesLeft) {
        logger.verbose(`Trying to set browser size to: ${requiredSize}`);

        return driver.manage().window().setSize(requiredSize.getWidth(), requiredSize.getHeight()).then(() => {
            return driver.sleep(sleep);
        }).then(() => {
            return driver.manage().window().getSize();
        }).then(/** {width:number, height:number} */ result => {
            const currentSize = new RectangleSize(result.width, result.height);
            logger.log(`Current browser size: ${currentSize}`);
            if (currentSize.equals(requiredSize)) {
                return true;
            }

            --retriesLeft;

            if (retriesLeft === 0) {
                logger.verbose("Failed to set browser size: retries is out.");
                return false;
            }

            return EyesSeleniumUtils._setBrowserSizeLoop(logger, driver, requiredSize, sleep, retriesLeft);
        });
    }

    /**
     * @param {Logger} logger The logger to use.
     * @param {IWebDriver} driver The web driver to use.
     * @param {RectangleSize} actualViewportSize
     * @param {RectangleSize} requiredViewportSize
     * @return {Promise.<Boolean>}
     */
    static setBrowserSizeByViewportSize(logger, driver, actualViewportSize, requiredViewportSize) {
        return driver.manage().window().getSize().then(/** {width:number, height:number} */ browserSize => {
            logger.verbose(`Current browser size: ${browserSize}`);
            const requiredBrowserSize = new RectangleSize(
                browserSize.width + (requiredViewportSize.getWidth() - actualViewportSize.getWidth()),
                browserSize.height + (requiredViewportSize.getHeight() - actualViewportSize.getHeight())
            );
            return EyesSeleniumUtils.setBrowserSize(logger, driver, requiredBrowserSize);
        });
    }

    /**
     * Tries to set the viewport size
     *
     * @param {Logger} logger The logger to use.
     * @param {IWebDriver} driver The web driver to use.
     * @param {RectangleSize} requiredSize The viewport size.
     * @return {Promise}
     */
    static setViewportSize(logger, driver, requiredSize) {
        try {
            ArgumentGuard.notNull(requiredSize, "requiredSize");
        } catch (err) {
            return driver.controlFlow().promise((resolve, reject) => reject(err));
        }

        // First we will set the window size to the required size.
        // Then we'll check the viewport size and increase the window size accordingly.
        logger.verbose(`setViewportSize(${requiredSize})`);
        return EyesSeleniumUtils.getViewportSize(driver).then(actualViewportSize => {
            logger.verbose(`Initial viewport size: ${actualViewportSize}`);

            // If the viewport size is already the required size
            if (actualViewportSize.equals(requiredSize)) {
                logger.verbose("Required size already set.");
                return;
            }

            // We move the window to (0,0) to have the best chance to be able to set the viewport size as requested.
            return driver.manage().window().setPosition(0, 0).catch(ignore => {
                logger.verbose("Warning: Failed to move the browser window to (0,0)");
            }).then(() => {
                return EyesSeleniumUtils.setBrowserSizeByViewportSize(logger, driver, actualViewportSize, requiredSize);
            }).then(() => {
                return EyesSeleniumUtils.getViewportSize(driver);
            }).then(actualViewportSize => {
                if (actualViewportSize.equals(requiredSize)) {
                    return;
                }

                // Additional attempt. This Solves the "maximized browser" bug
                // (border size for maximized browser sometimes different than non-maximized, so the original browser size calculation is  wrong).
                logger.verbose("Trying workaround for maximization...");
                return EyesSeleniumUtils.setBrowserSizeByViewportSize(logger, driver, actualViewportSize, requiredSize).then(() => {
                    return EyesSeleniumUtils.getViewportSize(driver);
                }).then(actualViewportSize => {
                    logger.verbose(`Current viewport size: ${actualViewportSize}`);
                    if (actualViewportSize.equals(requiredSize)) {
                        return;
                    }

                    const MAX_DIFF = 3;
                    const widthDiff = actualViewportSize.getWidth() - requiredSize.getWidth();
                    const widthStep = widthDiff > 0 ? -1 : 1; // -1 for smaller size, 1 for larger
                    const heightDiff = actualViewportSize.getHeight() - requiredSize.getHeight();
                    const heightStep = heightDiff > 0 ? -1 : 1;

                    return driver.manage().window().getSize().then(/** {width:number, height:number} */ result => {
                        const browserSize = new RectangleSize(result.width, result.height);

                        const currWidthChange = 0;
                        const currHeightChange = 0;
                        // We try the zoom workaround only if size difference is reasonable.
                        if (Math.abs(widthDiff) <= MAX_DIFF && Math.abs(heightDiff) <= MAX_DIFF) {
                            logger.verbose("Trying workaround for zoom...");
                            const retriesLeft = Math.abs((widthDiff === 0 ? 1 : widthDiff) * (heightDiff === 0 ? 1 : heightDiff)) * 2;

                            const lastRequiredBrowserSize = null;
                            return EyesSeleniumUtils._setViewportSizeLoop(logger, driver, requiredSize, actualViewportSize, browserSize,
                                widthDiff, widthStep, heightDiff, heightStep, currWidthChange, currHeightChange,
                                retriesLeft, lastRequiredBrowserSize);
                        }

                        throw new Error("EyesError: failed to set window size!");
                    });
                });
            });
        });
    }

    // noinspection OverlyComplexFunctionJS
    static _setViewportSizeLoop(logger, driver, requiredSize, actualViewportSize, browserSize, widthDiff, widthStep, heightDiff, heightStep, currWidthChange, currHeightChange, retriesLeft, lastRequiredBrowserSize) {
        logger.verbose(`Retries left: ${retriesLeft}`);
        // We specifically use "<=" (and not "<"), so to give an extra resize attempt in addition to reaching the diff, due to floating point issues.
        if (Math.abs(currWidthChange) <= Math.abs(widthDiff) && actualViewportSize.getWidth() !== requiredSize.getWidth()) {
            currWidthChange += widthStep;
        }

        if (Math.abs(currHeightChange) <= Math.abs(heightDiff) && actualViewportSize.getHeight() !== requiredSize.getHeight()) {
            currHeightChange += heightStep;
        }

        const requiredBrowserSize = new RectangleSize(browserSize.getWidth()+ currWidthChange, browserSize.getHeight() + currHeightChange);
        if (requiredBrowserSize.equals(lastRequiredBrowserSize)) {
            logger.verbose("Browser size is as required but viewport size does not match!");
            logger.verbose(`Browser size: ${requiredBrowserSize} , Viewport size: ${actualViewportSize}`);
            logger.verbose("Stopping viewport size attempts.");
            return driver.controlFlow().promise(resolve => resolve());
        }

        return EyesSeleniumUtils.setBrowserSize(logger, driver, requiredBrowserSize).then(() => {
            lastRequiredBrowserSize = requiredBrowserSize;
            return EyesSeleniumUtils.getViewportSize(driver);
        }).then(actualViewportSize => {
            logger.verbose(`Current viewport size: ${actualViewportSize}`);
            if (actualViewportSize.equals(requiredSize)) {
                return;
            }

            --retriesLeft;

            if ((Math.abs(currWidthChange) <= Math.abs(widthDiff) || Math.abs(currHeightChange) <= Math.abs(heightDiff)) && (retriesLeft > 0)) {
                return EyesSeleniumUtils._setViewportSizeLoop(logger, driver, requiredSize, actualViewportSize, browserSize,
                    widthDiff, widthStep, heightDiff, heightStep, currWidthChange, currHeightChange,
                    retriesLeft, lastRequiredBrowserSize);
            }

            throw new Error("EyesError: failed to set window size! Zoom workaround failed.");
        });
    }

    /**
     * Gets the device pixel ratio.
     *
     * @param {EyesJsExecutor|IWebDriver} executor The executor to use.
     * @return {Promise.<number>} A promise which resolves to the device pixel ratio (float type).
     */
    static getDevicePixelRatio(executor) {
        return executor.executeScript('return window.devicePixelRatio').then(result => {
            return parseFloat(result);
        });
    }

    /**
     * Get the current transform of page.
     *
     * @param {EyesJsExecutor|IWebDriver} executor The executor to use.
     * @return {Promise.<Object.<String, String>>} A promise which resolves to the current transform value.
     */
    static getCurrentTransform(executor) {
        let script = "return { ";
        for (let i = 0, l = JS_TRANSFORM_KEYS.length; i < l; i++) {
            script += `'${JS_TRANSFORM_KEYS[i]}': document.documentElement.style['${JS_TRANSFORM_KEYS[i]}'],`;
        }
        script += " }";
        return executor.executeScript(script);
    }

    /**
     * Sets transforms for document.documentElement according to the given map of style keys and values.
     *
     * @param {EyesJsExecutor|IWebDriver} executor The executor to use.
     * @param {Object.<String, String>} transforms The transforms to set. Keys are used as style keys and values are the values for those styles.
     * @return {Promise}
     */
    static setTransforms(executor, transforms) {
        let script = "";
        for (const key in transforms) {
            if (transforms.hasOwnProperty(key)) {
                script += `document.documentElement.style['${key}'] = '${transforms[key]}';`;
            }
        }
        return executor.executeScript(script);
    }

    /**
     * Set the given transform to document.documentElement for all style keys defined in {@link JS_TRANSFORM_KEYS}
     *
     * @param {EyesJsExecutor|IWebDriver} executor The executor to use.
     * @param {String} transform The transform to set.
     * @return {Promise} A promise which resolves to the previous transform once the updated transform is set.
     */
    static setTransform(executor, transform) {
        const transforms = {};
        if (!transform) {
            transform = '';
        }

        for (let i = 0, l = JS_TRANSFORM_KEYS.length; i < l; i++) {
            transforms[JS_TRANSFORM_KEYS[i]] = transform;
        }

        return EyesSeleniumUtils.setTransforms(executor, transforms);
    }

    /**
     * Translates the current documentElement to the given position.
     *
     * @param {EyesJsExecutor|IWebDriver} executor The executor to use.
     * @param {Location} position The position to translate to.
     * @return {Promise} A promise which resolves to the previous transform when the scroll is executed.
     */
    static translateTo(executor, position) {
        return EyesSeleniumUtils.setTransform(executor, `translate(-${position.getX()}px, -${position.getY()}px)`);
    }
}

module.exports = EyesSeleniumUtils;
