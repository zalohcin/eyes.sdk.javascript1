(function () {
    "use strict";
    var EyesUtils = require('eyes.utils');
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
        this._promiseFactory.makePromise(function (resolve) {
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

    module.exports = EyesStdWinWindow;
}());
