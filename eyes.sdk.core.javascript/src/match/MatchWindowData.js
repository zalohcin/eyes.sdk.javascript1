'use strict';

const ArgumentGuard = require('../ArgumentGuard');

/**
 * Encapsulates the "Options" section of the MatchExpectedOutput body data.
 */
class Options {
    /**
     * @param {String} name The tag of the window to be matched.
     * @param {Trigger[]} userInputs A list of triggers between the previous matchWindow call and the current matchWindow call. Can be array of size 0, but MUST NOT be null.
     * @param {Boolean} ignoreMismatch Tells the server whether or not to store a mismatch for the current window as window in the session.
     * @param {Boolean} ignoreMatch Tells the server whether or not to store a match for the current window as window in the session.
     * @param {Boolean} forceMismatch Forces the server to skip the comparison process and mark the current window as a mismatch.
     * @param {Boolean} forceMatch Forces the server to skip the comparison process and mark the current window as a match.
     * @param {ImageMatchSettings} imageMatchSettings
     */
    constructor(name, userInputs, ignoreMismatch, ignoreMatch, forceMismatch, forceMatch, imageMatchSettings) {
        ArgumentGuard.notNull(userInputs, "userInputs");

        this._name = name;
        this._userInputs = userInputs;
        this._ignoreMismatch = ignoreMismatch;
        this._ignoreMatch = ignoreMatch;
        this._forceMismatch = forceMismatch;
        this._forceMatch = forceMatch;
        this._imageMatchSettings = imageMatchSettings;
    }

    getName() {
        return this._name;
    }

    getUserInputs() {
        return this._userInputs;
    }

    getIgnoreMismatch() {
        return this._ignoreMismatch;
    }

    getIgnoreMatch() {
        return this._ignoreMatch;
    }

    getForceMismatch() {
        return this._forceMismatch;
    }

    getForceMatch() {
        return this._forceMatch;
    }

    getImageMatchSettings() {
        return this._imageMatchSettings;
    }

    toJSON() {
        return {
            name: this._name,
            userInputs: this._userInputs,
            ignoreMismatch: this._ignoreMismatch,
            ignoreMatch: this._ignoreMatch,
            forceMismatch: this._forceMismatch,
            forceMatch: this._forceMatch,
            imageMatchSettings: this._imageMatchSettings
        };
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {String}
     */
    toString() {
        return `Options { ${JSON.stringify(this)} }`;
    }
}

/**
 * Encapsulates the data to be sent to the agent on a "matchWindow" command.
 */
class MatchWindowData {

    /**
     * @param {Trigger[]} userInputs A list of triggers between the previous matchWindow call and the current matchWindow call.
     *                      Can be array of size 0, but MUST NOT be null.
     * @param {AppOutput} appOutput The appOutput for the current matchWindow call.
     * @param {String} tag The tag of the window to be matched.
     * @param {Boolean} ignoreMismatch
     * @param {Options} options
     */
    constructor(userInputs, appOutput, tag, ignoreMismatch, options) {
        ArgumentGuard.notNull(userInputs, "userInputs");

        this._userInputs = userInputs;
        this._appOutput = appOutput;
        this._tag = tag;
        this._ignoreMismatch = ignoreMismatch;
        this._options = options;
    }

    getUserInputs() {
        return this._userInputs;
    }

    getAppOutput() {
        return this._appOutput;
    }

    getTag() {
        return this._tag;
    }

    getIgnoreMismatch() {
        return this._ignoreMismatch;
    }

    getOptions() {
        return this._options;
    }

    toJSON() {
        return {
            tag: this._tag,
            userInputs: this._userInputs,
            appOutput: this._appOutput,
            ignoreMismatch: this._ignoreMismatch,
            options: this._options
        };
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {String}
     */
    toString() {
        return `MatchWindowData { ${JSON.stringify(this)} }`;
    }
}

MatchWindowData.Options = Options;
module.exports = MatchWindowData;
