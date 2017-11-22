'use strict';

/**
 * The result of a window match by the agent.
 */
class MatchResult {

    constructor() {
        this.asExpected = null;
        this.windowId = null;
        this.screenshot = null;
    }

    getAsExpected() {
        return this.asExpected;
    }

    setAsExpected(value) {
        this.asExpected = value;
    }

    getWindowId() {
        return this.windowId;
    }

    setWindowId(value) {
        this.windowId = value;
    }

    getScreenshot() {
        return this.screenshot;
    }

    setScreenshot(value) {
        this.screenshot = value;
    }
}

module.exports = MatchResult;
