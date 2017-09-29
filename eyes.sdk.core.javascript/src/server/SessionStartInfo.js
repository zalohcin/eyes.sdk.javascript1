'use strict';

const ArgumentGuard = require('../ArgumentGuard');

/**
 * Encapsulates data required to start session using the Session API.
 */
class SessionStartInfo {

    /**
     * @param {String} agentId
     * @param {SessionType} sessionType
     * @param {String} appIdOrName
     * @param {String} verId
     * @param {String} scenarioIdOrName
     * @param {BatchInfo} batchInfo
     * @param {String} baselineEnvName
     * @param {String} environmentName
     * @param {AppEnvironment} environment
     * @param {ImageMatchSettings} defaultMatchSettings
     * @param {String} branchName
     * @param {String} parentBranchName
     * @param {PropertyData[]} properties
     */
    constructor(agentId, sessionType, appIdOrName, verId, scenarioIdOrName, batchInfo, baselineEnvName, environmentName,
                environment, defaultMatchSettings, branchName, parentBranchName, properties) {
        ArgumentGuard.notNullOrEmpty(agentId, "agentId");
        ArgumentGuard.notNullOrEmpty(appIdOrName, "appIdOrName");
        ArgumentGuard.notNullOrEmpty(scenarioIdOrName, "scenarioIdOrName");
        ArgumentGuard.notNull(batchInfo, "batchInfo");
        ArgumentGuard.notNull(environment, "environment");
        ArgumentGuard.notNull(defaultMatchSettings, "defaultMatchSettings");

        this._agentId = agentId;
        this._sessionType = sessionType;
        this._appIdOrName = appIdOrName;
        this._verId = verId;
        this._scenarioIdOrName = scenarioIdOrName;
        this._batchInfo = batchInfo;
        this._baselineEnvName = baselineEnvName;
        this._environmentName = environmentName;
        this._environment = environment;
        this._defaultMatchSettings = defaultMatchSettings;
        this._branchName = branchName;
        this._parentBranchName = parentBranchName;
        this._properties = properties;
    }


    getAgentId() {
        return this._agentId;
    }

    getSessionType() {
        return this._sessionType;
    }

    getAppIdOrName() {
        return this._appIdOrName;
    }

    getVerId() {
        return this._verId;
    }

    getScenarioIdOrName() {
        return this._scenarioIdOrName;
    }

    getBatchInfo() {
        return this._batchInfo;
    }

    getBaselineEnvName() {
        return this._baselineEnvName;
    }

    getEnvironmentName() {
        return this._environmentName;
    }

    getEnvironment() {
        return this._environment;
    }

    getDefaultMatchSettings() {
        return this._defaultMatchSettings;
    }

    getBranchName() {
        return this._branchName;
    }

    getParentBranchName() {
        return this._parentBranchName;
    }

    getProperties() {
        return this._properties;
    }

    toJSON() {
        return {
            agentId: this._agentId,
            sessionType: this._sessionType,
            appIdOrName: this._appIdOrName,
            verId: this._verId,
            scenarioIdOrName: this._scenarioIdOrName,
            batchInfo: this._batchInfo,
            baselineEnvName: this._baselineEnvName,
            environmentName: this._environmentName,
            environment: this._environment,
            defaultMatchSettings: this._defaultMatchSettings,
            branchName: this._branchName,
            parentBranchName: this._parentBranchName,
            properties: this._properties
        };
    }

    toString() {
        return `SessionStartInfo { ${JSON.stringify(this)} }`;
    }
}

module.exports = SessionStartInfo;
