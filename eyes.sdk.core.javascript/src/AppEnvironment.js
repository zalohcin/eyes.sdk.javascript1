'use strict';

/**
 * The environment in which the application under test is executing.
 */
class AppEnvironment {

    /**
     * Creates a new AppEnvironment instance.
     *
     * @param {String} [os]
     * @param {String} [hostingApp]
     * @param {RectangleSize} [displaySize]
     */
    constructor(os, hostingApp, displaySize) {
        this._inferred = null;
        this._hostOS = os;
        this._hostApp = hostingApp;
        this._displaySize = displaySize;
    }

    /**
     * Creates a new AppEnvironment instance.
     *
     * @param {String} inferred
     * @return {AppEnvironment}
     */
    static fromInferred(inferred) {
        const env = new AppEnvironment();
        env.inferred = inferred;
        return env;
    }

    /**
     * Gets the information inferred from the execution environment or {@code null} if no information could be inferred.
     *
     * @return {String}
     */
    geInferred() {
        return this._inferred;
    }

    /**
     * Sets the inferred environment information.
     *
     * @param {String} value
     */
    setInferred(value) {
        this._inferred = value;
    }

    /**
     * Gets the OS hosting the application under test or {@code null} if unknown.
     *
     * @return {String}
     */
    getOs() {
        return this._hostOS;
    }

    /**
     * Sets the OS hosting the application under test or {@code null} if unknown.
     *
     * @param {String} value
     */
    setOs(value) {
        this._hostOS = value;
    }

    /**
     * Gets the application hosting the application under test or {@code null} if unknown.
     *
     * @return {String}
     */
    getHostingApp() {
        return this._hostApp;
    }

    /**
     * Sets the application hosting the application under test or {@code null} if unknown.
     *
     * @param {String} value
     */
    setHostingApp(value) {
        this._hostApp = value;
    }

    /**
     * Gets the display size of the application or {@code null} if unknown.
     *
     * @return {RectangleSize}
     */
    getDisplaySize() {
        return this._displaySize;
    }

    /**
     * Sets the display size of the application or {@code null} if unknown.
     *
     * @param {RectangleSize} value
     */
    setDisplaySize(value) {
        this._displaySize = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {String}
     */
    toString() {
        return `[os = ${this._hostOS} hostingApp = ${this._hostApp} displaySize = ${this._displaySize}]`;
    }
}

module.exports = AppEnvironment;
