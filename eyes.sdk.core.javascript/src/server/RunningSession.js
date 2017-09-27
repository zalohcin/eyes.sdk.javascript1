'use strict';

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

    setId(value) {
        this.id = value;
    }

    getUrl() {
        return this.url;
    }

    setUrl(value) {
        this.url = value;
    }
}

module.exports = RunningSession;
