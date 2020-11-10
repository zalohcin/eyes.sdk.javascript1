"use strict";
exports.__esModule = true;
var TypeUtils = require("../utils/TypeUtils");
var ArgumentGuard = require("../utils/ArgumentGuard");
var GeneralUtils = require("../utils/GeneralUtils");
var BatchInfoData = /** @class */ (function () {
    function BatchInfoData(batchOrName, startedAt, id) {
        if (TypeUtils.isString(batchOrName)) {
            return new BatchInfoData({ name: batchOrName, id: id, startedAt: new Date(startedAt) });
        }
        var batch = batchOrName || {};
        ArgumentGuard.isString(batch.id, { name: 'batch.id', strict: false });
        ArgumentGuard.isString(batch.name, { name: 'batch.batchName', strict: false });
        ArgumentGuard.isString(batch.sequenceName, { name: 'batch.sequenceName', strict: false });
        ArgumentGuard.isBoolean(batch.notifyOnCompletion, {
            name: 'batch.notifyOnCompletion',
            strict: false
        });
        ArgumentGuard.isBoolean(batch.isCompleted, { name: 'batch.isCompleted', strict: false });
        ArgumentGuard.isBoolean(batch.isGeneratedId, { name: 'batch.isGeneratedId', strict: false });
        this._id = id || GeneralUtils.getEnvValue('BATCH_ID');
        if (this._id) {
            this._isGeneratedId = Boolean(batch.isGeneratedId);
        }
        else {
            this._isGeneratedId = true;
            this._id = GeneralUtils.guid();
        }
        this._name = name || GeneralUtils.getEnvValue('BATCH_NAME');
        if (batch.startedAt && !(batch.startedAt instanceof Date)) {
            ArgumentGuard.isString(startedAt, { name: 'batch.startedAt', strict: false });
            this._startedAt = new Date(startedAt);
        }
        else {
            this._startedAt = batch.startedAt || new Date();
        }
        this._sequenceName = batch.sequenceName || GeneralUtils.getEnvValue('BATCH_SEQUENCE', 'string');
        this._notifyOnCompletion = batch.notifyOnCompletion || GeneralUtils.getEnvValue('BATCH_NOTIFY', 'boolean') || false;
        this._isCompleted = Boolean(batch.isCompleted);
    }
    Object.defineProperty(BatchInfoData.prototype, "id", {
        /**
         * A unique identifier for the batch. Sessions with batch info which includes the same ID will be grouped
         * together.
         */
        get: function () {
            return this._id;
        },
        set: function (id) {
            ArgumentGuard.notNull(id, { name: 'id' });
            this._id = id;
        },
        enumerable: false,
        configurable: true
    });
    BatchInfoData.prototype.getId = function () {
        return this._id;
    };
    BatchInfoData.prototype.setId = function (id) {
        this.id = id;
        return this;
    };
    Object.defineProperty(BatchInfoData.prototype, "isGeneratedId", {
        get: function () {
            return this._isGeneratedId;
        },
        set: function (isGeneratedId) {
            this._isGeneratedId = isGeneratedId;
        },
        enumerable: false,
        configurable: true
    });
    BatchInfoData.prototype.getIsGeneratedId = function () {
        return this._isGeneratedId;
    };
    BatchInfoData.prototype.setIsGeneratedId = function (isGeneratedId) {
        this.isGeneratedId = isGeneratedId;
        return this;
    };
    Object.defineProperty(BatchInfoData.prototype, "name", {
        /**
         * The name of the batch or {@code null} if anonymous.
         */
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: false,
        configurable: true
    });
    BatchInfoData.prototype.getName = function () {
        return this._name;
    };
    BatchInfoData.prototype.setName = function (name) {
        this.name = name;
        return this;
    };
    Object.defineProperty(BatchInfoData.prototype, "startedAt", {
        /**
         * The batch start date.
         */
        get: function () {
            return this._startedAt;
        },
        set: function (startedAt) {
            this._startedAt = startedAt;
        },
        enumerable: false,
        configurable: true
    });
    BatchInfoData.prototype.getStartedAt = function () {
        return this._startedAt;
    };
    BatchInfoData.prototype.setStartedAt = function (startedAt) {
        this.startedAt = new Date(startedAt);
        return this;
    };
    Object.defineProperty(BatchInfoData.prototype, "sequenceName", {
        /**
         * The name of the sequence.
         */
        get: function () {
            return this._sequenceName;
        },
        set: function (sequenceName) {
            this._sequenceName = sequenceName;
        },
        enumerable: false,
        configurable: true
    });
    BatchInfoData.prototype.getSequenceName = function () {
        return this._sequenceName;
    };
    BatchInfoData.prototype.setSequenceName = function (sequenceName) {
        this.sequenceName = sequenceName;
        return this;
    };
    Object.defineProperty(BatchInfoData.prototype, "notifyOnCompletion", {
        /**
         * Indicate whether notification should be sent on this batch completion.
         */
        get: function () {
            return this._notifyOnCompletion;
        },
        set: function (notifyOnCompletion) {
            this._notifyOnCompletion = notifyOnCompletion;
        },
        enumerable: false,
        configurable: true
    });
    BatchInfoData.prototype.getNotifyOnCompletion = function () {
        return this._notifyOnCompletion;
    };
    BatchInfoData.prototype.setNotifyOnCompletion = function (notifyOnCompletion) {
        this.notifyOnCompletion = notifyOnCompletion;
        return this;
    };
    Object.defineProperty(BatchInfoData.prototype, "isCompleted", {
        get: function () {
            return this._isCompleted;
        },
        set: function (isCompleted) {
            this._isCompleted = isCompleted;
        },
        enumerable: false,
        configurable: true
    });
    BatchInfoData.prototype.getIsCompleted = function () {
        return this._isCompleted;
    };
    BatchInfoData.prototype.setIsCompleted = function (isCompleted) {
        this.isCompleted = isCompleted;
        return this;
    };
    return BatchInfoData;
}());
exports["default"] = BatchInfoData;
