'use strict';

class Configuration {
  /**
   * @param {Configuration} [configuration]
   */
  constructor(configuration) {
    this._batch = undefined;
    this._branchName = process.env.APPLITOOLS_BRANCH;
    this._parentBranchName = process.env.APPLITOOLS_PARENT_BRANCH;
    this._baselineBranchName = process.env.APPLITOOLS_BASELINE_BRANCH;
    this._agentId = undefined;
    this._baselineEnvName = undefined;
    this._environmentName = undefined;
    this._saveDiffs = undefined;
    this._appName = undefined;
    this._testName = undefined;
    this._viewportSize = undefined;
    this._sessionType = undefined;

    if (configuration) {
      this._batch = configuration.getBatch();
      this._branchName = configuration.getBranchName();
      this._parentBranchName = configuration.getParentBranchName();
      this._baselineBranchName = configuration.getBaselineBranchName();
      this._agentId = configuration.getAgentId();
      this._baselineEnvName = configuration.getBaselineEnvName();
      this._environmentName = configuration.getEnvironmentName();
      this._saveDiffs = configuration.getSaveDiffs();
      this._appName = configuration.getAppName();
      this._testName = configuration.getTestName();
      this._viewportSize = configuration.getViewportSize();
      this._sessionType = configuration.getSessionType();
    }
  }

  /**
   * @param {BatchInfo} batch
   */
  setBatch(batch) {
    this._batch = batch;
  }

  /**
   * @return {BatchInfo}
   */
  getBatch() {
    return this._batch;
  }

  /**
   * @param {String} branchName
   */
  setBranchName(branchName) {
    this._branchName = branchName;
  }

  /**
   * @return {String}
   */
  getBranchName() {
    return this._branchName;
  }

  /**
   * @param {String} agentId
   */
  setAgentId(agentId) {
    this._agentId = agentId;
  }

  /**
   * @return {String}
   */
  getAgentId() {
    return this._agentId;
  }

  /**
   * @return {String}
   */
  getParentBranchName() {
    return this._parentBranchName;
  }

  /**
   * @param {String} parentBranchName
   */
  setParentBranchName(parentBranchName) {
    this._parentBranchName = parentBranchName;
  }

  /**
   * @return {String}
   */
  getBaselineBranchName() {
    return this._baselineBranchName;
  }

  /**
   * @param {String} baselineBranchName
   */
  setBaselineBranchName(baselineBranchName) {
    this._baselineBranchName = baselineBranchName;
  }

  /**
   * @return {String}
   */
  getBaselineEnvName() {
    return this._baselineEnvName;
  }

  /**
   * @param {String} baselineEnvName
   */
  setBaselineEnvName(baselineEnvName) {
    this._baselineEnvName = baselineEnvName;
  }

  /**
   * @return {String}
   */
  getEnvironmentName() {
    return this._environmentName;
  }

  /**
   * @param {String} environmentName
   */
  setEnvironmentName(environmentName) {
    this._environmentName = environmentName;
  }

  /**
   * @return {boolean}
   */
  getSaveDiffs() {
    return this._saveDiffs;
  }

  /**
   * @param {boolean} saveDiffs
   */
  setSaveDiffs(saveDiffs) {
    this._saveDiffs = saveDiffs;
  }

  /**
   * @return {String}
   */
  getAppName() {
    return this._appName;
  }

  /**
   * @param {String} appName
   */
  setAppName(appName) {
    this._appName = appName;
  }

  /**
   * @return {String}
   */
  getTestName() {
    return this._testName;
  }

  /**
   * @param {String} testName
   */
  setTestName(testName) {
    this._testName = testName;
  }

  /**
   * @return {RectangleSize}
   */
  getViewportSize() {
    return this._viewportSize;
  }

  /**
   * @param {RectangleSize} viewportSize
   */
  setViewportSize(viewportSize) {
    this._viewportSize = viewportSize;
  }

  /**
   * @return {SessionType}
   */
  getSessionType() {
    return this._sessionType;
  }

  /**
   * @param {SessionType} sessionType
   */
  setSessionType(sessionType) {
    this._sessionType = sessionType;
  }

  /**
   * @return {Configuration}
   */
  cloneConfig() {
    return new Configuration(this);
  }
}

exports.Configuration = Configuration;
