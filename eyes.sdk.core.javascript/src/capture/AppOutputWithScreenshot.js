'use strict';

/**
 * A container for a AppOutput along with the screenshot used for creating it.
 * (We specifically avoid inheritance so we don't have to deal with serialization issues).
 */
class AppOutputWithScreenshot {

    /**
     * @param {AppOutput} appOutput
     * @param {EyesScreenshot} screenshot
     */
    constructor(appOutput, screenshot) {
        this._appOutput = appOutput;
        this.screenshot = screenshot;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Promise<AppOutput>}
     */
    getAppOutput() {
        return this._appOutput;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Promise<EyesScreenshot>}
     */
    getScreenshot() {
        return this.screenshot;
    }
}

module.exports = AppOutputWithScreenshot;
