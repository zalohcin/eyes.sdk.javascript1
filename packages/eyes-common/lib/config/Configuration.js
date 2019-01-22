'use strict';

class Configuration {
  /**
   * @param {Configuration} [configuration]
   */
  constructor(configuration) {
    this._appName = undefined;
    this._testName = undefined;
    this._isDisabled = undefined;
    this._matchTimeout = undefined;
    this._sessionType = undefined;
    this._viewportSize = undefined;
    this._agentId = undefined;

    this._apiKey = process.env.APPLITOOLS_API_KEY;
    this._serverUrl = process.env.APPLITOOLS_SERVER_URL;
    this._proxy = undefined;

    this._showLogs = undefined;
    this._saveDebugData = undefined;

    this._batch = undefined;
    this._batchId = process.env.APPLITOOLS_BATCH_ID;
    this._batchName = process.env.APPLITOOLS_BATCH_NAME;

    this._properties = undefined;

    this._baselineEnvName = undefined;
    this._environmentName = undefined;

    this._branchName = process.env.APPLITOOLS_BRANCH;
    this._parentBranchName = process.env.APPLITOOLS_PARENT_BRANCH;
    this._baselineBranchName = process.env.APPLITOOLS_BASELINE_BRANCH;
    this._compareWithParentBranch = undefined;

    this._saveFailedTests = undefined;
    this._saveNewTests = undefined;
    this._ignoreBaseline = undefined;
    this._saveDiffs = undefined;

    this._matchLevel = undefined;
    this._ignore = undefined;
    this._strict = undefined;
    this._content = undefined;
    this._layout = undefined;
    this._floating = undefined;
    this._splitTopHeight = undefined;
    this._splitBottomHeight = undefined;
    this._ignoreCaret = undefined;
    this._scale = undefined;
    this._remainder = undefined;

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
   * @param {string} branchName
   */
  setBranchName(branchName) {
    this._branchName = branchName;
  }

  /**
   * @return {string}
   */
  getBranchName() {
    return this._branchName;
  }

  /**
   * @param {string} agentId
   */
  setAgentId(agentId) {
    this._agentId = agentId;
  }

  /**
   * @return {string}
   */
  getAgentId() {
    return this._agentId;
  }

  /**
   * @return {string}
   */
  getParentBranchName() {
    return this._parentBranchName;
  }

  /**
   * @param {string} parentBranchName
   */
  setParentBranchName(parentBranchName) {
    this._parentBranchName = parentBranchName;
  }

  /**
   * @return {string}
   */
  getBaselineBranchName() {
    return this._baselineBranchName;
  }

  /**
   * @param {string} baselineBranchName
   */
  setBaselineBranchName(baselineBranchName) {
    this._baselineBranchName = baselineBranchName;
  }

  /**
   * @return {string}
   */
  getBaselineEnvName() {
    return this._baselineEnvName;
  }

  /**
   * @param {string} baselineEnvName
   */
  setBaselineEnvName(baselineEnvName) {
    this._baselineEnvName = baselineEnvName;
  }

  /**
   * @return {string}
   */
  getEnvironmentName() {
    return this._environmentName;
  }

  /**
   * @param {string} environmentName
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
   * @return {string}
   */
  getAppName() {
    return this._appName;
  }

  /**
   * @param {string} appName
   */
  setAppName(appName) {
    this._appName = appName;
  }

  /**
   * @return {string}
   */
  getTestName() {
    return this._testName;
  }

  /**
   * @param {string} testName
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
