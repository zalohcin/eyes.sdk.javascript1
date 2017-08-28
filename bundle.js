(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("eyes.utils"), require("eyes.sdk"), require("q"), require("leanft.sdk.web"));
	else if(typeof define === 'function' && define.amd)
		define(["eyes.utils", "eyes.sdk", "q", "leanft.sdk.web"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("eyes.utils"), require("eyes.sdk"), require("q"), require("leanft.sdk.web")) : factory(root["eyes.utils"], root["eyes.sdk"], root["q"], root["leanft.sdk.web"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_14__, __WEBPACK_EXTERNAL_MODULE_15__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("eyes.utils");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("eyes.sdk");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
 ---

 name: EyesLeanFTUtils

 description: Handles browser related functionality.

 ---
 */

(function () {
    "use strict";

    var EyesSDK = __webpack_require__(1),
        EyesUtils = __webpack_require__(0);
    var MutableImage = EyesSDK.MutableImage,
        CoordinatesType = EyesSDK.CoordinatesType,
        GeneralUtils = EyesUtils.GeneralUtils,
        GeometryUtils = EyesUtils.GeometryUtils,
        ImageUtils = EyesUtils.ImageUtils;

    function EyesLeanFTUtils () {}

    /**
     * @private
     * @type {string}
     */
    var JS_GET_VIEWPORT_SIZE =
        "var height = undefined; " +
        "var width = undefined; " +
        "if (window.innerHeight) { height = window.innerHeight; } " +
        "else if (document.documentElement && document.documentElement.clientHeight) { height = document.documentElement.clientHeight; } " +
        "else { var b = document.getElementsByTagName('body')[0]; if (b.clientHeight) {height = b.clientHeight;} }; " +
        "if (window.innerWidth) { width = window.innerWidth; } " +
        "else if (document.documentElement && document.documentElement.clientWidth) { width = document.documentElement.clientWidth; } " +
        "else { var b = document.getElementsByTagName('body')[0]; if (b.clientWidth) { width = b.clientWidth;} }; " +
        "return [width, height];";

    /**
     * @private
     * @type {string}
     */
    var JS_GET_CURRENT_SCROLL_POSITION =
        "var doc = document.documentElement; " +
        "var x = window.scrollX || ((window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)); " +
        "var y = window.scrollY || ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)); " +
        "return [x, y];";

    /**
     * @private
     * @type {string}
     */
    var JS_GET_CONTENT_ENTIRE_SIZE =
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

    /**
     * @private
     * @type {string[]}
     */
    var JS_TRANSFORM_KEYS = ["transform", "-webkit-transform"];

    /**
     * Executes a script using the browser's executeScript function - and optionally waits a timeout.
     *
     * @param {EyesWebBrowser} browser The driver using which to execute the script.
     * @param {string} script The code to execute on the given driver.
     * @param {PromiseFactory} promiseFactory
     * @param {number|undefined} [stabilizationTimeMs] The amount of time to wait after script execution to
     *        let the browser a chance to stabilize (e.g., finish rendering).
     * @return {Promise<void>} A promise which resolves to the result of the script's execution on the tab.
     */
    EyesLeanFTUtils.executeScript = function executeScript(browser, script, promiseFactory, stabilizationTimeMs) {
        return promiseFactory.makePromise(function (resolve, reject) {
            try {
                browser.executeScript(script).then(function (result) {
                    if (stabilizationTimeMs) {
                        return GeneralUtils.sleep(stabilizationTimeMs, promiseFactory).then(function () {
                            resolve(result);
                        });
                    }
                    resolve(result);
                });
            } catch (e) {
                reject(e);
            }
        });
    };

    EyesLeanFTUtils.promiseArrayToArray = function (promiseArray, length, promiseFactory, resultArray) {
        var promise = promiseFactory.makePromise(function (resolve) {
            resolve();
        });

        if (!length && resultArray) {
            return promise.then(function () {
                return resultArray.reverse();
            });
        }

        return promise.then(function () {
            if (!resultArray) {
                resultArray = [];
            }

            length--;

            return promiseArray[length];
        }).then(function (value) {
            resultArray.push(value);
        }, function () {
            resultArray.push(undefined);
        }).then(function () {
            return EyesLeanFTUtils.promiseArrayToArray(promiseArray, length, promiseFactory, resultArray);
        });
    };

    EyesLeanFTUtils.promiseObjectToObject = function (promiseObject, keys, length, promiseFactory, resultObject) {
        var promise = promiseFactory.makePromise(function (resolve) {
            resolve();
        });

        if (!length && resultObject) {
            return promise.then(function () {
                return resultObject;
            });
        }

        return promise.then(function () {
            if (!resultObject) {
                resultObject = {};
            }

            length--;

            return promiseObject[keys[length]];
        }).then(function (value) {
            resultObject[keys[length]] = value;
        }, function () {
            resultObject[keys[length]] = undefined;
        }).then(function () {
            return EyesLeanFTUtils.promiseObjectToObject(promiseObject, keys, length, promiseFactory, resultObject);
        });
    };

    /**
     * Gets the device pixel ratio.
     *
     * @param {Web.Browser} browser The driver which will execute the script to get the ratio.
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<number>} A promise which resolves to the device pixel ratio (float type).
     */
    EyesLeanFTUtils.getDevicePixelRatio = function getDevicePixelRatio(browser, promiseFactory) {
        return EyesLeanFTUtils.executeScript(browser, 'return window.devicePixelRatio;', promiseFactory, undefined).then(function (results) {
            return parseFloat(results);
        }, function (err) {
            console.error(err);
        });
    };

    /**
     * Get the current transform of page.
     *
     * @param {Web.Browser} browser The driver which will execute the script to get the scroll position.
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<object.<string, string>>} A promise which resolves to the current transform value.
     */
    EyesLeanFTUtils.getCurrentTransform = function getCurrentTransform(browser, promiseFactory) {
        var script = "return { ";
        for (var i = 0, l = JS_TRANSFORM_KEYS.length; i < l; i++) {
            script += "'" + JS_TRANSFORM_KEYS[i] + "': document.documentElement.style['" + JS_TRANSFORM_KEYS[i] + "'],";
        }
        script += " }";

        return EyesLeanFTUtils.executeScript(browser, script, promiseFactory, undefined).then(function (results) {
            return EyesLeanFTUtils.promiseObjectToObject(results, JS_TRANSFORM_KEYS, JS_TRANSFORM_KEYS.length, promiseFactory);
        });
    };

    /**
     * Sets transforms for document.documentElement according to the given map of style keys and values.
     *
     * @param {Web.Browser} browser The browser to use.
     * @param {object.<string, string>} transforms The transforms to set. Keys are used as style keys and values are the values for those styles.
     * @param {PromiseFactory} promiseFactory
     * @returns {Promise<void>}
     */
    EyesLeanFTUtils.setTransforms = function (browser, transforms, promiseFactory) {
        var script = "";
        for (var key in transforms) {
            if (transforms.hasOwnProperty(key)) {
                script += "document.documentElement.style['" + key + "'] = '" + transforms[key] + "';";
            }
        }

        return EyesLeanFTUtils.executeScript(browser, script, promiseFactory, 250);
    };

    /**
     * Set the given transform to document.documentElement for all style keys defined in {@link JS_TRANSFORM_KEYS}
     *
     * @param {Web.Browser} browser The driver which will execute the script to set the transform.
     * @param {string} transformToSet The transform to set.
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<void>} A promise which resolves to the previous transform once the updated transform is set.
     */
    EyesLeanFTUtils.setTransform = function setTransform(browser, transformToSet, promiseFactory) {
        var transforms = {};
        if (!transformToSet) {
            transformToSet = '';
        }

        for (var i = 0, l = JS_TRANSFORM_KEYS.length; i < l; i++) {
            transforms[JS_TRANSFORM_KEYS[i]] = transformToSet;
        }

        return EyesLeanFTUtils.setTransforms(browser, transforms, promiseFactory);
    };

    /**
     * CSS translate the document to a given location.
     *
     * @param {Web.Browser} browser The driver which will execute the script to set the transform.
     * @param {{x: number, y: number}} point
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<void>} A promise which resolves to the previous transform when the scroll is executed.
     */
    EyesLeanFTUtils.translateTo = function translateTo(browser, point, promiseFactory) {
        return EyesLeanFTUtils.setTransform(browser, 'translate(-' + point.x + 'px, -' + point.y + 'px)', promiseFactory);
    };

    /**
     * Scroll to the specified position.
     *
     * @param {Web.Browser} browser - The driver which will execute the script to set the scroll position.
     * @param {{x: number, y: number}} point Point to scroll to
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<void>} A promise which resolves after the action is performed and timeout passed.
     */
    EyesLeanFTUtils.scrollTo = function scrollTo(browser, point, promiseFactory) {
        return EyesLeanFTUtils.executeScript(browser,
            'window.scrollTo(' + parseInt(point.x, 10) + ', ' + parseInt(point.y, 10) + ');',
            promiseFactory, 250);
    };

    /**
     * Gets the current scroll position.
     *
     * @param {Web.Browser} browser The driver which will execute the script to get the scroll position.
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<{x: number, y: number}>} A promise which resolves to the current scroll position.
     */
    EyesLeanFTUtils.getCurrentScrollPosition = function getCurrentScrollPosition(browser, promiseFactory) {
        return EyesLeanFTUtils.executeScript(browser, JS_GET_CURRENT_SCROLL_POSITION, promiseFactory, undefined).then(function (results) {
            return EyesLeanFTUtils.promiseArrayToArray(results, 2, promiseFactory);
        }).then(function (results) {
            // If we can't find the current scroll position, we use 0 as default.
            var x = parseInt(results[0], 10) || 0;
            var y = parseInt(results[1], 10) || 0;
            return {x: x, y: y};
        });
    };

    /**
     * Get the entire page size.
     *
     * @param {Web.Browser} browser The driver used to query the web page.
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<{width: number, height: number}>} A promise which resolves to an object containing the width/height of the page.
     */
    EyesLeanFTUtils.getEntirePageSize = function getEntirePageSize(browser, promiseFactory) {
        // IMPORTANT: Notice there's a major difference between scrollWidth
        // and scrollHeight. While scrollWidth is the maximum between an
        // element's width and its content width, scrollHeight might be
        // smaller (!) than the clientHeight, which is why we take the
        // maximum between them.
        return EyesLeanFTUtils.executeScript(browser, JS_GET_CONTENT_ENTIRE_SIZE, promiseFactory).then(function (results) {
            return EyesLeanFTUtils.promiseArrayToArray(results, 2, promiseFactory);
        }).then(function (results) {
            var totalWidth = results[0] || 0;
            var totalHeight = results[1] || 0;
            return {width: totalWidth, height: totalHeight};
        });
    };

    /**
     * Updates the document's documentElement "overflow" value (mainly used to remove/allow scrollbars).
     *
     * @param {Web.Browser} browser The driver used to update the web page.
     * @param {string} overflowValue The values of the overflow to set.
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<string>} A promise which resolves to the original overflow of the document.
     */
    EyesLeanFTUtils.setOverflow = function setOverflow(browser, overflowValue, promiseFactory) {
        var script;
        if (overflowValue === null) {
            script =
                "var origOverflow = document.documentElement.style.overflow; " +
                "document.documentElement.style.overflow = undefined; " +
                "return origOverflow";
        } else {
            script =
                "var origOverflow = document.documentElement.style.overflow; " +
                "document.documentElement.style.overflow = \"" + overflowValue + "\"; " +
                "return origOverflow";
        }

        return EyesLeanFTUtils.executeScript(browser, script, promiseFactory, 100);
    };

    /**
     * Hides the scrollbars of the current context's document element.
     *
     * @param {Web.Browser} browser The browser to use for hiding the scrollbars.
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<string>} The previous value of the overflow property (could be {@code null}).
     */
    EyesLeanFTUtils.hideScrollbars = function (browser, promiseFactory) {
        return EyesLeanFTUtils.setOverflow(browser, "hidden", promiseFactory);
    };

    /**
     * Tries to get the viewport size using Javascript. If fails, gets the entire browser window size!
     *
     * @param {Web.Browser} browser The browser to use.
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<{width: number, height: number}>} The viewport size.
     */
    EyesLeanFTUtils.getViewportSize = function (browser, promiseFactory) {
        return promiseFactory.makePromise(function (resolve, reject) {
            return EyesLeanFTUtils.executeScript(browser, JS_GET_VIEWPORT_SIZE, promiseFactory, undefined).then(function (results) {
                return EyesLeanFTUtils.promiseArrayToArray(results, 2, promiseFactory);
            }).then(function (results) {
                if (isNaN(results[0]) || isNaN(results[1])) {
                    reject("Can't parse values.");
                } else {
                    resolve({
                        width: results[0] || 0,
                        height: results[1] || 0
                    });
                }
            }, function (err) {
                reject(err);
            });
        });
    };

    /**
     * @param {Logger} logger
     * @param {Web.Browser} browser The browser to use.
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<{width: number, height: number}>} The viewport size of the current context, or the display size if the viewport size cannot be retrieved.
     */
    EyesLeanFTUtils.getViewportSizeOrDisplaySize = function (logger, browser, promiseFactory) {
        logger.verbose("getViewportSizeOrDisplaySize()");

        return EyesLeanFTUtils.getViewportSize(browser, promiseFactory).then(function (results) {
            return results;
        }, function (err) {
            logger.verbose("Failed to extract viewport size using Javascript:", err);

            // If we failed to extract the viewport size using JS, will use the window size instead.
            logger.verbose("Using window size as viewport size.");
            return browser.size().then(function (size) {
                logger.verbose("Done! Size is", size);
                return size;
            });
        });
    };

    /**
     * @param {Logger} logger
     * @param {Web.Browser} browser The browser to use.
     * @param {{width: number, height: number}} requiredSize
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<boolean>}
     */
    EyesLeanFTUtils.setBrowserSize = function (logger, browser, requiredSize, promiseFactory) {
        return _setBrowserSize(logger, browser, requiredSize, 3, promiseFactory).then(function () {
            return true;
        }, function () {
            return false;
        });
    };

    function _setBrowserSize(logger, browser, requiredSize, retries, promiseFactory) {
        return promiseFactory.makePromise(function (resolve, reject) {
            logger.verbose("Trying to set browser size to:", requiredSize);

            return browser.resizeTo(requiredSize.width, requiredSize.height).then(function () {
                return GeneralUtils.sleep(1000, promiseFactory);
            }).then(function () {
                return browser.size();
            }).then(function (currentSize) {
                logger.log("Current browser size:", currentSize);
                if (currentSize.width === requiredSize.width && currentSize.height === requiredSize.height) {
                    resolve();
                    return;
                }

                if (retries === 0) {
                    reject("Failed to set browser size: retries is out.");
                    return;
                }

                _setBrowserSize(logger, browser, requiredSize, retries - 1, promiseFactory).then(function () {
                    resolve();
                }, function (err) {
                    reject(err);
                });
            });
        });
    }

    /**
     * @param {Logger} logger
     * @param {Web.Browser} browser The browser to use.
     * @param {{width: number, height: number}} actualViewportSize
     * @param {{width: number, height: number}} requiredViewportSize
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<boolean>}
     */
    EyesLeanFTUtils.setBrowserSizeByViewportSize = function (logger, browser, actualViewportSize, requiredViewportSize, promiseFactory) {
        return browser.size().then(function (browserSize) {
            logger.verbose("Current browser size:", browserSize);
            var requiredBrowserSize = {
                width: browserSize.width + (requiredViewportSize.width - actualViewportSize.width),
                height: browserSize.height + (requiredViewportSize.height - actualViewportSize.height)
            };
            return EyesLeanFTUtils.setBrowserSize(logger, browser, requiredBrowserSize, promiseFactory);
        });
    };

    /**
     * Tries to set the viewport
     *
     * @param {Logger} logger
     * @param {Web.Browser} browser The browser to use.
     * @param {{width: number, height: number}} requiredSize The viewport size.
     * @param {PromiseFactory} promiseFactory
     * @returns {Promise<void>}
     */
    EyesLeanFTUtils.setViewportSize = function (logger, browser, requiredSize, promiseFactory) {
        // First we will set the window size to the required size.
        // Then we'll check the viewport size and increase the window size accordingly.
        logger.verbose("setViewportSize(", requiredSize, ")");
        return promiseFactory.makePromise(function (resolve, reject) {
            try {
                var actualViewportSize;
                EyesLeanFTUtils.getViewportSize(browser, promiseFactory).then(function (viewportSize) {
                    actualViewportSize = viewportSize;
                    logger.verbose("Initial viewport size:", actualViewportSize);

                    // If the viewport size is already the required size
                    if (actualViewportSize.width === requiredSize.width && actualViewportSize.height === requiredSize.height) {
                        resolve();
                        return;
                    }

                    // We move the window to (0,0) to have the best chance to be able to
                    // set the viewport size as requested.
                    EyesLeanFTUtils.scrollTo(browser, {x: 0, y: 0}, promiseFactory).catch(function () {
                        logger.verbose("Warning: Failed to move the browser window to (0,0)");
                    }).then(function () {
                        return EyesLeanFTUtils.setBrowserSizeByViewportSize(logger, browser, actualViewportSize, requiredSize, promiseFactory);
                    }).then(function () {
                        return EyesLeanFTUtils.getViewportSize(browser, promiseFactory);
                    }).then(function (actualViewportSize) {
                        if (actualViewportSize.width === requiredSize.width && actualViewportSize.height === requiredSize.height) {
                            resolve();
                            return;
                        }

                        // Additional attempt. This Solves the "maximized browser" bug
                        // (border size for maximized browser sometimes different than non-maximized, so the original browser size calculation is wrong).
                        logger.verbose("Trying workaround for maximization...");
                        return EyesLeanFTUtils.setBrowserSizeByViewportSize(logger, browser, actualViewportSize, requiredSize, promiseFactory).then(function () {
                            return EyesLeanFTUtils.getViewportSize(browser, promiseFactory);
                        }).then(function (viewportSize) {
                            actualViewportSize = viewportSize;
                            logger.verbose("Current viewport size:", actualViewportSize);

                            if (actualViewportSize.width === requiredSize.width && actualViewportSize.height === requiredSize.height) {
                                resolve();
                                return;
                            }

                            return browser.size().then(function (browserSize) {
                                var MAX_DIFF = 3;
                                var widthDiff = actualViewportSize.width - requiredSize.width;
                                var widthStep = widthDiff > 0 ? -1 : 1; // -1 for smaller size, 1 for larger
                                var heightDiff = actualViewportSize.height - requiredSize.height;
                                var heightStep = heightDiff > 0 ? -1 : 1;

                                var currWidthChange = 0;
                                var currHeightChange = 0;
                                // We try the zoom workaround only if size difference is reasonable.
                                if (Math.abs(widthDiff) <= MAX_DIFF && Math.abs(heightDiff) <= MAX_DIFF) {
                                    logger.verbose("Trying workaround for zoom...");
                                    var retriesLeft = Math.abs((widthDiff === 0 ? 1 : widthDiff) * (heightDiff === 0 ? 1 : heightDiff)) * 2;
                                    var lastRequiredBrowserSize = null;
                                    return _setWindowSize(logger, browser, requiredSize, actualViewportSize, browserSize,
                                        widthDiff, widthStep, heightDiff, heightStep, currWidthChange, currHeightChange,
                                        retriesLeft, lastRequiredBrowserSize, promiseFactory).then(function () {
                                        resolve();
                                    }, function () {
                                        reject("Failed to set viewport size: zoom workaround failed.");
                                    });
                                }

                                reject("Failed to set viewport size!");
                            });
                        });
                    });
                }).catch(function (err) {
                    reject(err);
                });
            } catch (err) {
                reject(new Error(err));
            }
        });
    };

    /**
     * @private
     * @param {Logger} logger
     * @param {Web.Browser} browser
     * @param {{width: number, height: number}} requiredSize
     * @param actualViewportSize
     * @param browserSize
     * @param widthDiff
     * @param widthStep
     * @param heightDiff
     * @param heightStep
     * @param currWidthChange
     * @param currHeightChange
     * @param retriesLeft
     * @param lastRequiredBrowserSize
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<void>}
     */
    function _setWindowSize(logger,
                            browser,
                            requiredSize,
                            actualViewportSize,
                            browserSize,
                            widthDiff,
                            widthStep,
                            heightDiff,
                            heightStep,
                            currWidthChange,
                            currHeightChange,
                            retriesLeft,
                            lastRequiredBrowserSize,
                            promiseFactory) {
        return promiseFactory.makePromise(function (resolve, reject) {
            logger.verbose("Retries left: " + retriesLeft);
            // We specifically use "<=" (and not "<"), so to give an extra resize attempt
            // in addition to reaching the diff, due to floating point issues.
            if (Math.abs(currWidthChange) <= Math.abs(widthDiff) && actualViewportSize.width !== requiredSize.width) {
                currWidthChange += widthStep;
            }

            if (Math.abs(currHeightChange) <= Math.abs(heightDiff) && actualViewportSize.height !== requiredSize.height) {
                currHeightChange += heightStep;
            }

            var requiredBrowserSize = {
                width: browserSize.width + currWidthChange,
                height: browserSize.height + currHeightChange
            };

            if (lastRequiredBrowserSize && requiredBrowserSize.width === lastRequiredBrowserSize.width && requiredBrowserSize.height === lastRequiredBrowserSize.height) {
                logger.verbose("Browser size is as required but viewport size does not match!");
                logger.verbose("Browser size: " + requiredBrowserSize + " , Viewport size: " + actualViewportSize);
                logger.verbose("Stopping viewport size attempts.");
                resolve();
                return;
            }

            return EyesLeanFTUtils.setBrowserSize(logger, browser, requiredBrowserSize, promiseFactory).then(function () {
                lastRequiredBrowserSize = requiredBrowserSize;
                return EyesLeanFTUtils.getViewportSize(browser, promiseFactory);
            }).then(function (actualViewportSize) {
                logger.verbose("Current viewport size:", actualViewportSize);
                if (actualViewportSize.width === requiredSize.width && actualViewportSize.height === requiredSize.height) {
                    resolve();
                    return;
                }

                if ((Math.abs(currWidthChange) <= Math.abs(widthDiff) || Math.abs(currHeightChange) <= Math.abs(heightDiff)) && (--retriesLeft > 0)) {
                    return _setWindowSize(logger, browser, requiredSize, actualViewportSize, browserSize,
                        widthDiff, widthStep, heightDiff, heightStep, currWidthChange, currHeightChange,
                        retriesLeft, lastRequiredBrowserSize, promiseFactory).then(function () {
                        resolve();
                    }, function (err) {
                        reject(err);
                    });
                }

                reject("Failed to set window size!");
            });
        });
    }

    /**
     * @private
     * @param {{left: number, top: number, width: number, height: number}} part
     * @param {Array<{position: {x: number, y: number}, size: {width: number, height: number}, image: Buffer}>} parts
     * @param {{imageBuffer: Buffer, width: number, height: number}} imageObj
     * @param {Web.Browser} browser
     * @param {Promise<void>} promise
     * @param {PromiseFactory} promiseFactory
     * @param {{width: number, height: number}} viewportSize
     * @param {PositionProvider} positionProvider
     * @param {ScaleProviderFactory} scaleProviderFactory
     * @param {CutProvider} cutProvider
     * @param {{width: number, height: number}} entirePageSize
     * @param {number} pixelRatio
     * @param {number} rotationDegrees
     * @param {boolean} automaticRotation
     * @param {number} automaticRotationDegrees
     * @param {boolean} isLandscape
     * @param {int} waitBeforeScreenshots
     * @param {{left: number, top: number, width: number, height: number}} regionInScreenshot
     * @param {boolean} [saveDebugScreenshots=false]
     * @param {string} [debugScreenshotsPath=null]
     * @return {Promise<void>}
     */
    var _processPart = function (part,
                                 parts,
                                 imageObj,
                                 browser,
                                 promise,
                                 promiseFactory,
                                 viewportSize,
                                 positionProvider,
                                 scaleProviderFactory,
                                 cutProvider,
                                 entirePageSize,
                                 pixelRatio,
                                 rotationDegrees,
                                 automaticRotation,
                                 automaticRotationDegrees,
                                 isLandscape,
                                 waitBeforeScreenshots,
                                 regionInScreenshot,
                                 saveDebugScreenshots,
                                 debugScreenshotsPath) {
        return promise.then(function () {
            return promiseFactory.makePromise(function (resolve) {
                // Skip 0,0 as we already got the screenshot
                if (part.left === 0 && part.top === 0) {
                    parts.push({
                        image: imageObj.imageBuffer,
                        size: {width: imageObj.width, height: imageObj.height},
                        position: {x: 0, y: 0}
                    });

                    resolve();
                    return;
                }

                var partPosition = {x: part.left, y: part.top};
                return positionProvider.setPosition(partPosition).then(function () {
                    return positionProvider.getCurrentPosition();
                }).then(function (currentPosition) {
                    return _captureViewport(browser, promiseFactory, viewportSize, scaleProviderFactory, cutProvider, entirePageSize,
                        pixelRatio, rotationDegrees, automaticRotation, automaticRotationDegrees, isLandscape,
                        waitBeforeScreenshots, regionInScreenshot, saveDebugScreenshots, debugScreenshotsPath).then(function (partImage) {
                        return partImage.asObject();
                    }).then(function (partObj) {
                        parts.push({
                            image: partObj.imageBuffer,
                            size: {width: partObj.width, height: partObj.height},
                            position: {x: currentPosition.x, y: currentPosition.y}
                        });

                        resolve();
                    });
                });
            });
        });
    };

    function formatDate(date) {
        if (date === null || date === undefined) {
            date = new Date();
        }

        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;
        if (year < 10) year = '0' + year;
        if (hour < 10) hour = '0' + hour;
        if (minute < 10) minute = '0' + minute;
        if (second < 10) second = '0' + second;

        return '' + year + '_' + month + '_' + day + '-' + hour + '_' + minute + '_' + second;
    }

    /**
     * @private
     * @param {EyesWebBrowser|EyesStdWinWindow} browser
     * @param {PromiseFactory} promiseFactory
     * @param {{width: number, height: number}} viewportSize
     * @param {ScaleProviderFactory} scaleProviderFactory
     * @param {CutProvider} cutProvider
     * @param {{width: number, height: number}} entirePageSize
     * @param {number} pixelRatio
     * @param {number} rotationDegrees
     * @param {boolean} automaticRotation
     * @param {number} automaticRotationDegrees
     * @param {boolean} isLandscape
     * @param {int} waitBeforeScreenshots
     * @param {{left: number, top: number, width: number, height: number}} [regionInScreenshot]
     * @param {boolean} [saveDebugScreenshots=false]
     * @param {string} [debugScreenshotsPath=null]
     * @return {Promise<MutableImage>}
     */
    var _captureViewport = function (browser,
                                     promiseFactory,
                                     viewportSize,
                                     scaleProviderFactory,
                                     cutProvider,
                                     entirePageSize,
                                     pixelRatio,
                                     rotationDegrees,
                                     automaticRotation,
                                     automaticRotationDegrees,
                                     isLandscape,
                                     waitBeforeScreenshots,
                                     regionInScreenshot,
                                     saveDebugScreenshots,
                                     debugScreenshotsPath) {
        var mutableImage, scaleRatio = 1;
        return GeneralUtils.sleep(waitBeforeScreenshots, promiseFactory).then(function () {
            return browser.takeScreenshot().then(function (screenshot64) {
                return new MutableImage(new Buffer(screenshot64, 'base64'), promiseFactory);
            }).then(function (image) {
                mutableImage = image;
                if (saveDebugScreenshots) {
                    var filename = "screenshot " + formatDate() + " original.png";
                    return mutableImage.saveImage(debugScreenshotsPath + filename.replace(/ /g, '_'));
                }
            }).then(function () {
                if (cutProvider) {
                    return cutProvider.cut(mutableImage, promiseFactory).then(function (image) {
                        mutableImage = image;
                    });
                }
            }).then(function () {
                return mutableImage.getSize();
            }).then(function (imageSize) {
                if (isLandscape && automaticRotation && imageSize.height > imageSize.width) {
                    rotationDegrees = automaticRotationDegrees;
                }

                if (scaleProviderFactory) {
                    var scaleProvider = scaleProviderFactory.getScaleProvider(imageSize.width);
                    scaleRatio = scaleProvider.getScaleRatio();
                }

                if (regionInScreenshot) {
                    var scaledRegion = GeometryUtils.scaleRegion(regionInScreenshot, 1 / scaleRatio);
                    return mutableImage.cropImage(scaledRegion);
                }
            }).then(function () {
                if (saveDebugScreenshots) {
                    var filename = "screenshot " + formatDate() + " cropped.png";
                    return mutableImage.saveImage(debugScreenshotsPath + filename.replace(/ /g, '_'));
                }
            }).then(function () {
                if (scaleRatio !== 1) {
                    return mutableImage.scaleImage(scaleRatio);
                }
            }).then(function () {
                if (saveDebugScreenshots) {
                    var filename = "screenshot " + formatDate() + " scaled.png";
                    return mutableImage.saveImage(debugScreenshotsPath + filename.replace(/ /g, '_'));
                }
            }).then(function () {
                if (rotationDegrees !== 0) {
                    return mutableImage.rotateImage(rotationDegrees);
                }
            }).then(function () {
                return mutableImage.getSize();
            }).then(function (imageSize) {
                // If the image is a viewport screenshot, we want to save the current scroll position (we'll need it for check region).
                if (imageSize.width <= viewportSize.width && imageSize.height <= viewportSize.height) {
                    return EyesLeanFTUtils.getCurrentScrollPosition(browser, promiseFactory).then(function (scrollPosition) {
                        return mutableImage.setCoordinates(scrollPosition);
                    }, function () {
                        // Failed to get Scroll position, setting coordinates to default.
                        return mutableImage.setCoordinates({x: 0, y: 0});
                    });
                }
            }).then(function () {
                return mutableImage;
            });
        });
    };

    /**
     * Capture screenshot from given driver
     *
     * @param {Web.Browser} browser
     * @param {PromiseFactory} promiseFactory
     * @param {{width: number, height: number}} viewportSize
     * @param {PositionProvider} positionProvider
     * @param {ScaleProviderFactory} scaleProviderFactory
     * @param {CutProvider} cutProvider
     * @param {boolean} fullPage
     * @param {boolean} hideScrollbars
     * @param {boolean} useCssTransition
     * @param {number} rotationDegrees
     * @param {boolean} automaticRotation
     * @param {number} automaticRotationDegrees
     * @param {boolean} isLandscape
     * @param {int} waitBeforeScreenshots
     * @param {boolean} checkFrameOrElement
     * @param {RegionProvider} [regionProvider]
     * @param {boolean} [saveDebugScreenshots=false]
     * @param {string} [debugScreenshotsPath=null]
     * @returns {Promise<MutableImage>}
     */
    EyesLeanFTUtils.getScreenshot = function getScreenshot(browser,
                                                           promiseFactory,
                                                           viewportSize,
                                                           positionProvider,
                                                           scaleProviderFactory,
                                                           cutProvider,
                                                           fullPage,
                                                           hideScrollbars,
                                                           useCssTransition,
                                                           rotationDegrees,
                                                           automaticRotation,
                                                           automaticRotationDegrees,
                                                           isLandscape,
                                                           waitBeforeScreenshots,
                                                           checkFrameOrElement,
                                                           regionProvider,
                                                           saveDebugScreenshots,
                                                           debugScreenshotsPath) {
        var MIN_SCREENSHOT_PART_HEIGHT = 10,
            MAX_SCROLLBAR_SIZE = 50;
        var originalPosition,
            originalOverflow,
            entirePageSize,
            regionInScreenshot,
            pixelRatio,
            imageObject,
            screenshot;

        hideScrollbars = hideScrollbars === null ? useCssTransition : hideScrollbars;

        // step #1 - get entire page size for future use (scaling and stitching)
        return positionProvider.getEntireSize().then(function (pageSize) {
            entirePageSize = pageSize;
        }, function () {
            // Couldn't get entire page size, using viewport size as default.
            entirePageSize = viewportSize;
        }).then(function () {
            // step #2 - get the device pixel ratio (scaling)
            return EyesLeanFTUtils.getDevicePixelRatio(browser, promiseFactory).then(function (ratio) {
                pixelRatio = ratio;
            }, function () {
                // Couldn't get pixel ratio, using 1 as default.
                pixelRatio = 1;
            });
        }).then(function () {
            // step #3 - hide the scrollbars if instructed
            if (hideScrollbars) {
                return EyesLeanFTUtils.setOverflow(browser, "hidden", promiseFactory).then(function (originalVal) {
                    originalOverflow = originalVal;
                });
            }
        }).then(function () {
            // step #4 - if this is a full page screenshot we need to scroll to position 0,0 before taking the first
            if (fullPage) {
                return positionProvider.getState().then(function (state) {
                    originalPosition = state;
                    return positionProvider.setPosition({x: 0, y: 0});
                }).then(function () {
                    return positionProvider.getCurrentPosition();
                }).then(function (location) {
                    if (location.x !== 0 || location.y !== 0) {
                        throw new Error("Could not scroll to the x/y corner of the screen");
                    }
                });
            }
        }).then(function () {
            if (regionProvider) {
                return _captureViewport(browser, promiseFactory, viewportSize, scaleProviderFactory, cutProvider, entirePageSize, pixelRatio,
                    rotationDegrees, automaticRotation, automaticRotationDegrees, isLandscape, waitBeforeScreenshots).then(function (image) {
                    return regionProvider.getRegionInLocation(image, CoordinatesType.SCREENSHOT_AS_IS, promiseFactory);
                }).then(function (region) {
                    regionInScreenshot = region;
                });
            }
        }).then(function () {
            // step #5 - Take screenshot of the 0,0 tile / current viewport
            return _captureViewport(browser, promiseFactory, viewportSize, scaleProviderFactory, cutProvider, entirePageSize, pixelRatio, rotationDegrees,
                automaticRotation, automaticRotationDegrees, isLandscape, waitBeforeScreenshots,
                checkFrameOrElement ? regionInScreenshot : null, saveDebugScreenshots, debugScreenshotsPath)
                .then(function (image) {
                    screenshot = image;
                    return screenshot.asObject();
                }).then(function (imageObj) {
                    imageObject = imageObj;
                });
        }).then(function () {
            return promiseFactory.makePromise(function (resolve) {
                if (!fullPage && !checkFrameOrElement) {
                    resolve();
                    return;
                }
                // IMPORTANT This is required! Since when calculating the screenshot parts for full size,
                // we use a screenshot size which is a bit smaller (see comment below).
                if (imageObject.width >= entirePageSize.width && imageObject.height >= entirePageSize.height) {
                    resolve();
                    return;
                }

                // We use a smaller size than the actual screenshot size in order to eliminate duplication
                // of bottom scroll bars, as well as footer-like elements with fixed position.
                var screenshotPartSize = {
                    width: imageObject.width,
                    height: Math.max(imageObject.height - MAX_SCROLLBAR_SIZE, MIN_SCREENSHOT_PART_HEIGHT)
                };

                var screenshotParts = GeometryUtils.getSubRegions({
                    left: 0, top: 0, width: entirePageSize.width,
                    height: entirePageSize.height
                }, screenshotPartSize, false);

                var parts = [];
                var promise = promiseFactory.makePromise(function (resolve) {
                    resolve();
                });

                screenshotParts.forEach(function (part) {
                    promise = _processPart(part, parts, imageObject, browser, promise, promiseFactory,
                        viewportSize, positionProvider, scaleProviderFactory, cutProvider, entirePageSize, pixelRatio, rotationDegrees, automaticRotation,
                        automaticRotationDegrees, isLandscape, waitBeforeScreenshots, checkFrameOrElement ? regionInScreenshot : null, saveDebugScreenshots, debugScreenshotsPath);
                });
                promise.then(function () {
                    return ImageUtils.stitchImage(entirePageSize, parts, promiseFactory).then(function (stitchedBuffer) {
                        screenshot = new MutableImage(stitchedBuffer, promiseFactory);
                        resolve();
                    });
                });
            });
        }).then(function () {
            if (hideScrollbars) {
                return EyesLeanFTUtils.setOverflow(browser, originalOverflow, promiseFactory);
            }
        }).then(function () {
            if (fullPage) {
                return positionProvider.restoreState(originalPosition);
            }
        }).then(function () {
            if (!checkFrameOrElement && regionInScreenshot) {
                return screenshot.cropImage(regionInScreenshot);
            }
        }).then(function () {
            return screenshot;
        });
    };

    module.exports = {
        EyesLeanFTUtils: EyesLeanFTUtils
    };
}());


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
    'use strict';

    var EyesUtils = __webpack_require__(0);
    var EyesSDK = __webpack_require__(1);
    var EyesLeanFTUtils = __webpack_require__(2).EyesLeanFTUtils;
    var PositionProvider = EyesSDK.PositionProvider,
        ArgumentGuard = EyesUtils.ArgumentGuard;

    /**
     * @constructor
     * @param {Logger} logger A Logger instance.
     * @param {EyesWebBrowser} executor
     * @param {PromiseFactory} promiseFactory
     * @augments PositionProvider
     */
    function ScrollPositionProvider(logger, executor, promiseFactory) {
        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(executor, "executor");

        this._logger = logger;
        this._driver = executor;
        this._promiseFactory = promiseFactory;
    }

    ScrollPositionProvider.prototype = new PositionProvider();
    ScrollPositionProvider.prototype.constructor = ScrollPositionProvider;

    /**
     * @returns {Promise<{x: number, y: number}>} The scroll position of the current frame.
     */
    ScrollPositionProvider.prototype.getCurrentPosition = function () {
        var that = this;
        that._logger.verbose("getCurrentScrollPosition()");
        return EyesLeanFTUtils.getCurrentScrollPosition(this._driver, this._promiseFactory).then(function (result) {
            that._logger.verbose("Current position: ", result);
            return result;
        });
    };

    /**
     * Go to the specified location.
     * @param {{x: number, y: number}} location The position to scroll to.
     * @returns {Promise<void>}
     */
    ScrollPositionProvider.prototype.setPosition = function (location) {
        var that = this;
        that._logger.verbose("Scrolling to:", location);
        return EyesLeanFTUtils.scrollTo(this._driver, location, this._promiseFactory).then(function () {
            that._logger.verbose("Done scrolling!");
        });
    };

    /**
     * @returns {Promise<{width: number, height: number}>} The entire size of the container which the position is relative to.
     */
    ScrollPositionProvider.prototype.getEntireSize = function () {
        var that = this;
        return EyesLeanFTUtils.getEntirePageSize(this._driver, this._promiseFactory).then(function (result) {
            that._logger.verbose("Entire size: ", result);
            return result;
        });
    };

    /**
     * @returns {Promise<{x: number, y: number}>}
     */
    ScrollPositionProvider.prototype.getState = function () {
        return this.getCurrentPosition();
    };

    /**
     * @param {{x: number, y: number}} state The initial state of position
     * @returns {Promise<void>}
     */
    ScrollPositionProvider.prototype.restoreState = function (state) {
        var that = this;
        return this.setPosition(state).then(function () {
            that._logger.verbose("Position restored.");
        });
    };

    module.exports = {
        ScrollPositionProvider: ScrollPositionProvider
    };
}());

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
 ---

 name: EyesRemoteWebElement

 description: Wraps a Remote Web Element.

 ---
 */

(function () {
    "use strict";

    var EyesSDK = __webpack_require__(1),
        EyesUtils = __webpack_require__(0);
    var MouseAction = EyesSDK.Triggers.MouseAction,
        GeneralUtils = EyesUtils.GeneralUtils,
        GeometryUtils = EyesUtils.GeometryUtils;

    var JS_GET_SCROLL_LEFT = "return element.scrollLeft;";

    var JS_GET_SCROLL_TOP = "return element.scrollTop;";

    var JS_GET_SCROLL_WIDTH = "return element.scrollWidth;";

    var JS_GET_SCROLL_HEIGHT = "return element.scrollHeight;";

    var JS_GET_LOCATION = "var rect = element.getBoundingClientRect(); return [rect.left, rect.top]";

    /**
     * @param {string} xpath
     * @return {string}
     */
    var JS_SELECT_ELEMENT_BY_XPATH = function (xpath) {
        return "var element = document.evaluate('" + xpath + "', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;";
    };

    /**
     * @param {int} scrollLeft
     * @param {int} scrollTop
     * @return {string}
     */
    var JS_SCROLL_TO_COMMAND = function (scrollLeft, scrollTop) {
        return "element.scrollLeft = " + scrollLeft + "; element.scrollTop = " + scrollTop + ";";
    };

    /**
     * @param {string} overflow
     * @return {string}
     */
    var JS_SET_OVERFLOW_COMMAND = function (overflow) {
        return "element.style.overflow = '" + overflow + "'";
    };

    /**
     *
     * C'tor = initializes the module settings
     *
     * @constructor
     * @param {WebBaseTestObject} remoteWebElement
     * @param {EyesWebBrowser} browser
     * @param {Logger} logger
     * @augments WebBaseTestObject
     **/
    function EyesWebTestObject(remoteWebElement, browser, logger) {
        this._element = remoteWebElement;
        this._logger = logger;
        this._browser = browser;
        GeneralUtils.mixin(this, remoteWebElement);
    }

    function _getRectangle(location, size) {
        size = size || {height: 0, width: 0};
        location = location || {x: 0, y: 0};

        var left = location.x,
            top = location.y,
            width = size.width,
            height = size.height;

        if (left < 0) {
            width = Math.max(0, width + left);
            left = 0;
        }

        if (top < 0) {
            height = Math.max(0, height + top);
            top = 0;
        }

        return {
            top: top,
            left: left,
            width: width,
            height: height
        };
    }

    function _getBounds(element) {
        return element.location().then(function (location) {
            return element.size().then(function (size) {
                return _getRectangle(location, size);
            }, function () {
                return _getRectangle(location);
            });
        }, function () {
            return _getRectangle();
        });
    }

    EyesWebTestObject.registerSendKeys = function (element, eyesDriver, logger, args) {
        var text = args.join('');
        logger.verbose("registerSendKeys: text is", text);
        return _getBounds(element).then(function (rect) {
            eyesDriver.getEyes().addKeyboardTrigger(rect, text);
        });
    };

    EyesWebTestObject.prototype.sendKeys = function () {
        var that = this, args = Array.prototype.slice.call(arguments, 0);
        return EyesWebTestObject.registerSendKeys(that._element, that._browser, that._logger, args).then(function () {
            return that._element.sendKeys.call(that._element, args);
        });
    };

    EyesWebTestObject.registerClick = function (element, eyesDriver, logger) {
        logger.verbose("apply click on element");
        return _getBounds(element).then(function (rect) {
            var offset = {x: rect.width / 2, y: rect.height / 2};
            eyesDriver.getEyes().addMouseTrigger(MouseAction.Click, rect, offset);
        });
    };

    EyesWebTestObject.prototype.click = function () {
        var that = this;
        that._logger.verbose("click on element");
        return EyesWebTestObject.registerClick(that._element, that._browser, that._logger).then(function () {
            return that._element.click();
        });
    };

    EyesWebTestObject.prototype.findElement = function (locator) {
        var that = this;
        return this._element.findElement(locator).then(function (element) {
            return new EyesWebTestObject(element, that._browser, that._logger);
        });
    };

    EyesWebTestObject.prototype.findElements = function (locator) {
        var that = this;
        return this._element.findElements(locator).then(function (elements) {
            return elements.map(function (element) {
                return new EyesWebTestObject(element, that._browser, that._logger);
            });
        });
    };

    /**
     * Returns the computed value of the style property for the current element.
     * @param {string} propStyle The style property which value we would like to extract.
     * @return {promise.Promise.<string>} The value of the style property of the element, or {@code null}.
     */
    EyesWebTestObject.prototype.getComputedStyle = function (propStyle) {
        return this._element.getComputedStyle(propStyle);
    };

    /**
     * @return {promise.Promise.<int>} The integer value of a computed style.
     */
    EyesWebTestObject.prototype.getComputedStyleInteger = function (propStyle) {
        return this.getComputedStyle(propStyle).then(function (value) {
            return Math.round(parseFloat(value.trim().replace("px", "")));
        });
    };

    /**
     * @return {promise.Promise.<int>} The value of the scrollLeft property of the element.
     */
    EyesWebTestObject.prototype.getScrollLeft  = function () {
        return this.executeScript(JS_GET_SCROLL_LEFT).then(function (value) {
            return parseInt(value, 10);
        });
    };

    /**
     * @return {promise.Promise.<int>} The value of the scrollTop property of the element.
     */
    EyesWebTestObject.prototype.getScrollTop  = function () {
        return this.executeScript(JS_GET_SCROLL_TOP).then(function (value) {
            return parseInt(value, 10);
        });
    };

    /**
     * @return {promise.Promise.<int>} The value of the scrollWidth property of the element.
     */
    EyesWebTestObject.prototype.getScrollWidth  = function () {
        return this.executeScript(JS_GET_SCROLL_WIDTH).then(function (value) {
            return parseInt(value, 10);
        });
    };

    /**
     * @return {promise.Promise.<int>} The value of the scrollHeight property of the element.
     */
    EyesWebTestObject.prototype.getScrollHeight  = function () {
        return this.executeScript(JS_GET_SCROLL_HEIGHT).then(function (value) {
            return parseInt(value, 10);
        });
    };

    /**
     * @return {promise.Promise.<int>} The width of the left border.
     */
    EyesWebTestObject.prototype.getBorderLeftWidth = function () {
        return this.getComputedStyleInteger("border-left-width");
    };

    /**
     * @return {promise.Promise.<int>} The width of the right border.
     */
    EyesWebTestObject.prototype.getBorderRightWidth = function () {
        return this.getComputedStyleInteger("border-right-width");
    };

    /**
     * @return {promise.Promise.<int>} The width of the top border.
     */
    EyesWebTestObject.prototype.getBorderTopWidth = function () {
        return this.getComputedStyleInteger("border-top-width");
    };

    /**
     * @return {promise.Promise.<int>} The width of the bottom border.
     */
    EyesWebTestObject.prototype.getBorderBottomWidth = function () {
        return this.getComputedStyleInteger("border-bottom-width");
    };

    /**
     * @return {!promise.Thenable<{width: number, height: number}>} element's size
     */
    EyesWebTestObject.prototype.getSize = function () {
        return this._element.size().then(function (value) {
            return GeometryUtils.createSize(value.width, value.height);
        });
    };

    /**
     * @return {!promise.Thenable<{x: number, y: number}>} element's location
     */
    EyesWebTestObject.prototype.getLocation = function () {
        var results, x, y;
        return this.executeScript(JS_GET_LOCATION).then(function (value) {
            results = value;
            return results[0];
        }).then(function (value) {
            x = value;
            return results[1];
        }).then(function (value) {
            x = Math.ceil(x) || 0;
            y = Math.ceil(value) || 0;
            return GeometryUtils.createLocation(x, y);
        });
    };

    /**
     * Scrolls to the specified location inside the element.
     * @param {{x: number, y: number}} location The location to scroll to.
     * @return {promise.Promise.<void>}
     */
    EyesWebTestObject.prototype.scrollTo = function (location) {
        return this.executeScript(JS_SCROLL_TO_COMMAND(location.x, location.y));
    };

    /**
     * @return {promise.Promise.<string>} The overflow of the element.
     */
    EyesWebTestObject.prototype.getOverflow = function () {
        return this.getComputedStyle("overflow");
    };

    /**
     * @param {string} overflow The overflow to set
     * @return {promise.Promise.<void>} The overflow of the element.
     */
    EyesWebTestObject.prototype.setOverflow = function (overflow) {
        return this.executeScript(JS_SET_OVERFLOW_COMMAND(overflow));
    };

    /**
     * @param {string} script
     * @return {promise.Promise.<void>} The overflow of the element.
     */
    EyesWebTestObject.prototype.executeScript = function (script) {
        var that = this;
        return this.xpath().then(function (xpath) {
            return that._browser.executeScript(JS_SELECT_ELEMENT_BY_XPATH(xpath) + script);
        });
    };

    /**
     * @return {WebElement} The original element object
     */
    EyesWebTestObject.prototype.getRemoteWebElement = function () {
        return this._element;
    };

    module.exports = {
        EyesWebTestObject: EyesWebTestObject
    };
}());


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
    'use strict';

    var EyesSDK = __webpack_require__(1),
        EyesUtils = __webpack_require__(0),
        EyesLeanFTUtils = __webpack_require__(2).EyesLeanFTUtils;
    var PositionProvider = EyesSDK.PositionProvider,
        ArgumentGuard = EyesUtils.ArgumentGuard;

    /**
     * @constructor
     * @param {Logger} logger A Logger instance.
     * @param {EyesWebBrowser} executor
     * @param {PromiseFactory} promiseFactory
     * @augments PositionProvider
     */
    function CssTranslatePositionProvider(logger, executor, promiseFactory) {
        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(executor, "executor");

        this._logger = logger;
        this._driver = executor;
        this._promiseFactory = promiseFactory;
        this._lastSetPosition = null;
    }

    CssTranslatePositionProvider.prototype = new PositionProvider();
    CssTranslatePositionProvider.prototype.constructor = CssTranslatePositionProvider;

    /**
     * @returns {Promise<{x: number, y: number}>} The scroll position of the current frame.
     */
    CssTranslatePositionProvider.prototype.getCurrentPosition = function () {
        var that = this;
        return that._promiseFactory.makePromise(function (resolve) {
            that._logger.verbose("getCurrentPosition()");
            that._logger.verbose("position to return: ", that._lastSetPosition);
            resolve(that._lastSetPosition);
        });
    };

    /**
     * Go to the specified location.
     * @param {{x: number, y: number}} location The position to scroll to.
     * @returns {Promise<void>}
     */
    CssTranslatePositionProvider.prototype.setPosition = function (location) {
        var that = this;
        that._logger.verbose("Setting position to:", location);
        return EyesLeanFTUtils.translateTo(this._driver, location, this._promiseFactory).then(function () {
            that._logger.verbose("Done!");
            that._lastSetPosition = location;
        });
    };

    /**
     * @returns {Promise<{width: number, height: number}>} The entire size of the container which the position is relative to.
     */
    CssTranslatePositionProvider.prototype.getEntireSize = function () {
        var that = this;
        return EyesLeanFTUtils.getEntirePageSize(this._driver, this._promiseFactory).then(function (result) {
            that._logger.verbose("Entire size: ", result);
            return result;
        });
    };

    /**
     * @returns {Promise<object.<string, string>>}
     */
    CssTranslatePositionProvider.prototype.getState = function () {
        var that = this;
        return EyesLeanFTUtils.getCurrentTransform(this._driver, this._promiseFactory).then(function (transforms) {
            that._logger.verbose("Current transform", transforms);
            return transforms;
        });
    };

    /**
     * @param {object.<string, string>} state The initial state of position
     * @returns {Promise<void>}
     */
    CssTranslatePositionProvider.prototype.restoreState = function (state) {
        var that = this;
        return EyesLeanFTUtils.setTransforms(this._driver, state, this._promiseFactory).then(function () {
            that._logger.verbose("Transform (position) restored.");
        });
    };

    module.exports = {
        CssTranslatePositionProvider: CssTranslatePositionProvider,
    }
}());

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
    'use strict';

    var EyesSDK = __webpack_require__(1),
        EyesUtils = __webpack_require__(0);
    var PositionProvider = EyesSDK.PositionProvider,
        ArgumentGuard = EyesUtils.ArgumentGuard;

    /**
     * @constructor
     * @param {Logger} logger A Logger instance.
     * @param {EyesWebBrowser} driver
     * @param {EyesWebTestObject} element
     * @param {PromiseFactory} promiseFactory
     * @augments PositionProvider
     */
    function ElementPositionProvider(logger, driver, element, promiseFactory) {
        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(driver, "executor");
        ArgumentGuard.notNull(element, "element");

        this._logger = logger;
        this._driver = driver;
        this._element = element;
        this._promiseFactory = promiseFactory;
    }

    ElementPositionProvider.prototype = new PositionProvider();
    ElementPositionProvider.prototype.constructor = ElementPositionProvider;

    /**
     * @returns {Promise<{x: number, y: number}>} The scroll position of the current frame.
     */
    ElementPositionProvider.prototype.getCurrentPosition = function () {
        var that = this, elScrollLeft;
        that._logger.verbose("getCurrentPosition()");

        return that._element.getScrollLeft().then(function (value) {
            elScrollLeft = value;
            return that._element.getScrollTop();
        }).then(function (value) {
            var location = { x: elScrollLeft, y: value };
            that._logger.verbose("Current position: ", location);
            return location;
        });
    };

    /**
     * Go to the specified location.
     * @param {{x: number, y: number}} location The position to scroll to.
     * @returns {Promise<void>}
     */
    ElementPositionProvider.prototype.setPosition = function (location) {
        var that = this;
        that._logger.verbose("Scrolling to:", location);
        return that._element.scrollTo(location).then(function () {
            that._logger.verbose("Done scrolling!");
        });
    };

    /**
     * @returns {Promise<{width: number, height: number}>} The entire size of the container which the position is relative to.
     */
    ElementPositionProvider.prototype.getEntireSize = function () {
        var that = this, elScrollWidth, elScrollHeight;
        that._logger.verbose("getEntireSize()");
        return that._element.getScrollWidth().then(function (value) {
            elScrollWidth = value;
            return that._element.getScrollHeight();
        }).then(function (value) {
            elScrollHeight = value;

            that._logger.verbose("Entire size: ", elScrollWidth, ",", elScrollHeight);

            return {
                width: elScrollWidth,
                height: elScrollHeight
            };
        });
    };

    /**
     * @returns {Promise<{x: number, y: number}>}
     */
    ElementPositionProvider.prototype.getState = function () {
        return this.getCurrentPosition();
    };

    /**
     * @param {{x: number, y: number}} state The initial state of position
     * @returns {Promise<void>}
     */
    ElementPositionProvider.prototype.restoreState = function (state) {
        var that = this;
        return this.setPosition(state).then(function () {
            that._logger.verbose("Position restored.");
        });
    };

    module.exports = {
        ElementPositionProvider: ElementPositionProvider
    };
}());

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

(function () {
    'use strict';

    var promise = __webpack_require__(14),
        LeanftSdkWeb = __webpack_require__(15),
        EyesSDK = __webpack_require__(1),
        EyesUtils = __webpack_require__(0),
        EyesWebBrowser = __webpack_require__(8).EyesWebBrowser,
        EyesStdWinWindow = __webpack_require__(9).EyesStdWinWindow,
        EyesLeanFTUtils = __webpack_require__(2).EyesLeanFTUtils,
        EyesWebTestObject = __webpack_require__(4).EyesWebTestObject,
        ScrollPositionProvider = __webpack_require__(3).ScrollPositionProvider,
        CssTranslatePositionProvider = __webpack_require__(5).CssTranslatePositionProvider,
        ElementPositionProvider = __webpack_require__(6).ElementPositionProvider,
        EyesRegionProvider = __webpack_require__(10).EyesRegionProvider,
        Target = __webpack_require__(12).Target;
    var WebBaseDescription = LeanftSdkWeb.Behaviors.WebBaseDescription,
        WebBaseTestObject = LeanftSdkWeb.Behaviors.WebBaseTestObject,
        EyesBase = EyesSDK.EyesBase,
        FixedScaleProvider = EyesSDK.FixedScaleProvider,
        ContextBasedScaleProviderFactory = EyesSDK.ContextBasedScaleProviderFactory,
        FixedScaleProviderFactory = EyesSDK.FixedScaleProviderFactory,
        NullScaleProvider = EyesSDK.NullScaleProvider,
        Logger = EyesSDK.Logger,
        MutableImage = EyesSDK.MutableImage,
        CoordinatesType = EyesSDK.CoordinatesType,
        ScaleProviderIdentityFactory = EyesSDK.ScaleProviderIdentityFactory,
        PromiseFactory = EyesUtils.PromiseFactory,
        ArgumentGuard = EyesUtils.ArgumentGuard,
        SimplePropertyHandler = EyesUtils.SimplePropertyHandler,
        GeometryUtils = EyesUtils.GeometryUtils;

    var DEFAULT_WAIT_BEFORE_SCREENSHOTS = 100, // ms
        UNKNOWN_DEVICE_PIXEL_RATIO = 0,
        DEFAULT_DEVICE_PIXEL_RATIO = 1;

    /**
     * @readonly
     * @enum {string}
     */
    var StitchMode = {
        // Uses scrolling to get to the different parts of the page.
        Scroll: 'Scroll',

        // Uses CSS transitions to get to the different parts of the page.
        CSS: 'CSS'
    };

    /**
     * Initializes an Eyes instance.
     * @param {String} [serverUrl] - The Eyes server URL.
     * @param {Boolean} [isDisabled] - set to true to disable Applitools Eyes and use the webdriver directly.
     * @augments EyesBase
     * @constructor
     **/
    function Eyes(serverUrl, isDisabled) {
        this._forceFullPage = false;
        this._imageRotationDegrees = 0;
        this._automaticRotation = true;
        this._isLandscape = false;
        this._hideScrollbars = null;
        this._checkFrameOrElement = false;
        this._stitchMode = StitchMode.Scroll;
        this._promiseFactory = new PromiseFactory();
        this._waitBeforeScreenshots = DEFAULT_WAIT_BEFORE_SCREENSHOTS;

        EyesBase.call(this, this._promiseFactory, serverUrl || EyesBase.DEFAULT_EYES_SERVER, isDisabled);
    }

    Eyes.prototype = new EyesBase();
    Eyes.prototype.constructor = Eyes;

    //noinspection JSUnusedGlobalSymbols
    Eyes.prototype._getBaseAgentId = function () {
        return 'leanft-js/1.0.1';
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Starts a test.
     * @param {Web.Browser|StdWin.Window} browser - The web driver that controls the browser hosting the application under test.
     * @param {string} appName - The name of the application under test.
     * @param {string} testName - The test name.
     * @param {{width: number, height: number}} viewportSize - The required browser's
     * viewport size (i.e., the visible part of the document's body) or to use the current window's viewport.
     * @return {Promise<EyesWebBrowser|EyesStdWinWindow>} A wrapped WebDriver which enables Eyes trigger recording and frame handling.
     */
    Eyes.prototype.open = function (browser, appName, testName, viewportSize) {
        var that = this;

        var browserClassName = browser.constructor.name;
        if (browserClassName === 'Browser') {
            that._driver = new EyesWebBrowser(browser, that, that._logger, that._promiseFactory);
        } else if (browserClassName === 'UiObjectBaseTO') {
            that._driver = new EyesStdWinWindow(browser, that, that._logger, that._promiseFactory);
        } else {
            that._driver = browser;
        }

        that._promiseFactory.setFactoryMethods(function (asyncAction) {
            return browser._session._promiseManager.syncedBranchThen(function () {
                var deferred = promise.defer();
                asyncAction(deferred.fulfill, deferred.reject);
                return deferred.promise;
            });
        }, function () {
            return promise.defer();
        });

        if (this._isDisabled) {
            return that._promiseFactory.makePromise(function (resolve) {
                resolve(that._driver);
            });
        }

        return EyesBase.prototype.open.call(that, appName, testName, viewportSize).then(function () {
            that._devicePixelRatio = UNKNOWN_DEVICE_PIXEL_RATIO;
            that.setStitchMode(that._stitchMode);
            return that._driver;
        });
    };

    //noinspection JSUnusedGlobalSymbols
  /**
   * Ends the test.
   * @param throwEx - If true, an exception will be thrown for failed/new tests.
   * @returns {*} The test results.
   */
    Eyes.prototype.close = function (throwEx) {
        var that = this;

        if (this._isDisabled) {
            return that._promiseFactory.makePromise(function (resolve) {
                resolve();
            });
        }
        if (throwEx === undefined) {
            throwEx = true;
        }

        this._promiseFactory.makePromise(function (resolve, reject) {
            return EyesBase.prototype.close.call(that, throwEx).then(function (results) {
                resolve(results);
            }, function (err) {
                reject(err);
            });
        });
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Preform visual validation
     * @param {string} name - A name to be associated with the match
     * @param {Target} target - Target instance which describes whether we want a window/region
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    Eyes.prototype.check = function (name, target) {
        ArgumentGuard.notNullOrEmpty(name, "Name");
        ArgumentGuard.notNull(target, "Target");

        var that = this;

        var promise = that._promiseFactory.makePromise(function (resolve) {
            resolve();
        });

        if (that._isDisabled) {
            that._logger.verbose("match ignored - ", name);
            return promise;
        }

        if (target.getIgnoreObjects().length) {
            target.getIgnoreObjects().forEach(function (obj) {
                promise = promise.then(function() {
                    return findElementByLocator(that, obj.element);
                }).then(function (element) {
                    if (!isElementObject(element)) {
                        throw new Error("Unsupported ignore region type: " + typeof element);
                    }

                    return getRegionFromWebElement(element);
                }).then(function (region) {
                    target.ignore(region);
                });
            });
        }

        if (target.getFloatingObjects().length) {
            target.getFloatingObjects().forEach(function (obj) {
                promise = promise.then(function() {
                    return findElementByLocator(that, obj.element);
                }).then(function (element) {
                    if (!isElementObject(element)) {
                        throw new Error("Unsupported floating region type: " + typeof element);
                    }

                    return getRegionFromWebElement(element);
                }).then(function (region) {
                    region.maxLeftOffset = obj.maxLeftOffset;
                    region.maxRightOffset = obj.maxRightOffset;
                    region.maxUpOffset = obj.maxUpOffset;
                    region.maxDownOffset = obj.maxDownOffset;
                    target.floating(region);
                });
            });
        }

        that._logger.verbose("match starting with params", name, target.getStitchContent(), target.getTimeout());
        var regionObject,
            regionProvider,
            originalOverflow, originalPositionProvider, originalHideScrollBars;

        // if region specified
        if (target.isUsingRegion()) {
            promise = promise.then(function () {
                return findElementByLocator(that, target.getRegion());
            }).then(function (region) {
                regionObject = region;

                if (isElementObject(regionObject)) {
                    var regionPromise;
                    if (target.getStitchContent()) {
                        that._checkFrameOrElement = true;

                        originalPositionProvider = that.getPositionProvider();
                        that.setPositionProvider(new ElementPositionProvider(that._logger, that._driver, regionObject, that._promiseFactory));

                        // Set overflow to "hidden".
                        regionPromise = regionObject.getOverflow().then(function (value) {
                            originalOverflow = value;
                            return regionObject.setOverflow("hidden");
                        }).then(function () {
                            return getRegionProviderForElement(that, regionObject);
                        }).then(function (regionProvider) {
                            that._regionToCheck = regionProvider;
                        });
                    } else {
                        regionPromise = getRegionFromWebElement(regionObject);
                    }

                    return regionPromise.then(function (region) {
                        regionProvider = new EyesRegionProvider(that._logger, that._driver, region, CoordinatesType.CONTEXT_RELATIVE);
                    });
                } else if (GeometryUtils.isRegion(regionObject)) {
                    // if regionObject is simple region
                    regionProvider = new EyesRegionProvider(that._logger, that._driver, regionObject, CoordinatesType.CONTEXT_AS_IS);
                } else {
                    throw new Error("Unsupported region type: " + typeof regionObject);
                }
            });
        }

        return promise.then(function () {
            that._logger.verbose("Call to checkWindowBase...");
            var imageMatchSettings = {
                matchLevel: target.getMatchLevel(),
                ignoreCaret: target.getIgnoreCaret(),
                ignore: target.getIgnoreRegions(),
                floating: target.getFloatingRegions(),
                exact: null
            };
            return EyesBase.prototype.checkWindow.call(that, name, target.getIgnoreMismatch(), target.getTimeout(), regionProvider, imageMatchSettings);
        }).then(function (result) {
            that._logger.verbose("Processing results...");
            if (result.asExpected || !that._failureReportOverridden) {
                return result;
            } else {
                throw EyesBase.buildTestError(result, that._sessionStartInfo.scenarioIdOrName, that._sessionStartInfo.appIdOrName);
            }
        }).then(function () {
            that._logger.verbose("Done!");
            that._logger.verbose("Restoring temporal variables...");

            if (that._regionToCheck) {
                that._regionToCheck = null;
            }

            if (that._checkFrameOrElement) {
                that._checkFrameOrElement = false;
            }

            // restore initial values
            if (originalHideScrollBars !== undefined) {
                that._hideScrollbars = originalHideScrollBars;
            }

            if (originalPositionProvider !== undefined) {
                that.setPositionProvider(originalPositionProvider);
            }

            if (originalOverflow !== undefined) {
                return regionObject.setOverflow(originalOverflow);
            }
        }).then(function () {
            that._logger.verbose("Done!");
        });
    };

    var findElementByLocator = function (that, elementObject) {
        return that._promiseFactory.makePromise(function (resolve) {
            if (isLocatorObject(elementObject)) {
                that._logger.verbose("Trying to find element...", elementObject);
                resolve(that._driver.$(elementObject));
                return;
            }

            resolve(elementObject);
        });
    };

    var isElementObject = function (o) {
        return o instanceof EyesWebTestObject || o instanceof WebBaseTestObject;
    };

    var isLocatorObject = function (o) {
        return o instanceof WebBaseDescription;
    };

    /**
     * Get the region provider for a certain element.
     * @param {Eyes} eyes - The eyes instance.
     * @param {EyesWebTestObject} element - The element to get a region for.
     * @return {Promise<EyesRegionProvider>} The region for a certain element.
     */
    var getRegionProviderForElement = function (eyes, element) {
        var elementLocation, elementSize,
            borderLeftWidth, borderRightWidth, borderTopWidth;

        eyes._logger.verbose("getRegionProviderForElement");
        return element.getLocation().then(function (value) {
            elementLocation = value;
            return element.getSize();
        }).then(function (value) {
            elementSize = value;
            return element.getBorderLeftWidth();
        }).then(function (value) {
            borderLeftWidth = value;
            return element.getBorderRightWidth();
        }).then(function (value) {
            borderRightWidth = value;
            return element.getBorderTopWidth();
        }).then(function (value) {
            borderTopWidth = value;
            return element.getBorderBottomWidth();
        }).then(function (value) { // borderBottomWidth
            var elementRegion = GeometryUtils.createRegion(
                elementLocation.x + borderLeftWidth,
                elementLocation.y + borderTopWidth,
                elementSize.width - borderLeftWidth - borderRightWidth,
                elementSize.height - borderTopWidth - value
            );

            eyes._logger.verbose("Done! Element region", elementRegion);
            return new EyesRegionProvider(eyes._logger, eyes._driver, elementRegion, CoordinatesType.CONTEXT_RELATIVE);
        });
    };

    /**
     * Get the region for a certain web element.
     * @param {EyesWebTestObject} element - The web element to get the region from.
     * @return {Promise<{left: number, top: number, width: number, height: number}>} The region.
     */
    var getRegionFromWebElement = function (element) {
        var elementSize;
        return element.getSize().then(function (size) {
            elementSize = size;
            return element.getLocation();
        }).then(function (point) {
            return GeometryUtils.createRegionFromLocationAndSize(point, elementSize);
        });
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Takes a snapshot of the application under test and matches it with
     * the expected output.
     * @param {string} tag - An optional tag to be associated with the snapshot.
     * @param {int} matchTimeout - The amount of time to retry matching (Milliseconds).
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    Eyes.prototype.checkWindow = function (tag, matchTimeout) {
        return this.check(tag, Target.window().timeout(matchTimeout));
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Takes a snapshot of the application under test and matches a specific
     * element with the expected region output.
     * @param {EyesWebTestObject} element - The element to check.
     * @param {int|null} matchTimeout - The amount of time to retry matching (milliseconds).
     * @param {string} tag - An optional tag to be associated with the match.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    Eyes.prototype.checkElement = function (element, matchTimeout, tag) {
        return this.check(tag, Target.region(element).timeout(matchTimeout).fully());
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Takes a snapshot of the application under test and matches a specific
     * element with the expected region output.
     * @param {WebBaseDescription} locator - The element to check.
     * @param {int|null} matchTimeout - The amount of time to retry matching (milliseconds).
     * @param {string} tag - An optional tag to be associated with the match.
     * @return {ManagedPromise} A promise which is resolved when the validation is finished.
     */
    Eyes.prototype.checkElementBy = function (locator, matchTimeout, tag) {
        return this.check(tag, Target.region(locator).timeout(matchTimeout).fully());
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Visually validates a region in the screenshot.
     * @param {{left: number, top: number, width: number, height: number}} region - The region to
     * validate (in screenshot coordinates).
     * @param {string} tag - An optional tag to be associated with the screenshot.
     * @param {int} matchTimeout - The amount of time to retry matching.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    Eyes.prototype.checkRegion = function (region, tag, matchTimeout) {
        return this.check(tag, Target.region(region).timeout(matchTimeout));
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Visually validates a region in the screenshot.
     * @param {EyesWebTestObject} element - The element defining the region to validate.
     * @param {string} tag - An optional tag to be associated with the screenshot.
     * @param {int} matchTimeout - The amount of time to retry matching.
     * @return {ManagedPromise} A promise which is resolved when the validation is finished.
     */
    Eyes.prototype.checkRegionByElement = function (element, tag, matchTimeout) {
        return this.check(tag, Target.region(element).timeout(matchTimeout));
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Visually validates a region in the screenshot.
     * @param {WebBaseDescription} by - The WebDriver selector used for finding the region to validate.
     * @param {string} tag - An optional tag to be associated with the screenshot.
     * @param {int} matchTimeout - The amount of time to retry matching.
     * @return {ManagedPromise} A promise which is resolved when the validation is finished.
     */
    Eyes.prototype.checkRegionBy = function (by, tag, matchTimeout) {
        return this.check(tag, Target.region(by).timeout(matchTimeout));
    };

    /**
     * @protected
     * @returns {ScaleProviderFactory}
     */
    Eyes.prototype.updateScalingParams = function () {
        var that = this;
        return that._promiseFactory.makePromise(function (resolve) {
            if (that._devicePixelRatio === UNKNOWN_DEVICE_PIXEL_RATIO && that._scaleProviderHandler.get() instanceof NullScaleProvider) {
                var factory, enSize, vpSize;
                that._logger.verbose("Trying to extract device pixel ratio...");

                return EyesLeanFTUtils.getDevicePixelRatio(that._driver, that._promiseFactory).then(function (ratio) {
                    that._devicePixelRatio = ratio;
                }, function (err) {
                    that._logger.verbose("Failed to extract device pixel ratio! Using default.", err);
                    that._devicePixelRatio = DEFAULT_DEVICE_PIXEL_RATIO;
                }).then(function () {
                    that._logger.verbose("Device pixel ratio: " + that._devicePixelRatio);
                    that._logger.verbose("Setting scale provider...");
                    return that._positionProvider.getEntireSize();
                }).then(function (entireSize) {
                    enSize = entireSize;
                    return that.getViewportSize();
                }).then(function (viewportSize) {
                    vpSize = viewportSize;
                    factory = new ContextBasedScaleProviderFactory(enSize, vpSize, that._devicePixelRatio, that._scaleProviderHandler);
                }, function (err) {
                    // This can happen in Appium for example.
                    that._logger.verbose("Failed to set ContextBasedScaleProvider.", err);
                    that._logger.verbose("Using FixedScaleProvider instead...");
                    factory = new FixedScaleProviderFactory(1/that._devicePixelRatio, that._scaleProviderHandler);
                }).then(function () {
                    that._logger.verbose("Done!");
                    resolve(factory);
                });
            }

            // If we already have a scale provider set, we'll just use it, and pass a mock as provider handler.
            resolve(new ScaleProviderIdentityFactory(that._scaleProviderHandler.get(), new SimplePropertyHandler()));
        });
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get an updated screenshot.
     * @returns {Promise.<MutableImage>} - The image of the new screenshot.
     */
    Eyes.prototype.getScreenShot = function () {
        var that = this;
        if (that._driver instanceof EyesWebBrowser) {
            return that.updateScalingParams().then(function (scaleProviderFactory) {
                return EyesLeanFTUtils.getScreenshot(
                    that._driver,
                    that._promiseFactory,
                    that._viewportSize,
                    that._positionProvider,
                    scaleProviderFactory,
                    that._cutProviderHandler.get(),
                    that._forceFullPage,
                    that._hideScrollbars,
                    that._stitchMode === StitchMode.CSS,
                    that._imageRotationDegrees,
                    that._automaticRotation,
                    that._os === 'Android' ? 90 : 270,
                    that._isLandscape,
                    that._waitBeforeScreenshots,
                    that._checkFrameOrElement,
                    that._regionToCheck,
                    that._saveDebugScreenshots,
                    that._debugScreenshotsPath
                );
            });
        } else if (that._driver instanceof EyesStdWinWindow) {
            if (that._forceFullPage) {
                throw new Error("Full page screenshot is supported only for browser test object");
            }

            return this._driver.takeScreenshot().then(function (results) {
                return MutableImage.fromBase64(results, that._promiseFactory);
            });
        } else {
            throw new Error("Top level object is of unsupported type");
        }
    };

    //noinspection JSUnusedGlobalSymbols
    Eyes.prototype.getTitle = function () {
        return this._driver.getTitle();
    };

    //noinspection JSUnusedGlobalSymbols
    Eyes.prototype._waitTimeout = function (ms) {
        var that = this;
        return this._promiseFactory.makePromise(function (resolve) {
            that._logger.log('Waiting', ms, 'ms...');
            setTimeout(function () {
                that._logger.log('Waiting finished.');
                resolve();
            }, ms);
        });
    };

    //noinspection JSUnusedGlobalSymbols
    Eyes.prototype.getInferredEnvironment = function () {
        return this._driver.getUserAgent().then(function (userAgent) {
            return 'useragent:' + userAgent;
        });
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set the failure report.
     * @param mode - Use one of the values in EyesBase.FailureReport.
     */
    Eyes.prototype.setFailureReport = function (mode) {
        if (mode === EyesBase.FailureReport.Immediate) {
            this._failureReportOverridden = true;
            mode = EyesBase.FailureReport.OnClose;
        }

        EyesBase.prototype.setFailureReport.call(this, mode);
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the viewport size.
     * @returns {*} The viewport size.
     */
    Eyes.prototype.getViewportSize = function () {
        var that = this;
        if (this._driver instanceof EyesWebBrowser) {
            return EyesLeanFTUtils.getViewportSizeOrDisplaySize(this._logger, this._driver, this._promiseFactory);
        } else if (this._driver instanceof EyesStdWinWindow) {
            return that._driver.size();
        } else {
            throw new Error("Top level object is of unsupported type");
        }
    };

    //noinspection JSUnusedGlobalSymbols
    Eyes.prototype.setViewportSize = function (size) {
        if (this._driver instanceof EyesWebBrowser) {
            return EyesLeanFTUtils.setViewportSize(this._logger, this._driver, size, this._promiseFactory);
        } else if (this._driver instanceof EyesStdWinWindow) {
            throw this._driver.resize(size.width, size.height);
        } else {
            throw new Error("Top level object is of unsupported type");
        }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set the viewport size using the driver. Call this method if for some reason
     * you don't want to call {@link #open(WebDriver, String, String)} (or one of its variants) yet.
     * @param {Web.Browser} browser - The driver to use for setting the viewport.
     * @param {{width: number, height: number}} size - The required viewport size.
     * @return {Promise<void>} The viewport size of the browser.
     */
    Eyes.setViewportSize = function (browser, size) {
        var promiseFactory = new PromiseFactory();
        promiseFactory.setFactoryMethods(function (asyncAction) {
            var deferred = promise.defer();
            asyncAction(deferred.fulfill, deferred.reject);
            return deferred.promise;
        }, function () {
            return promise.defer();
        });

        return EyesLeanFTUtils.setViewportSize(new Logger(), browser, size, promiseFactory);
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set the full page screenshot option.
     * @param {boolean} force - Whether to force a full page screenshot or not.
     * @return {void}
     */
    Eyes.prototype.setForceFullPageScreenshot = function (force) {
        this._forceFullPage = force;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get whether to force a full page screenshot or not.
     * @return {boolean} true if the option is on, otherwise false.
     */
    Eyes.prototype.getForceFullPageScreenshot = function () {
        return this._forceFullPage;
    };

    //noinspection JSUnusedGlobalSymbols
  /**
   * Set the image rotation degrees.
   * @param degrees - The amount of degrees to set the rotation to.
   */
    Eyes.prototype.setForcedImageRotation = function (degrees) {
        if (typeof degrees !== 'number') {
            throw new TypeError('degrees must be a number! set to 0 to clear');
        }
        this._imageRotationDegrees = degrees;
        this._automaticRotation = false;
    };

    //noinspection JSUnusedGlobalSymbols
  /**
   * Get the rotation degrees.
   * @returns {*|number} - The rotation degrees.
   */
    Eyes.prototype.getForcedImageRotation = function () {
        return this._imageRotationDegrees || 0;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Hide the scrollbars when taking screenshots.
     * @param {boolean} hide - Whether to hide the scrollbars or not.
     */
    Eyes.prototype.setHideScrollbars = function (hide) {
        this._hideScrollbars = hide;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Hide the scrollbars when taking screenshots.
     * @return {boolean|null} - true if the hide scrollbars option is on, otherwise false.
     */
    Eyes.prototype.getHideScrollbars = function () {
        return this._hideScrollbars;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set the stitch mode.
     * @param {StitchMode} mode - The desired stitch mode settings.
     */
    Eyes.prototype.setStitchMode = function (mode) {
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
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the stitch mode.
     * @return {StitchMode} The currently set StitchMode.
     */
    Eyes.prototype.getStitchMode = function () {
        return this._stitchMode;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Sets the wait time between before each screen capture, including between
     * screen parts of a full page screenshot.
     * @param waitBeforeScreenshots - The wait time in milliseconds.
     */
    Eyes.prototype.setWaitBeforeScreenshots = function (waitBeforeScreenshots) {
        if (waitBeforeScreenshots <= 0) {
            this._waitBeforeScreenshots = DEFAULT_WAIT_BEFORE_SCREENSHOTS;
        } else {
            this._waitBeforeScreenshots = waitBeforeScreenshots;
        }
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the wait time before each screenshot.
     * @returns {number|*} the wait time between before each screen capture, in milliseconds.
     */
    Eyes.prototype.getWaitBeforeScreenshots = function () {
        return this._waitBeforeScreenshots;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the session id.
     * @returns {Promise} A promise which resolves to the browser's session ID.
     */
    Eyes.prototype.getAUTSessionId = function () {
        var that = this;
        return this._promiseFactory.makePromise(function (resolve) {
            if (that._driver instanceof EyesWebBrowser) {
                resolve(that._driver.getSessionId());
            } else {
                resolve(undefined);
            }
        });
    };

    /**
     * @readonly
     * @enum {string}
     */
    Eyes.StitchMode = Object.freeze(StitchMode);
    module.exports = {
        Eyes: Eyes
    };
}());


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

(function () {
    "use strict";
    var EyesUtils = __webpack_require__(0),
        EyesLeanFTUtils = __webpack_require__(2).EyesLeanFTUtils,
        EyesWebTestObject = __webpack_require__(4).EyesWebTestObject,
        ScrollPositionProvider = __webpack_require__(3).ScrollPositionProvider;
    var GeneralUtils = EyesUtils.GeneralUtils;

    /**
     *
     * C'tor = initializes the module settings
     *
     * @constructor
     * @param {Object} remoteWebDriver
     * @param {Eyes} eyes An instance of Eyes
     * @param {Object} logger
     * @param {PromiseFactory} promiseFactory
     * @augments Web.Browser
     **/
    function EyesWebBrowser(remoteWebDriver, eyes, logger, promiseFactory) {
        this._eyes = eyes;
        this._logger = logger;
        this._promiseFactory = promiseFactory;
        this._defaultContentViewportSize = null;
        this.setRemoteWebBrowser(remoteWebDriver);
    }

    //noinspection JSUnusedGlobalSymbols
    EyesWebBrowser.prototype.getEyes = function () {
        return this._eyes;
    };

    //noinspection JSUnusedGlobalSymbols
    EyesWebBrowser.prototype.setEyes = function (eyes) {
        this._eyes = eyes;
    };

    //noinspection JSUnusedGlobalSymbols
    EyesWebBrowser.prototype.getRemoteWebBrowser = function () {
        return this._browser;
    };

    //noinspection JSUnusedGlobalSymbols
    EyesWebBrowser.prototype.setRemoteWebBrowser = function (remoteWebBrowser) {
        this._browser = remoteWebBrowser;
        this.page = remoteWebBrowser.page;
        GeneralUtils.mixin(this, remoteWebBrowser);
    };

    //noinspection JSUnusedGlobalSymbols
    EyesWebBrowser.prototype.$ = function () {
        var element = this._browser.$.apply(this._browser, arguments);
        return new EyesWebTestObject(element, this, this._logger);
    };

    //noinspection JSUnusedGlobalSymbols
    EyesWebBrowser.prototype.$$ = function () {
        var that = this;
        return this._browser.$$.apply(this._browser, arguments).then(function (elements) {
            return elements.map(function (element) {
                return new EyesWebTestObject(element, that, that._logger);
            });
        });
    };

    //noinspection JSUnusedGlobalSymbols
    EyesWebBrowser.prototype.getUserAgent = function () {
        return this.executeScript("return navigator.userAgent;");
    };

    /**
     * @param {boolean} forceQuery If true, we will perform the query even if we have a cached viewport size.
     * @return {Promise<{width: number, height: number}>} The viewport size of the default content (outer most frame).
     */
    EyesWebBrowser.prototype.getDefaultContentViewportSize = function (forceQuery) {
        var that = this;
        return this._promiseFactory.makePromise(function (resolve) {
            that._logger.verbose("getDefaultContentViewportSize()");

            if (that._defaultContentViewportSize !== null && !forceQuery) {
                that._logger.verbose("Using cached viewport size:", that._defaultContentViewportSize);
                resolve(that._defaultContentViewportSize);
                return;
            }

            return EyesLeanFTUtils.getViewportSizeOrDisplaySize(that._logger, that._browser, that._promiseFactory).then(function (viewportSize) {
                that._defaultContentViewportSize = viewportSize;
                that._logger.verbose("Done! Viewport size:", that._defaultContentViewportSize);
                resolve(that._defaultContentViewportSize);
            });
        });
    };

    /**
     *
     * @param {string} script
     * @returns {Promise.<*>}
     */
    EyesWebBrowser.prototype.executeScript = function (script) {
        return this._browser.page.runScript(script);
    };

    /**
     *
     * @return {String} Browser's session identity
     */
    EyesWebBrowser.prototype.getSessionId = function () {
        return this._browser._session._communication._sessionID;
    };

    /**
     *
     * @return {Promise.<String>}
     */
    EyesWebBrowser.prototype.getTitle = function () {
        return this._browser.page.title();
    };

    /**
     * @return {String} Base64 representation of this test object.
     */
    EyesWebBrowser.prototype.takeScreenshot = function () {
        return this._browser.page.snapshot();
    };

    module.exports = {
        EyesWebBrowser: EyesWebBrowser
    };
}());


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

(function () {
    "use strict";
    var EyesUtils = __webpack_require__(0);
    var GeneralUtils = EyesUtils.GeneralUtils;

    /**
     *
     * C'tor = initializes the module settings
     *
     * @constructor
     * @param {Object} remoteWebDriver
     * @param {Eyes} eyes An instance of Eyes
     * @param {Object} logger
     * @param {PromiseFactory} promiseFactory
     * @augments StdWin.Window
     **/
    function EyesStdWinWindow(remoteWebDriver, eyes, logger, promiseFactory) {
        this._eyes = eyes;
        this._logger = logger;
        this._promiseFactory = promiseFactory;
        this._defaultContentViewportSize = null;
        this.setRemoteWebBrowser(remoteWebDriver);
    }

    //noinspection JSUnusedGlobalSymbols
    EyesStdWinWindow.prototype.getEyes = function () {
        return this._eyes;
    };

    //noinspection JSUnusedGlobalSymbols
    EyesStdWinWindow.prototype.setEyes = function (eyes) {
        this._eyes = eyes;
    };

    //noinspection JSUnusedGlobalSymbols
    EyesStdWinWindow.prototype.getRemoteWebBrowser = function () {
        return this._browser;
    };

    //noinspection JSUnusedGlobalSymbols
    EyesStdWinWindow.prototype.setRemoteWebBrowser = function (remoteWebBrowser) {
        this._browser = remoteWebBrowser;
        GeneralUtils.mixin(this, remoteWebBrowser);
    };

    //noinspection JSUnusedGlobalSymbols
    EyesStdWinWindow.prototype.$ = function () {
        return this._browser.$.apply(this._browser, arguments);
    };

    //noinspection JSUnusedGlobalSymbols
    EyesStdWinWindow.prototype.$$ = function () {
        return this._browser.$$.apply(this._browser, arguments);
    };

    //noinspection JSUnusedGlobalSymbols
    EyesStdWinWindow.prototype.getUserAgent = function () {
        return this._promiseFactory.makePromise(function (resolve) {
            resolve("");
        })
    };

    /**
     * @param {boolean} forceQuery If true, we will perform the query even if we have a cached viewport size.
     * @return {Promise<{width: number, height: number}>} The viewport size of the default content (outer most frame).
     */
    EyesStdWinWindow.prototype.getDefaultContentViewportSize = function (forceQuery) {
        throw new Error("Unimplemented method getDefaultContentViewportSize!");
    };

    /**
     * @param {string} script
     * @returns {Promise.<*>}
     */
    EyesStdWinWindow.prototype.executeScript = function (script) {
        throw new Error("Unimplemented method executeScript!");
    };

    /**
     *
     * @return {String} Browser's session identity
     */
    EyesStdWinWindow.prototype.getSessionId = function () {
        throw new Error("Unimplemented method getSessionId!");
    };

    /**
     *
     * @return {Promise.<String>}
     */
    EyesStdWinWindow.prototype.getTitle = function () {
        return this._browser.windowTitleRegExp();
    };

    /**
     * @return {String} Base64 representation of this test object.
     */
    EyesStdWinWindow.prototype.takeScreenshot = function () {
        return this._browser.snapshot();
    };

    module.exports = {
        EyesStdWinWindow: EyesStdWinWindow
    };
}());


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

(function () {
    "use strict";

    var EyesUtils = __webpack_require__(0),
        EyesSDK = __webpack_require__(1),
        EyesLeanFTScreenshot = __webpack_require__(11).EyesLeanFTScreenshot;
    var RegionProvider = EyesSDK.RegionProvider,
        GeometryUtils = EyesUtils.GeometryUtils;

    /**
     * @param {Logger} logger
     * @param driver
     * @param {{left: number, top: number, width: number, height: number}} region
     * @param {CoordinatesType} coordinatesType
     * @augments RegionProvider
     * @constructor
     */
    function EyesRegionProvider(logger, driver, region, coordinatesType) {
        this._logger = logger;
        this._driver = driver;
        this._region = region || GeometryUtils.createRegion(0, 0, 0, 0);
        this._coordinatesType = coordinatesType || null;
    }

    EyesRegionProvider.prototype = new RegionProvider();
    EyesRegionProvider.prototype.constructor = EyesRegionProvider;

    /**
     * @return {{left: number, top: number, width: number, height: number}} A region with "as is" viewport coordinates.
     */
    EyesRegionProvider.prototype.getRegion = function () {
        return this._region;
    };

    /**
     * @param {MutableImage} image
     * @param {CoordinatesType} toCoordinatesType
     * @param {PromiseFactory} promiseFactory
     * @return {Promise<{left: number, top: number, width: number, height: number}>} A region in selected viewport coordinates.
     */
    EyesRegionProvider.prototype.getRegionInLocation = function (image, toCoordinatesType, promiseFactory) {
        var that = this;
        return promiseFactory.makePromise(function (resolve) {
            if (that._coordinatesType === toCoordinatesType) {
                resolve(that._region);
                return;
            }

            var screenshot = new EyesLeanFTScreenshot(that._logger, that._driver, image, promiseFactory);
            return screenshot.buildScreenshot().then(function () {
                var newRegion = screenshot.convertRegionLocation(that._region, that._coordinatesType, toCoordinatesType);
                resolve(newRegion);
            });
        });
    };

    /**
     * @return {CoordinatesType} The type of coordinates on which the region is based.
     */
    EyesRegionProvider.prototype.getCoordinatesType = function () {
        return this._coordinatesType;
    };

    module.exports = {
        EyesRegionProvider: EyesRegionProvider
    };

}());

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

(function () {
    'use strict';

    var EyesSDK = __webpack_require__(1),
        EyesUtils = __webpack_require__(0),
        ScrollPositionProvider = __webpack_require__(3).ScrollPositionProvider;
    var EyesScreenshot = EyesSDK.EyesScreenshot,
        CoordinatesType = EyesSDK.CoordinatesType,
        ArgumentGuard = EyesUtils.ArgumentGuard,
        GeneralUtils = EyesUtils.GeneralUtils,
        GeometryUtils = EyesUtils.GeometryUtils;

    /**
     * @readonly
     * @enum {number}
     */
    var ScreenshotType = {
        VIEWPORT: 1,
        ENTIRE_FRAME: 2
    };

    /**
     * @param {Object} logger A Logger instance.
     * @param {EyesWebBrowser} driver The web driver used to get the screenshot.
     * @param {Object} image The actual screenshot image.
     * @param {Object} promiseFactory
     * @augments EyesScreenshot
     * @constructor
     */
    function EyesLeanFTScreenshot(logger, driver, image, promiseFactory) {
        EyesScreenshot.call(this, image);

        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(driver, "driver");

        this._logger = logger;
        this._driver = driver;
        this._image = image;
        this._promiseFactory = promiseFactory;

        EyesScreenshot.call(this._image);
    }

    EyesLeanFTScreenshot.prototype = new EyesScreenshot();
    EyesLeanFTScreenshot.prototype.constructor = EyesLeanFTScreenshot;

    /**
     * @param {ScreenshotType} [screenshotType] The screenshot's type (e.g., viewport/full page).
     * @param {{x: number, y: number}} [frameLocationInScreenshot] The current frame's location in the screenshot.
     * @param {{width: number, height: number}} [frameSize] The full internal size of the frame.
     * @returns {Promise<void>}
     */
    EyesLeanFTScreenshot.prototype.buildScreenshot = function (screenshotType, frameLocationInScreenshot, frameSize) {
        var that = this, viewportSize, imageSize;
        var positionProvider = new ScrollPositionProvider(this._logger, this._driver, this._promiseFactory);

        return this._driver.getDefaultContentViewportSize(false).then(function (vs) {
            viewportSize = vs;
            return that._image.getSize();
        }).then(function (is) {
            imageSize = is;
            return positionProvider.getEntireSize();
        }).then(function (ppEs) {
            // If we're inside a frame, then the frame size is given by the frame
            // chain. Otherwise, it's the size of the entire page.
            if (!frameSize) {
                if (ppEs) {
                    frameSize = ppEs;
                } else {
                    frameSize = viewportSize;
                }
            }

            return positionProvider.getCurrentPosition();
        }).then(function (ppCp) {
            // Getting the scroll position. For native Appium apps we can't get the scroll position, so we use (0,0)
            if (ppCp) {
                that._currentFrameScrollPosition = ppCp;
            } else {
                that._currentFrameScrollPosition = GeometryUtils.createLocation(0, 0);
            }

            if (screenshotType === null) {
                if (imageSize.width <= viewportSize.width && imageSize.height <= viewportSize.height) {
                    screenshotType = ScreenshotType.VIEWPORT;
                } else {
                    screenshotType = ScreenshotType.ENTIRE_FRAME;
                }
            }
            that._screenshotType = screenshotType;

            // This is used for frame related calculations.
            if (!frameLocationInScreenshot) {
                frameLocationInScreenshot = GeometryUtils.createLocation(0, 0);
            }
            that._frameLocationInScreenshot = frameLocationInScreenshot;

            that._logger.verbose("Calculating frame window..");
            that._frameWindow = GeometryUtils.createRegionFromLocationAndSize(frameLocationInScreenshot, frameSize);
            GeometryUtils.intersect(that._frameWindow, GeometryUtils.createRegion(0, 0, imageSize.width, imageSize.height));
            if (that._frameWindow.width <= 0 || that._frameWindow.height <= 0) {
                throw new Error("Got empty frame window for screenshot!");
            }

            that._logger.verbose("EyesLeanFTScreenshot - Done!");
        });
    };

    /**
     * @return {{left: number, top: number, width: number, height: number}} The region of the frame which is available in the screenshot,
     * in screenshot coordinates.
     */
    EyesLeanFTScreenshot.prototype.getFrameWindow = function () {
        return this._frameWindow;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Returns a part of the screenshot based on the given region.
     *
     * @param {{left: number, top: number, width: number, height: number}} region The region for which we should get the sub screenshot.
     * @param {CoordinatesType} coordinatesType How should the region be calculated on the screenshot image.
     * @param {boolean} throwIfClipped Throw an EyesException if the region is not fully contained in the screenshot.
     * @return {Promise<EyesLeanFTScreenshot>} A screenshot instance containing the given region.
     */
    EyesLeanFTScreenshot.prototype.convertLocationFromRegion = function (region, coordinatesType, throwIfClipped) {
        this._logger.verbose("getSubScreenshot(", region, ", ", coordinatesType, ", ", throwIfClipped, ")");

        ArgumentGuard.notNull(region, "region");
        ArgumentGuard.notNull(coordinatesType, "coordinatesType");

        // We calculate intersection based on as-is coordinates.
        var asIsSubScreenshotRegion = this.getIntersectedRegion(region, coordinatesType, CoordinatesType.SCREENSHOT_AS_IS);

        var sizeFromRegion = GeometryUtils.createSizeFromRegion(region);
        var sizeFromSubRegion = GeometryUtils.createSizeFromRegion(asIsSubScreenshotRegion);
        if (GeometryUtils.isRegionEmpty(asIsSubScreenshotRegion) || (throwIfClipped &&
            !(sizeFromRegion.height === sizeFromSubRegion.height && sizeFromRegion.width === sizeFromSubRegion.width))) {
            throw new Error("Region ", region, ", (", coordinatesType, ") is out of screenshot bounds ", this._frameWindow);
        }

        var subScreenshotImage = this._image.cropImage(asIsSubScreenshotRegion);

        // The frame location in the sub screenshot is the negative of the
        // context-as-is location of the region.
        var contextAsIsRegionLocation = this.convertLocationFromLocation(GeometryUtils.createLocationFromRegion(asIsSubScreenshotRegion), CoordinatesType.SCREENSHOT_AS_IS, CoordinatesType.CONTEXT_AS_IS);

        var frameLocationInSubScreenshot = GeometryUtils.createLocation(-contextAsIsRegionLocation.x, -contextAsIsRegionLocation.y);

        var that = this, result = new EyesLeanFTScreenshot(this._logger, this._driver, subScreenshotImage, this._promiseFactory);
        return result.buildScreenshot(this._screenshotType, frameLocationInSubScreenshot, undefined).then(function () {
            that._logger.verbose("Done!");
            return result;
        });
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Converts a location's coordinates with the {@code from} coordinates type
     * to the {@code to} coordinates type.
     *
     * @param {{x: number, y: number}} location The location which coordinates needs to be converted.
     * @param {CoordinatesType} from The current coordinates type for {@code location}.
     * @param {CoordinatesType} to The target coordinates type for {@code location}.
     * @return {{x: number, y: number}} A new location which is the transformation of {@code location} to the {@code to} coordinates type.
     */
    EyesLeanFTScreenshot.prototype.convertLocationFromLocation = function (location, from, to) {
        ArgumentGuard.notNull(location, "location");
        ArgumentGuard.notNull(from, "from");
        ArgumentGuard.notNull(to, "to");

        var result = {x: location.x, y: location.y};

        if (from === to) {
            return result;
        }

        // If we're not inside a frame, and the screenshot is the entire
        // page, then the context as-is/relative are the same (notice
        // screenshot as-is might be different, e.g.,
        // if it is actually a sub-screenshot of a region).
        if (this._screenshotType === ScreenshotType.ENTIRE_FRAME) {
            if ((from === CoordinatesType.CONTEXT_RELATIVE
                || from === CoordinatesType.CONTEXT_AS_IS)
                && to === CoordinatesType.SCREENSHOT_AS_IS) {

                // If this is not a sub-screenshot, this will have no effect.
                result = GeometryUtils.locationOffset(result, this._frameLocationInScreenshot);

            } else if (from === CoordinatesType.SCREENSHOT_AS_IS && (to === CoordinatesType.CONTEXT_RELATIVE || to === CoordinatesType.CONTEXT_AS_IS)) {

                result = GeometryUtils.locationOffset(result, {
                    x: -this._frameLocationInScreenshot.x,
                    y: -this._frameLocationInScreenshot.y
                });
            }
            return result;
        }

        switch (from) {
            case CoordinatesType.CONTEXT_AS_IS:
                switch (to) {
                    case CoordinatesType.CONTEXT_RELATIVE:
                        result = GeometryUtils.locationOffset(result, this._currentFrameScrollPosition);
                        break;

                    case CoordinatesType.SCREENSHOT_AS_IS:
                        result = GeometryUtils.locationOffset(result, this._frameLocationInScreenshot);
                        break;

                    default:
                        throw new Error("Cannot convert from '" + from + "' to '" + to + "'");
                }
                break;

            case CoordinatesType.CONTEXT_RELATIVE:
                switch (to) {
                    case CoordinatesType.SCREENSHOT_AS_IS:
                        // First, convert context-relative to context-as-is.
                        result = GeometryUtils.locationOffset(result, {x: -this._currentFrameScrollPosition.x, y: -this._currentFrameScrollPosition.y});
                        // Now convert context-as-is to screenshot-as-is.
                        result = GeometryUtils.locationOffset(result, this._frameLocationInScreenshot);
                        break;

                    case CoordinatesType.CONTEXT_AS_IS:
                        result = GeometryUtils.locationOffset(result, {x: -this._currentFrameScrollPosition.x, y: -this._currentFrameScrollPosition.y});
                        break;

                    default:
                        throw new Error("Cannot convert from '" + from + "' to '" + to + "'");
                }
                break;

            case CoordinatesType.SCREENSHOT_AS_IS:
                switch (to) {
                    case CoordinatesType.CONTEXT_RELATIVE:
                        // First convert to context-as-is.
                        result = GeometryUtils.locationOffset(result, {
                            x: -this._frameLocationInScreenshot.x,
                            y: -this._frameLocationInScreenshot.y
                        });
                        // Now convert to context-relative.
                        result = GeometryUtils.locationOffset(result, {x: -this._currentFrameScrollPosition.x, y: -this._currentFrameScrollPosition.y});
                        break;

                    case CoordinatesType.CONTEXT_AS_IS:
                        result = GeometryUtils.locationOffset(result, {
                            x: -this._frameLocationInScreenshot.x,
                            y: -this._frameLocationInScreenshot.y
                        });
                        break;

                    default:
                        throw new Error("Cannot convert from '" + from + "' to '" + to + "'");
                }
                break;

            default:
                throw new Error("Cannot convert from '" + from + "' to '" + to + "'");
        }
        return result;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {{x: number, y: number}} location
     * @param {CoordinatesType} coordinatesType
     * @returns {{x: number, y: number}}
     */
    EyesLeanFTScreenshot.prototype.getLocationInScreenshot = function (location, coordinatesType) {
        this._location = this.convertLocationFromLocation(location, coordinatesType, CoordinatesType.SCREENSHOT_AS_IS);

        // Making sure it's within the screenshot bounds
        if (!GeometryUtils.isRegionContainsLocation(this._frameWindow, location)) {
            throw new Error("Location " + location + " ('" + coordinatesType + "') is not visible in screenshot!");
        }
        return this._location;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     *
     * @param {{left: number, top: number, width: number, height: number}} region
     * @param {CoordinatesType} originalCoordinatesType
     * @param {CoordinatesType} resultCoordinatesType
     * @returns {{left: number, top: number, width: number, height: number}}
     */
    EyesLeanFTScreenshot.prototype.getIntersectedRegion = function (region, originalCoordinatesType, resultCoordinatesType) {
        if (GeometryUtils.isRegionEmpty(region)) {
            return GeneralUtils.clone(region);
        }

        var intersectedRegion = this.convertRegionLocation(region, originalCoordinatesType, CoordinatesType.SCREENSHOT_AS_IS);

        switch (originalCoordinatesType) {
            // If the request was context based, we intersect with the frame
            // window.
            case CoordinatesType.CONTEXT_AS_IS:
            case CoordinatesType.CONTEXT_RELATIVE:
                GeometryUtils.intersect(intersectedRegion, this._frameWindow);
                break;

            // If the request is screenshot based, we intersect with the image
            case CoordinatesType.SCREENSHOT_AS_IS:
                GeometryUtils.intersect(intersectedRegion, GeometryUtils.createRegion(0, 0, this._image.width, this._image.height));
                break;

            default:
                throw new Error("Unknown coordinates type: '" + originalCoordinatesType + "'");
        }

        // If the intersection is empty we don't want to convert the
        // coordinates.
        if (GeometryUtils.isRegionEmpty(intersectedRegion)) {
            return intersectedRegion;
        }

        // Converting the result to the required coordinates type.
        intersectedRegion = this.convertRegionLocation(intersectedRegion, CoordinatesType.SCREENSHOT_AS_IS, resultCoordinatesType);

        return intersectedRegion;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Gets the elements region in the screenshot.
     *
     * @param {WebElement} element The element which region we want to intersect.
     * @return {Promise.<{left: number, top: number, width: number, height: number}>} The intersected region, in {@code SCREENSHOT_AS_IS} coordinates
     * type.
     */
    EyesLeanFTScreenshot.prototype.getIntersectedRegionFromElement = function (element) {
        ArgumentGuard.notNull(element, "element");

        var pl, ds;
        return element.getLocation().then(function (location) {
            pl = location;
            return element.getSize();
        }).then(function (size) {
            ds = size;

            // Since the element coordinates are in context relative
            var region = this.getIntersectedRegion(GeometryUtils.createRegionFromLocationAndSize(pl, ds), CoordinatesType.CONTEXT_RELATIVE, CoordinatesType.CONTEXT_RELATIVE);

            if (!GeometryUtils.isRegionEmpty(region)) {
                region = this.convertRegionLocation(region, CoordinatesType.CONTEXT_RELATIVE, CoordinatesType.SCREENSHOT_AS_IS);
            }

            return region;
        });
    };

    module.exports = {
        EyesLeanFTScreenshot: EyesLeanFTScreenshot
    };
}());

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

(function () {
    'use strict';

    var EyesUtils = __webpack_require__(0);
    var GeometryUtils = EyesUtils.GeometryUtils;

    /**
     * @typedef {{left: number, top: number, width: number, height: number}} Region
     * @typedef {{left: number, top: number, width: number, height: number,
     *            maxLeftOffset: number, maxRightOffset: number, maxUpOffset: number, maxDownOffset: number}} FloatingRegion
     * @typedef {{element: WebBaseDescription|WebBaseTestObject,
     *            maxLeftOffset: number, maxRightOffset: number, maxUpOffset: number, maxDownOffset: number}} FloatingElement
     */

    /**
     * @constructor
     **/
    function Target(region) {
        this._region = region;

        this._timeout = null;
        this._stitchContent = false;
        this._ignoreMismatch = false;
        this._matchLevel = null;
        this._ignoreCaret = null;
        this._ignoreRegions = [];
        this._floatingRegions = [];

        this._ignoreObjects = [];
        this._floatingObjects = [];
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {int} ms Milliseconds to wait
     * @return {Target}
     */
    Target.prototype.timeout = function (ms) {
        this._timeout = ms;
        return this;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {boolean} [stitchContent=true]
     * @return {Target}
     */
    Target.prototype.fully = function (stitchContent) {
        if (stitchContent !== false) {
            stitchContent = true;
        }

        this._stitchContent = stitchContent;
        return this;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {boolean} [ignoreMismatch=true]
     * @return {Target}
     */
    Target.prototype.ignoreMismatch = function (ignoreMismatch) {
        if (ignoreMismatch !== false) {
            ignoreMismatch = true;
        }

        this._ignoreMismatch = ignoreMismatch;
        return this;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {MatchLevel} matchLevel
     * @return {Target}
     */
    Target.prototype.matchLevel = function (matchLevel) {
        this._matchLevel = matchLevel;
        return this;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {boolean} [ignoreCaret=true]
     * @return {Target}
     */
    Target.prototype.ignoreCaret = function (ignoreCaret) {
        if (ignoreCaret !== false) {
            ignoreCaret = true;
        }

        this._ignoreCaret = ignoreCaret;
        return this;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {...(Region|WebBaseDescription|WebBaseTestObject|
     *          {element: (WebBaseDescription|WebBaseTestObject)})} ignoreRegion
     * @return {Target}
     */
    Target.prototype.ignore = function (ignoreRegion) {
        for (var i = 0, l = arguments.length; i < l; i++) {
            if (!arguments[i]) {
                throw new Error("Ignore region can't be null or empty.");
            }

            if (GeometryUtils.isRegion(arguments[i])) {
                this._ignoreRegions.push(arguments[i]);
            } else if (arguments[i].constructor.name === "Object" && "element" in arguments[i]) {
                this._ignoreObjects.push(arguments[i]);
            } else {
                this._ignoreObjects.push({element: arguments[i]});
            }
        }
        return this;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {...(FloatingRegion|FloatingElement)} floatingRegion
     * @return {Target}
     */
    Target.prototype.floating = function (floatingRegion) {
        for (var i = 0, l = arguments.length; i < l; i++) {
            if (!arguments[i]) {
                throw new Error("Floating region can't be null or empty.");
            }

            if (GeometryUtils.isRegion(arguments[i]) &&
                "maxLeftOffset" in arguments[i] && "maxRightOffset" in arguments[i] && "maxUpOffset" in arguments[i] && "maxDownOffset" in arguments[i]) {
                this._floatingRegions.push(arguments[i]);
            } else {
                this._floatingObjects.push(arguments[i]);
            }
        }
        return this;
    };

    /**
     * @returns {Region|WebBaseDescription|WebBaseTestObject|null}
     */
    Target.prototype.getRegion = function () {
        return this._region;
    };

    /**
     * @returns {boolean}
     */
    Target.prototype.isUsingRegion = function () {
        return !!this._region;
    };

    /**
     * @returns {int|null}
     */
    Target.prototype.getTimeout = function () {
        return this._timeout;
    };

    /**
     * @returns {boolean}
     */
    Target.prototype.getStitchContent = function () {
        return this._stitchContent;
    };

    /**
     * @returns {boolean}
     */
    Target.prototype.getIgnoreMismatch = function () {
        return this._ignoreMismatch;
    };

    /**
     * @returns {boolean}
     */
    Target.prototype.getMatchLevel = function () {
        return this._matchLevel;
    };

    /**
     * @returns {boolean|null}
     */
    Target.prototype.getIgnoreCaret = function () {
        return this._ignoreCaret;
    };

    /**
     * @returns {Region[]}
     */
    Target.prototype.getIgnoreRegions = function () {
        return this._ignoreRegions;
    };

    /**
     * @returns {{element: (WebBaseDescription|WebBaseTestObject)}[]}
     */
    Target.prototype.getIgnoreObjects = function () {
        return this._ignoreObjects;
    };

    /**
     * @returns {FloatingRegion[]}
     */
    Target.prototype.getFloatingRegions = function () {
        return this._floatingRegions;
    };

    /**
     * @returns {FloatingElement[]}
     */
    Target.prototype.getFloatingObjects = function () {
        return this._floatingObjects;
    };

    /**
     * Validate current window
     *
     * @return {Target}
     * @constructor
     */
    Target.window = function () {
        return new Target();
    };

    /**
     * Validate region using region's rect, element or element's locator
     *
     * @param {Region|WebBaseDescription|WebBaseTestObject} region The region to validate.
     * @return {Target}
     * @constructor
     */
    Target.region = function (region) {
        return new Target(region);
    };

    module.exports = {
        Target: Target
    };
}());


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports.CssTranslatePositionProvider = __webpack_require__(5).CssTranslatePositionProvider;
exports.ElementPositionProvider = __webpack_require__(6).ElementPositionProvider;
exports.Eyes = __webpack_require__(7).Eyes;
exports.StitchMode = __webpack_require__(7).Eyes.StitchMode;
exports.EyesRegionProvider = __webpack_require__(10).EyesRegionProvider;
exports.EyesWebTestObject = __webpack_require__(4).EyesWebTestObject;
exports.EyesWebBrowser = __webpack_require__(8).EyesWebBrowser;
exports.EyesStdWinWindow = __webpack_require__(9).EyesStdWinWindow;
exports.EyesLeanFTScreenshot = __webpack_require__(11).EyesLeanFTScreenshot;
exports.ScrollPositionProvider = __webpack_require__(3).ScrollPositionProvider;
exports.Target = __webpack_require__(12).Target;
var EyesSDK = __webpack_require__(1);
exports.ConsoleLogHandler = EyesSDK.ConsoleLogHandler;
exports.ContextBasedScaleProvider = EyesSDK.ContextBasedScaleProvider;
exports.ContextBasedScaleProviderFactory = EyesSDK.ContextBasedScaleProviderFactory;
exports.CoordinatesType = EyesSDK.CoordinatesType;
exports.CutProvider = EyesSDK.CutProvider;
exports.EyesScreenshot = EyesSDK.EyesScreenshot;
exports.FileLogHandler = EyesSDK.FileLogHandler;
exports.FixedCutProvider = EyesSDK.FixedCutProvider;
exports.FixedScaleProvider = EyesSDK.FixedScaleProvider;
exports.FixedScaleProviderFactory = EyesSDK.FixedScaleProviderFactory;
exports.Logger = EyesSDK.Logger;
exports.MatchLevel = EyesSDK.MatchLevel;
exports.ExactMatchSettings = EyesSDK.ExactMatchSettings;
exports.ImageMatchSettings = EyesSDK.ImageMatchSettings;
exports.MutableImage = EyesSDK.MutableImage;
exports.NullCutProvider = EyesSDK.NullCutProvider;
exports.NullLogHandler = EyesSDK.NullLogHandler;
exports.NullScaleProvider = EyesSDK.NullScaleProvider;
exports.PositionProvider = EyesSDK.PositionProvider;
exports.RegionProvider = EyesSDK.RegionProvider;
exports.RemoteSessionEventHandler = EyesSDK.RemoteSessionEventHandler;
exports.ScaleProvider = EyesSDK.ScaleProvider;
exports.ScaleProviderFactory = EyesSDK.ScaleProviderFactory;
exports.ScaleProviderIdentityFactory = EyesSDK.ScaleProviderIdentityFactory;
exports.SessionEventHandler = EyesSDK.SessionEventHandler;
exports.TestResultsFormatter = EyesSDK.TestResultsFormatter;
exports.FailureReport = EyesSDK.EyesBase.FailureReport;
exports.Triggers = EyesSDK.Triggers;
var EyesUtils = __webpack_require__(0);
exports.ArgumentGuard = EyesUtils.ArgumentGuard;
exports.GeneralUtils = EyesUtils.GeneralUtils;
exports.GeometryUtils = EyesUtils.GeometryUtils;
exports.ImageDeltaCompressor = EyesUtils.ImageDeltaCompressor;
exports.ImageUtils = EyesUtils.ImageUtils;
exports.PromiseFactory = EyesUtils.PromiseFactory;
exports.PropertyHandler = EyesUtils.PropertyHandler;
exports.SimplePropertyHandler = EyesUtils.SimplePropertyHandler;
exports.ReadOnlyPropertyHandler = EyesUtils.ReadOnlyPropertyHandler;
exports.StreamUtils = EyesUtils.StreamUtils;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("q");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("leanft.sdk.web");

/***/ })
/******/ ]);
});