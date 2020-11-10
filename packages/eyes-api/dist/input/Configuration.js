"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArgumentGuard = require("../utils/ArgumentGuard");
const TypeUtils = require("../utils/TypeUtils");
const StitchMode_1 = require("../enums/StitchMode");
const BrowserName_1 = require("../enums/BrowserName");
const ScreenOrientation_1 = require("../enums/ScreenOrientation");
const RectangleSize_1 = require("./RectangleSize");
const ProxySettings_1 = require("./ProxySettings");
const BatchInfo_1 = require("./BatchInfo");
const CustomProperty_1 = require("./CustomProperty");
const ImageMatchSettings_1 = require("./ImageMatchSettings");
class ConfigurationData {
    constructor(config) {
        if (!config)
            return this;
        const self = this;
        for (const [key, value] of Object.entries(config)) {
            if (key in this && !key.startsWith('_')) {
                self[key] = value;
            }
        }
    }
    get showLogs() {
        return this._showLogs;
    }
    set showLogs(showLogs) {
        ArgumentGuard.isBoolean(showLogs, { name: 'showLogs' });
        this._showLogs = showLogs;
    }
    getShowLogs() {
        return this._showLogs;
    }
    setShowLogs(showLogs) {
        this.showLogs = showLogs;
        return this;
    }
    get appName() {
        return this._appName;
    }
    set appName(appName) {
        ArgumentGuard.isString(appName, { name: 'appName', strict: false });
        this._appName = appName;
    }
    getAppName() {
        return this._appName;
    }
    setAppName(appName) {
        this.appName = appName;
        return this;
    }
    get testName() {
        return this._testName;
    }
    set testName(testName) {
        ArgumentGuard.isString(testName, { name: 'testName', strict: false });
        this._testName = testName;
    }
    getTestName() {
        return this._testName;
    }
    setTestName(testName) {
        this.testName = testName;
        return this;
    }
    get displayName() {
        return this._displayName;
    }
    set displayName(displayName) {
        ArgumentGuard.isString(displayName, { name: 'displayName', strict: false });
        this._displayName = displayName;
    }
    getDisplayName() {
        return this._displayName;
    }
    setDisplayName(displayName) {
        this.displayName = displayName;
        return this;
    }
    get isDisabled() {
        return this._isDisabled;
    }
    set isDisabled(isDisabled) {
        ArgumentGuard.isBoolean(isDisabled, { name: 'isDisabled', strict: false });
        this._isDisabled = isDisabled;
    }
    getIsDisabled() {
        return this._isDisabled;
    }
    setIsDisabled(isDisabled) {
        this.isDisabled = isDisabled;
        return this;
    }
    get matchTimeout() {
        return this._matchTimeout;
    }
    set matchTimeout(matchTimeout) {
        ArgumentGuard.isInteger(matchTimeout, { name: 'matchTimeout', gt: 500 });
        this._matchTimeout = matchTimeout;
    }
    getMatchTimeout() {
        return this._matchTimeout;
    }
    setMatchTimeout(matchTimeout) {
        this.matchTimeout = matchTimeout;
        return this;
    }
    get sessionType() {
        return this._sessionType;
    }
    set sessionType(sessionType) {
        this._sessionType = sessionType;
    }
    getSessionType() {
        return this._sessionType;
    }
    setSessionType(sessionType) {
        this.sessionType = sessionType;
        return this;
    }
    get viewportSize() {
        return this._viewportSize;
    }
    set viewportSize(viewportSize) {
        if (!viewportSize)
            this._viewportSize = undefined;
        this._viewportSize = new RectangleSize_1.default(viewportSize);
    }
    getViewportSize() {
        return this._viewportSize;
    }
    setViewportSize(viewportSize) {
        this.viewportSize = viewportSize;
        return this;
    }
    get agentId() {
        return this._agentId;
    }
    set agentId(agentId) {
        ArgumentGuard.isString(agentId, { name: 'agentId' });
        this._agentId = agentId;
    }
    getAgentId() {
        return this._agentId;
    }
    setAgentId(agentId) {
        this.agentId = agentId;
        return this;
    }
    get apiKey() {
        return this._apiKey;
    }
    set apiKey(apiKey) {
        ArgumentGuard.isString(apiKey, { name: 'apiKey', alpha: true, numeric: true });
        this._apiKey = apiKey;
    }
    getApiKey() {
        return this._apiKey;
    }
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        return this;
    }
    get serverUrl() {
        return this._serverUrl;
    }
    set serverUrl(serverUrl) {
        ArgumentGuard.isString(serverUrl, { name: 'serverUrl', strict: false });
        this._serverUrl = serverUrl;
    }
    getServerUrl() {
        return this._serverUrl;
    }
    setServerUrl(serverUrl) {
        this.serverUrl = serverUrl;
        return this;
    }
    get proxy() {
        return this._proxy;
    }
    set proxy(proxy) {
        if (!proxy)
            this._proxy = undefined;
        this._proxy = new ProxySettings_1.default(proxy);
    }
    getProxy() {
        return this._proxy;
    }
    setProxy(proxyOrUrlOrIsDisabled, username, password, isHttpOnly) {
        if (proxyOrUrlOrIsDisabled === true) {
            this.proxy = undefined;
        }
        else if (TypeUtils.isString(proxyOrUrlOrIsDisabled)) {
            this.proxy = { url: proxyOrUrlOrIsDisabled, username, password, isHttpOnly };
        }
        else {
            this.proxy = proxyOrUrlOrIsDisabled;
        }
        return this;
    }
    get connectionTimeout() {
        return this._connectionTimeout;
    }
    set connectionTimeout(connectionTimeout) {
        ArgumentGuard.isInteger(connectionTimeout, { name: 'connectionTimeout', gte: 0 });
        this._connectionTimeout = connectionTimeout;
    }
    getConnectionTimeout() {
        return this._connectionTimeout;
    }
    setConnectionTimeout(connectionTimeout) {
        this.connectionTimeout = connectionTimeout;
        return this;
    }
    get removeSession() {
        return this._removeSession;
    }
    set removeSession(removeSession) {
        ArgumentGuard.isBoolean(removeSession, { name: 'removeSession' });
        this._removeSession = removeSession;
    }
    getRemoveSession() {
        return this._removeSession;
    }
    setRemoveSession(removeSession) {
        this.removeSession = removeSession;
        return this;
    }
    get batch() {
        return this._batch;
    }
    set batch(batch) {
        if (!batch)
            this._batch = undefined;
        this._batch = new BatchInfo_1.default(batch);
    }
    getBatch() {
        return this._batch;
    }
    setBatch(batch) {
        this.batch = batch;
        return this;
    }
    get properties() {
        return this._properties;
    }
    set properties(properties) {
        ArgumentGuard.isArray(properties, { name: 'properties' });
        this._properties = properties.map((prop) => new CustomProperty_1.default(prop));
    }
    getProperties() {
        return this._properties;
    }
    setProperties(properties) {
        this.properties = properties;
        return this;
    }
    addProperty(propOrName, value) {
        const prop = TypeUtils.isString(propOrName)
            ? new CustomProperty_1.default({ name: propOrName, value })
            : new CustomProperty_1.default(propOrName);
        this._properties.push(prop);
        return this;
    }
    get baselineEnvName() {
        return this._baselineEnvName;
    }
    set baselineEnvName(baselineEnvName) {
        ArgumentGuard.isString(baselineEnvName, { name: 'baselineEnvName', strict: false });
        this._baselineEnvName = baselineEnvName ? baselineEnvName.trim() : undefined;
    }
    getBaselineEnvName() {
        return this._baselineEnvName;
    }
    setBaselineEnvName(baselineEnvName) {
        this.baselineEnvName = baselineEnvName;
        return this;
    }
    get environmentName() {
        return this._environmentName;
    }
    set environmentName(environmentName) {
        ArgumentGuard.isString(environmentName, { name: 'environmentName', strict: false });
        this._environmentName = environmentName ? environmentName.trim() : undefined;
    }
    getEnvironmentName() {
        return this._environmentName;
    }
    setEnvironmentName(environmentName) {
        this.environmentName = environmentName;
        return this;
    }
    get branchName() {
        return this._branchName;
    }
    set branchName(branchName) {
        ArgumentGuard.isString(branchName, { name: 'branchName' });
        this._branchName = branchName;
    }
    getBranchName() {
        return this._branchName;
    }
    setBranchName(branchName) {
        this.branchName = branchName;
        return this;
    }
    get parentBranchName() {
        return this._parentBranchName;
    }
    set parentBranchName(parentBranchName) {
        ArgumentGuard.isString(parentBranchName, { name: 'parentBranchName' });
        this._parentBranchName = parentBranchName;
    }
    getParentBranchName() {
        return this._parentBranchName;
    }
    setParentBranchName(parentBranchName) {
        this.parentBranchName = parentBranchName;
        return this;
    }
    get baselineBranchName() {
        return this._baselineBranchName;
    }
    set baselineBranchName(baselineBranchName) {
        ArgumentGuard.isString(baselineBranchName, { name: 'baselineBranchName' });
        this._baselineBranchName = baselineBranchName;
    }
    getBaselineBranchName() {
        return this._baselineBranchName;
    }
    setBaselineBranchName(baselineBranchName) {
        this.baselineBranchName = baselineBranchName;
        return this;
    }
    get compareWithParentBranch() {
        return this._compareWithParentBranch;
    }
    set compareWithParentBranch(compareWithParentBranch) {
        ArgumentGuard.isBoolean(compareWithParentBranch, { name: 'compareWithParentBranch' });
        this._compareWithParentBranch = compareWithParentBranch;
    }
    getCompareWithParentBranch() {
        return this._compareWithParentBranch;
    }
    setCompareWithParentBranch(compareWithParentBranch) {
        this.compareWithParentBranch = compareWithParentBranch;
        return this;
    }
    get ignoreBaseline() {
        return this._ignoreBaseline;
    }
    set ignoreBaseline(ignoreBaseline) {
        ArgumentGuard.isBoolean(ignoreBaseline, { name: 'ignoreBaseline' });
        this._ignoreBaseline = ignoreBaseline;
    }
    getIgnoreBaseline() {
        return this._ignoreBaseline;
    }
    setIgnoreBaseline(ignoreBaseline) {
        this.ignoreBaseline = ignoreBaseline;
        return this;
    }
    get saveFailedTests() {
        return this._saveFailedTests;
    }
    set saveFailedTests(saveFailedTests) {
        ArgumentGuard.isBoolean(saveFailedTests, { name: 'saveFailedTests' });
        this._saveFailedTests = saveFailedTests;
    }
    getSaveFailedTests() {
        return this._saveFailedTests;
    }
    setSaveFailedTests(saveFailedTests) {
        this.saveFailedTests = saveFailedTests;
        return this;
    }
    get saveNewTests() {
        return this._saveNewTests;
    }
    set saveNewTests(saveNewTests) {
        ArgumentGuard.isBoolean(saveNewTests, { name: 'saveNewTests' });
        this._saveNewTests = saveNewTests;
    }
    getSaveNewTests() {
        return this._saveNewTests;
    }
    setSaveNewTests(saveNewTests) {
        this.saveNewTests = saveNewTests;
        return this;
    }
    get saveDiffs() {
        return this._saveDiffs;
    }
    set saveDiffs(saveDiffs) {
        ArgumentGuard.isBoolean(saveDiffs, { name: 'saveDiffs' });
        this._saveDiffs = saveDiffs;
    }
    getSaveDiffs() {
        return this._saveDiffs;
    }
    setSaveDiffs(saveDiffs) {
        this.saveDiffs = saveDiffs;
        return this;
    }
    get sendDom() {
        return this._sendDom;
    }
    set sendDom(sendDom) {
        ArgumentGuard.isBoolean(sendDom, { name: 'sendDom' });
        this._sendDom = sendDom;
    }
    getSendDom() {
        return this._sendDom;
    }
    setSendDom(sendDom) {
        this.sendDom = sendDom;
        return this;
    }
    get hostApp() {
        return this._hostApp;
    }
    set hostApp(hostApp) {
        this._hostApp = hostApp ? hostApp.trim() : undefined;
    }
    getHostApp() {
        return this._hostApp;
    }
    setHostApp(hostApp) {
        this.hostApp = hostApp;
        return this;
    }
    get hostOS() {
        return this._hostOS;
    }
    set hostOS(hostOS) {
        this._hostOS = hostOS ? hostOS.trim() : undefined;
    }
    getHostOS() {
        return this._hostOS;
    }
    setHostOS(hostOS) {
        this.hostOS = hostOS;
        return this;
    }
    get hostAppInfo() {
        return this._hostAppInfo;
    }
    set hostAppInfo(hostAppInfo) {
        this._hostAppInfo = hostAppInfo ? hostAppInfo.trim() : undefined;
    }
    getHostAppInfo() {
        return this._hostAppInfo;
    }
    setHostAppInfo(hostAppInfo) {
        this.hostAppInfo = hostAppInfo;
        return this;
    }
    get hostOSInfo() {
        return this._hostOSInfo;
    }
    set hostOSInfo(hostOSInfo) {
        this._hostOSInfo = hostOSInfo ? hostOSInfo.trim() : undefined;
    }
    getHostOSInfo() {
        return this.hostOSInfo;
    }
    setHostOSInfo(hostOSInfo) {
        this.hostOSInfo = hostOSInfo;
        return this;
    }
    get deviceInfo() {
        return this._deviceInfo;
    }
    set deviceInfo(deviceInfo) {
        this._deviceInfo = deviceInfo ? deviceInfo.trim() : undefined;
    }
    getDeviceInfo() {
        return this._deviceInfo;
    }
    setDeviceInfo(deviceInfo) {
        this.deviceInfo = deviceInfo;
        return this;
    }
    get defaultMatchSettings() {
        return this._defaultMatchSettings;
    }
    set defaultMatchSettings(defaultMatchSettings) {
        ArgumentGuard.notNull(defaultMatchSettings, { name: 'defaultMatchSettings' });
        this._defaultMatchSettings = new ImageMatchSettings_1.default(defaultMatchSettings);
    }
    getDefaultMatchSettings() {
        return this._defaultMatchSettings;
    }
    setDefaultMatchSettings(defaultMatchSettings) {
        this.defaultMatchSettings = defaultMatchSettings;
        return this;
    }
    getMatchLevel() {
        return this._defaultMatchSettings.matchLevel;
    }
    setMatchLevel(matchLevel) {
        this._defaultMatchSettings.matchLevel = matchLevel;
        return this;
    }
    getAccessibilityValidation() {
        return this._defaultMatchSettings.accessibilitySettings;
    }
    setAccessibilityValidation(accessibilityValidation) {
        this._defaultMatchSettings.accessibilitySettings = accessibilityValidation;
        return this;
    }
    getUseDom() {
        return this._defaultMatchSettings.useDom;
    }
    setUseDom(useDom) {
        this._defaultMatchSettings.useDom = useDom;
        return this;
    }
    getEnablePatterns() {
        return this._defaultMatchSettings.enablePatterns;
    }
    setEnablePatterns(enablePatterns) {
        this._defaultMatchSettings.enablePatterns = enablePatterns;
        return this;
    }
    getIgnoreDisplacements() {
        return this._defaultMatchSettings.ignoreDisplacements;
    }
    setIgnoreDisplacements(ignoreDisplacements) {
        this._defaultMatchSettings.ignoreDisplacements = ignoreDisplacements;
        return this;
    }
    getIgnoreCaret() {
        return this._defaultMatchSettings.ignoreCaret;
    }
    setIgnoreCaret(ignoreCaret) {
        this._defaultMatchSettings.ignoreCaret = ignoreCaret;
        return this;
    }
    get forceFullPageScreenshot() {
        return this._forceFullPageScreenshot;
    }
    set forceFullPageScreenshot(forceFullPageScreenshot) {
        this._forceFullPageScreenshot = forceFullPageScreenshot;
    }
    getForceFullPageScreenshot() {
        return this._forceFullPageScreenshot;
    }
    setForceFullPageScreenshot(forceFullPageScreenshot) {
        this.forceFullPageScreenshot = forceFullPageScreenshot;
        return this;
    }
    get waitBeforeScreenshots() {
        return this._waitBeforeScreenshots;
    }
    set waitBeforeScreenshots(waitBeforeScreenshots) {
        ArgumentGuard.isInteger(waitBeforeScreenshots, { name: 'waitBeforeScreenshots', gt: 0 });
        this._waitBeforeScreenshots = waitBeforeScreenshots;
    }
    getWaitBeforeScreenshots() {
        return this._waitBeforeScreenshots;
    }
    setWaitBeforeScreenshots(waitBeforeScreenshots) {
        this.waitBeforeScreenshots = waitBeforeScreenshots;
        return this;
    }
    get stitchMode() {
        return this._stitchMode;
    }
    set stitchMode(stitchMode) {
        ArgumentGuard.isEnumValue(stitchMode, StitchMode_1.default, { name: 'stitchMode' });
        this._stitchMode = stitchMode;
    }
    getStitchMode() {
        return this._stitchMode;
    }
    setStitchMode(stitchMode) {
        this.stitchMode = stitchMode;
        return this;
    }
    get hideScrollbars() {
        return this._hideScrollbars;
    }
    set hideScrollbars(hideScrollbars) {
        this._hideScrollbars = hideScrollbars;
    }
    getHideScrollbars() {
        return this._hideScrollbars;
    }
    setHideScrollbars(hideScrollbars) {
        this.hideScrollbars = hideScrollbars;
        return this;
    }
    get hideCaret() {
        return this._hideCaret;
    }
    set hideCaret(hideCaret) {
        this._hideCaret = hideCaret;
    }
    getHideCaret() {
        return this._hideCaret;
    }
    setHideCaret(hideCaret) {
        this.hideCaret = hideCaret;
        return this;
    }
    get stitchOverlap() {
        return this._stitchOverlap;
    }
    set stitchOverlap(stitchOverlap) {
        ArgumentGuard.isInteger(stitchOverlap, { name: 'stitchOverlap', strict: false });
        this._stitchOverlap = stitchOverlap;
    }
    getStitchOverlap() {
        return this._stitchOverlap;
    }
    setStitchOverlap(stitchOverlap) {
        this.stitchOverlap = stitchOverlap;
        return this;
    }
    get concurrentSessions() {
        return this._concurrentSessions;
    }
    set concurrentSessions(concurrentSessions) {
        this._concurrentSessions = concurrentSessions;
    }
    getConcurrentSessions() {
        return this._concurrentSessions;
    }
    setConcurrentSessions(concurrentSessions) {
        this.concurrentSessions = concurrentSessions;
        return this;
    }
    get isThrowExceptionOn() {
        return this._isThrowExceptionOn;
    }
    set isThrowExceptionOn(isThrowExceptionOn) {
        this._isThrowExceptionOn = isThrowExceptionOn;
    }
    getIsThrowExceptionOn() {
        return this._isThrowExceptionOn;
    }
    setIsThrowExceptionOn(isThrowExceptionOn) {
        this.isThrowExceptionOn = isThrowExceptionOn;
        return this;
    }
    get browsersInfo() {
        return this._browsersInfo;
    }
    set browsersInfo(browsersInfo) {
        ArgumentGuard.isArray(browsersInfo, { name: 'browsersInfo' });
        this._browsersInfo = browsersInfo;
    }
    getBrowsersInfo() {
        return this.browsersInfo;
    }
    setBrowsersInfo(browsersInfo) {
        this.browsersInfo = browsersInfo;
        return this;
    }
    addBrowsers(...browsersInfo) {
        for (const [index, browserInfo] of browsersInfo.entries()) {
            ArgumentGuard.isObject(browserInfo, { name: `addBrowsers( arg${index} )` });
        }
        if (!this._browsersInfo) {
            this._browsersInfo = [];
        }
        this._browsersInfo.push(...browsersInfo);
        return this;
    }
    addBrowser(browserInfoOrWidth, height, name = BrowserName_1.default.CHROME) {
        if (TypeUtils.isObject(browserInfoOrWidth)) {
            return this.addBrowsers(browserInfoOrWidth);
        }
        else {
            return this.addBrowsers({ width: browserInfoOrWidth, height, name });
        }
    }
    addDeviceEmulation(deviceName, screenOrientation = ScreenOrientation_1.default.PORTRAIT) {
        if (!this._browsersInfo) {
            this._browsersInfo = [];
        }
        this._browsersInfo.push({ deviceName, screenOrientation });
        return this;
    }
    get visualGridOptions() {
        return this._visualGridOptions;
    }
    set visualGridOptions(visualGridOptions) {
        this._visualGridOptions = visualGridOptions;
    }
    getVisualGridOptions() {
        return this._visualGridOptions;
    }
    setVisualGridOptions(visualGridOptions) {
        this.visualGridOptions = visualGridOptions;
        return this;
    }
    setVisualGridOption(key, value) {
        if (!this._visualGridOptions) {
            this._visualGridOptions = {};
        }
        this._visualGridOptions[key] = value;
        return this;
    }
    get layoutBreakpoints() {
        return this._layoutBreakpoints;
    }
    set layoutBreakpoints(layoutBreakpoints) {
        ArgumentGuard.notNull(layoutBreakpoints, { name: 'layoutBreakpoints' });
        if (!TypeUtils.isArray(layoutBreakpoints)) {
            this._layoutBreakpoints = layoutBreakpoints;
        }
        else if (layoutBreakpoints.length === 0) {
            this._layoutBreakpoints = false;
        }
        else {
            this._layoutBreakpoints = Array.from(new Set(layoutBreakpoints)).sort((a, b) => a < b ? 1 : -1);
        }
        this._layoutBreakpoints = layoutBreakpoints;
    }
    getLayoutBreakpoints() {
        return this._layoutBreakpoints;
    }
    setLayoutBreakpoints(layoutBreakpoints) {
        this.layoutBreakpoints = layoutBreakpoints;
        return this;
    }
    get disableBrowserFetching() {
        return this._disableBrowserFetching;
    }
    set disableBrowserFetching(disableBrowserFetching) {
        this._disableBrowserFetching = disableBrowserFetching;
    }
    getDisableBrowserFetching() {
        return this._disableBrowserFetching;
    }
    setDisableBrowserFetching(disableBrowserFetching) {
        this.disableBrowserFetching = disableBrowserFetching;
        return this;
    }
    get dontCloseBatches() {
        return this._dontCloseBatches;
    }
    set dontCloseBatches(dontCloseBatches) {
        this._dontCloseBatches = dontCloseBatches;
    }
    getDontCloseBatches() {
        return this.dontCloseBatches;
    }
    setDontCloseBatches(dontCloseBatches) {
        this.dontCloseBatches = dontCloseBatches;
        return this;
    }
    toString() {
        return `Configuration ${this.toJSON()}`;
    }
    toJSON() {
        return {};
    }
}
exports.default = ConfigurationData;
//# sourceMappingURL=Configuration.js.map