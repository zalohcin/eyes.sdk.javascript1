(function () {
    "use strict";
    var EyesUtils = require('eyes.utils'),
        EyesLeanFTUtils = require('./EyesLeanFTUtils'),
        EyesWebTestObject = require('./EyesWebTestObject'),
        ScrollPositionProvider = require('./ScrollPositionProvider');
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
        return this.executeScript("return navigator.userAgent");
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

    module.exports = EyesWebBrowser;
}());
