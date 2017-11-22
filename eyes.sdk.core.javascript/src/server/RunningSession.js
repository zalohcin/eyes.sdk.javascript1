'use strict';

const GeneralUtils = require('../GeneralUtils');

/**
 * Encapsulates data for the session currently running in the agent.
 */
class RunningSession {

    constructor() {
        this.isNewSession = false;
        this.id = null;
        this.url = null;
    }

    getIsNewSession() {
        return this.isNewSession;
    }

    setNewSession(value) {
        this.isNewSession = value;
    }

    getId() {
        return this.id;
    }

    // noinspection JSUnusedGlobalSymbols
    setId(value) {
        this.id = value;
    }

    getUrl() {
        return this.url;
    }

    // noinspection JSUnusedGlobalSymbols
    setUrl(value) {
        this.url = value;
    }

    toJSON() {
        return {
            id: this.id,
            url: this.url,
            isNewSession: this.isNewSession
        };
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {String}
     */
    toString() {
        return `RunningSession { ${GeneralUtils.toJson(this)} }`;
    }
}

module.exports = RunningSession;
