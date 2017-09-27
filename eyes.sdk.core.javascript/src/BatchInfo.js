'use strict';

const ArgumentGuard = require('./ArgumentGuard');
const GeneralUtils = require('./GeneralUtils');

/**
 * A batch of tests.
 */
class BatchInfo {

    /**
     * Creates a new BatchInfo instance.
     * @param {String} [name] Name of batch or {@code null} if anonymous.
     * @param {Date} [startedAt] Batch start time, defaults to the current time.
     * @param {String} [id]
     */
    constructor(name = null, startedAt = new Date(), id = GeneralUtils.guid()) {
        ArgumentGuard.notNull(startedAt, "startedAt");

        this.id = id;
        this._name = name;
        this._startedAt = GeneralUtils.getIso8601Data(startedAt);
    }

    /**
     * @return {String} The id of the current batch.
     */
    getId() {
        return this.id;
    }

    /**
     * Sets a unique identifier for the batch. Sessions with batch info which includes the same ID will be grouped together.
     * @param {String} value The batch's ID
     */
    setId(value) {
        ArgumentGuard.notNullOrEmpty(value, "id");
        this.id = value;
    }

    /**
     * @return The name of the batch or {@code null} if anonymous.
     */
    getName() {
        return this._name;
    }

    /**
     * @return {Date} The batch start date and time in ISO 8601 format.
     */
    getStartedAt() {
        return new Date(this._startedAt);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {String}
     */
    toString() {
        return `'${this._name}' - ${this._startedAt}`;
    }
}

module.exports = BatchInfo;
