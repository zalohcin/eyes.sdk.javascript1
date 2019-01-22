'use strict';


const MIN_MATCH_TIMEOUT = 500;


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
   * Sets the API key of your applitools Eyes account.
   *
   * @param apiKey {string} The api key to be used.
   */
  setApiKey(apiKey) {
    this._apiKey = apiKey;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The currently set API key or {@code null} if no key is set.
   */
  getApiKey() {
    return this._apiKey;
  }

  /**
   * @param {boolean} compareWithParentBranch New compareWithParentBranch value, default is false
   */
  setCompareWithParentBranch(compareWithParentBranch) {
    this._compareWithParentBranch = compareWithParentBranch;
  }

  /**
   * @return {boolean} The currently compareWithParentBranch value
   */
  isCompareWithParentBranch() {
    return this._compareWithParentBranch;
  }

  /**
   * @param {boolean} ignoreBaseline New ignoreBaseline value, default is false
   */
  setIgnoreBaseline(ignoreBaseline) {
    this._ignoreBaseline = ignoreBaseline;
  }

  /**
   * @return {boolean} The currently ignoreBaseline value
   */
  isIgnoreBaseline() {
    return this._ignoreBaseline;
  }

  /**
   * Set whether or not new tests are saved by default.
   *
   * @param {boolean} saveNewTests True if new tests should be saved by default. False otherwise.
   */
  setSaveNewTests(saveNewTests) {
    this._saveNewTests = saveNewTests;
  }

  /**
   * @return {boolean} True if new tests are saved by default.
   */
  getSaveNewTests() {
    return this._saveNewTests;
  }

  /**
   * Set whether or not failed tests are saved by default.
   *
   * @param {boolean} saveFailedTests True if failed tests should be saved by default, false otherwise.
   */
  setSaveFailedTests(saveFailedTests) {
    this._saveFailedTests = saveFailedTests;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} True if failed tests are saved by default.
   */
  getSaveFailedTests() {
    return this._saveFailedTests;
  }

  /**
   * Sets the maximum time (in ms) a match operation tries to perform a match.
   * @param {number} ms Total number of ms to wait for a match.
   */
  setMatchTimeout(ms) {
    if (ms !== 0 && MIN_MATCH_TIMEOUT > ms) {
      throw new TypeError(`Match timeout must be set in milliseconds, and must be > ${MIN_MATCH_TIMEOUT}`);
    }

    this._matchTimeout = ms;
  }

  /**
   * @return {number} The maximum time in ms {@link #checkWindowBase(RegionProvider, string, boolean, number)} waits
   *   for a match.
   */
  getMatchTimeout() {
    return this._matchTimeout;
  }

  /**
   * The test-wide match level to use when checking application screenshot with the expected output.
   *
   * @param {MatchLevel} matchLevel The test-wide match level to use when checking application screenshot with the
   *   expected output.
   */
  setMatchLevel(matchLevel) {
    this._matchLevel = matchLevel;
  }

  /**
   * @return {MatchLevel} The test-wide match level.
   */
  getMatchLevel() {
    return this._matchLevel;
  }

  /**
   * Sets the ignore blinking caret value.
   *
   * @param {boolean} value The ignore value.
   */
  setIgnoreCaret(value) {
    this._ignoreCaret = value;
  }

  /**
   * @return {boolean} Whether to ignore or the blinking caret or not when comparing images.
   */
  getIgnoreCaret() {
    return this._ignoreCaret;
  }

  /**
   * @param isDisabled {boolean} If true, all interactions with this API will be silently ignored.
   */
  setIsDisabled(isDisabled) {
    this._isDisabled = isDisabled;
  }

  /**
   * @return {boolean} Whether eyes is disabled.
   */
  getIsDisabled() {
    return this._isDisabled;
  }

  /**
   * @return {boolean} Whether eyes is disabled.
   */
  isDisabled() {
    return this._isDisabled;
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
