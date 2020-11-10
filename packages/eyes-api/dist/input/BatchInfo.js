"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeUtils = require("../utils/TypeUtils");
const ArgumentGuard = require("../utils/ArgumentGuard");
const GeneralUtils = require("./utils/GeneralUtils");
class BatchInfoData {
    constructor(batchOrName, startedAt, id) {
        if (TypeUtils.isString(batchOrName)) {
            return new BatchInfoData({ name: batchOrName, id, startedAt: new Date(startedAt) });
        }
        const batch = batchOrName || {};
        ArgumentGuard.isString(batch.id, { name: 'batch.id', strict: false });
        ArgumentGuard.isString(batch.name, { name: 'batch.batchName', strict: false });
        ArgumentGuard.isString(batch.sequenceName, { name: 'batch.sequenceName', strict: false });
        ArgumentGuard.isBoolean(batch.notifyOnCompletion, {
            name: 'batch.notifyOnCompletion',
            strict: false,
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
        this._sequenceName = batch.sequenceName || GeneralUtils.getEnvValue('BATCH_SEQUENCE');
        this._notifyOnCompletion = batch.notifyOnCompletion || GeneralUtils.getEnvValue('BATCH_NOTIFY', true) || false;
        this._isCompleted = Boolean(batch.isCompleted);
    }
    get id() {
        return this._id;
    }
    set id(id) {
        ArgumentGuard.notNull(id, { name: 'id' });
        this._id = id;
    }
    getId() {
        return this._id;
    }
    setId(id) {
        this.id = id;
        return this;
    }
    get isGeneratedId() {
        return this._isGeneratedId;
    }
    set isGeneratedId(isGeneratedId) {
        this._isGeneratedId = isGeneratedId;
    }
    getIsGeneratedId() {
        return this._isGeneratedId;
    }
    setIsGeneratedId(isGeneratedId) {
        this.isGeneratedId = isGeneratedId;
        return this;
    }
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
    getName() {
        return this._name;
    }
    setName(name) {
        this.name = name;
        return this;
    }
    get startedAt() {
        return this._startedAt;
    }
    set startedAt(startedAt) {
        this._startedAt = startedAt;
    }
    getStartedAt() {
        return this._startedAt;
    }
    setStartedAt(startedAt) {
        this.startedAt = new Date(startedAt);
        return this;
    }
    get sequenceName() {
        return this._sequenceName;
    }
    set sequenceName(sequenceName) {
        this._sequenceName = sequenceName;
    }
    getSequenceName() {
        return this._sequenceName;
    }
    setSequenceName(sequenceName) {
        this.sequenceName = sequenceName;
        return this;
    }
    get notifyOnCompletion() {
        return this._notifyOnCompletion;
    }
    set notifyOnCompletion(notifyOnCompletion) {
        this._notifyOnCompletion = notifyOnCompletion;
    }
    getNotifyOnCompletion() {
        return this._notifyOnCompletion;
    }
    setNotifyOnCompletion(notifyOnCompletion) {
        this.notifyOnCompletion = notifyOnCompletion;
        return this;
    }
    get isCompleted() {
        return this._isCompleted;
    }
    set isCompleted(isCompleted) {
        this._isCompleted = isCompleted;
    }
    getIsCompleted() {
        return this._isCompleted;
    }
    setIsCompleted(isCompleted) {
        this.isCompleted = isCompleted;
        return this;
    }
}
exports.default = BatchInfoData;
//# sourceMappingURL=BatchInfo.js.map