"use strict";
exports.__esModule = true;
var ArgumentGuard = require("../utils/ArgumentGuard");
var TypeUtils = require("../utils/TypeUtils");
var StitchMode_1 = require("../enums/StitchMode");
var BrowserName_1 = require("../enums/BrowserName");
var ScreenOrientation_1 = require("../enums/ScreenOrientation");
var RectangleSize_1 = require("./RectangleSize");
var ProxySettings_1 = require("./ProxySettings");
var BatchInfo_1 = require("./BatchInfo");
var CustomProperty_1 = require("./CustomProperty");
var ImageMatchSettings_1 = require("./ImageMatchSettings");
var ConfigurationData = /** @class */ (function () {
    function ConfigurationData(config) {
        if (!config)
            return this;
        var self = this;
        for (var _i = 0, _a = Object.entries(config); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (key in this && !key.startsWith('_')) {
                self[key] = value;
            }
        }
    }
    Object.defineProperty(ConfigurationData.prototype, "showLogs", {
        get: function () {
            return this._showLogs;
        },
        set: function (showLogs) {
            ArgumentGuard.isBoolean(showLogs, { name: 'showLogs' });
            this._showLogs = showLogs;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getShowLogs = function () {
        return this._showLogs;
    };
    ConfigurationData.prototype.setShowLogs = function (showLogs) {
        this.showLogs = showLogs;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "appName", {
        get: function () {
            return this._appName;
        },
        set: function (appName) {
            ArgumentGuard.isString(appName, { name: 'appName', strict: false });
            this._appName = appName;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getAppName = function () {
        return this._appName;
    };
    ConfigurationData.prototype.setAppName = function (appName) {
        this.appName = appName;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "testName", {
        get: function () {
            return this._testName;
        },
        set: function (testName) {
            ArgumentGuard.isString(testName, { name: 'testName', strict: false });
            this._testName = testName;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getTestName = function () {
        return this._testName;
    };
    ConfigurationData.prototype.setTestName = function (testName) {
        this.testName = testName;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "displayName", {
        get: function () {
            return this._displayName;
        },
        set: function (displayName) {
            ArgumentGuard.isString(displayName, { name: 'displayName', strict: false });
            this._displayName = displayName;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getDisplayName = function () {
        return this._displayName;
    };
    ConfigurationData.prototype.setDisplayName = function (displayName) {
        this.displayName = displayName;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "isDisabled", {
        get: function () {
            return this._isDisabled;
        },
        set: function (isDisabled) {
            ArgumentGuard.isBoolean(isDisabled, { name: 'isDisabled', strict: false });
            this._isDisabled = isDisabled;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getIsDisabled = function () {
        return this._isDisabled;
    };
    ConfigurationData.prototype.setIsDisabled = function (isDisabled) {
        this.isDisabled = isDisabled;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "matchTimeout", {
        get: function () {
            return this._matchTimeout;
        },
        set: function (matchTimeout) {
            ArgumentGuard.isInteger(matchTimeout, { name: 'matchTimeout', gt: 500 });
            this._matchTimeout = matchTimeout;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getMatchTimeout = function () {
        return this._matchTimeout;
    };
    ConfigurationData.prototype.setMatchTimeout = function (matchTimeout) {
        this.matchTimeout = matchTimeout;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "sessionType", {
        get: function () {
            return this._sessionType;
        },
        set: function (sessionType) {
            this._sessionType = sessionType;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getSessionType = function () {
        return this._sessionType;
    };
    ConfigurationData.prototype.setSessionType = function (sessionType) {
        this.sessionType = sessionType;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "viewportSize", {
        get: function () {
            return this._viewportSize;
        },
        set: function (viewportSize) {
            if (!viewportSize)
                this._viewportSize = undefined;
            this._viewportSize = new RectangleSize_1["default"](viewportSize);
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getViewportSize = function () {
        return this._viewportSize;
    };
    ConfigurationData.prototype.setViewportSize = function (viewportSize) {
        this.viewportSize = viewportSize;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "agentId", {
        get: function () {
            return this._agentId;
        },
        set: function (agentId) {
            ArgumentGuard.isString(agentId, { name: 'agentId' });
            this._agentId = agentId;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getAgentId = function () {
        return this._agentId;
    };
    ConfigurationData.prototype.setAgentId = function (agentId) {
        this.agentId = agentId;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "apiKey", {
        get: function () {
            return this._apiKey;
        },
        set: function (apiKey) {
            ArgumentGuard.isString(apiKey, { name: 'apiKey', alpha: true, numeric: true });
            this._apiKey = apiKey;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getApiKey = function () {
        return this._apiKey;
    };
    ConfigurationData.prototype.setApiKey = function (apiKey) {
        this.apiKey = apiKey;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "serverUrl", {
        get: function () {
            return this._serverUrl;
        },
        set: function (serverUrl) {
            ArgumentGuard.isString(serverUrl, { name: 'serverUrl', strict: false });
            this._serverUrl = serverUrl;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getServerUrl = function () {
        return this._serverUrl;
    };
    ConfigurationData.prototype.setServerUrl = function (serverUrl) {
        this.serverUrl = serverUrl;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "proxy", {
        get: function () {
            return this._proxy;
        },
        set: function (proxy) {
            if (!proxy)
                this._proxy = undefined;
            this._proxy = new ProxySettings_1["default"](proxy);
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getProxy = function () {
        return this._proxy;
    };
    ConfigurationData.prototype.setProxy = function (proxyOrUrlOrIsDisabled, username, password, isHttpOnly) {
        if (proxyOrUrlOrIsDisabled === true) {
            this.proxy = undefined;
        }
        else if (TypeUtils.isString(proxyOrUrlOrIsDisabled)) {
            this.proxy = { url: proxyOrUrlOrIsDisabled, username: username, password: password, isHttpOnly: isHttpOnly };
        }
        else {
            this.proxy = proxyOrUrlOrIsDisabled;
        }
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "connectionTimeout", {
        get: function () {
            return this._connectionTimeout;
        },
        set: function (connectionTimeout) {
            ArgumentGuard.isInteger(connectionTimeout, { name: 'connectionTimeout', gte: 0 });
            this._connectionTimeout = connectionTimeout;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getConnectionTimeout = function () {
        return this._connectionTimeout;
    };
    ConfigurationData.prototype.setConnectionTimeout = function (connectionTimeout) {
        this.connectionTimeout = connectionTimeout;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "removeSession", {
        get: function () {
            return this._removeSession;
        },
        set: function (removeSession) {
            ArgumentGuard.isBoolean(removeSession, { name: 'removeSession' });
            this._removeSession = removeSession;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getRemoveSession = function () {
        return this._removeSession;
    };
    ConfigurationData.prototype.setRemoveSession = function (removeSession) {
        this.removeSession = removeSession;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "batch", {
        get: function () {
            return this._batch;
        },
        set: function (batch) {
            if (!batch)
                this._batch = undefined;
            this._batch = new BatchInfo_1["default"](batch);
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getBatch = function () {
        return this._batch;
    };
    ConfigurationData.prototype.setBatch = function (batch) {
        this.batch = batch;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "properties", {
        get: function () {
            return this._properties;
        },
        set: function (properties) {
            ArgumentGuard.isArray(properties, { name: 'properties' });
            this._properties = properties.map(function (prop) { return new CustomProperty_1["default"](prop); });
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getProperties = function () {
        return this._properties;
    };
    ConfigurationData.prototype.setProperties = function (properties) {
        this.properties = properties;
        return this;
    };
    ConfigurationData.prototype.addProperty = function (propOrName, value) {
        var prop = TypeUtils.isString(propOrName)
            ? new CustomProperty_1["default"]({ name: propOrName, value: value })
            : new CustomProperty_1["default"](propOrName);
        this._properties.push(prop);
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "baselineEnvName", {
        get: function () {
            return this._baselineEnvName;
        },
        set: function (baselineEnvName) {
            ArgumentGuard.isString(baselineEnvName, { name: 'baselineEnvName', strict: false });
            this._baselineEnvName = baselineEnvName ? baselineEnvName.trim() : undefined;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getBaselineEnvName = function () {
        return this._baselineEnvName;
    };
    ConfigurationData.prototype.setBaselineEnvName = function (baselineEnvName) {
        this.baselineEnvName = baselineEnvName;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "environmentName", {
        get: function () {
            return this._environmentName;
        },
        set: function (environmentName) {
            ArgumentGuard.isString(environmentName, { name: 'environmentName', strict: false });
            this._environmentName = environmentName ? environmentName.trim() : undefined;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getEnvironmentName = function () {
        return this._environmentName;
    };
    ConfigurationData.prototype.setEnvironmentName = function (environmentName) {
        this.environmentName = environmentName;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "branchName", {
        get: function () {
            return this._branchName;
        },
        set: function (branchName) {
            ArgumentGuard.isString(branchName, { name: 'branchName' });
            this._branchName = branchName;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getBranchName = function () {
        return this._branchName;
    };
    ConfigurationData.prototype.setBranchName = function (branchName) {
        this.branchName = branchName;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "parentBranchName", {
        get: function () {
            return this._parentBranchName;
        },
        set: function (parentBranchName) {
            ArgumentGuard.isString(parentBranchName, { name: 'parentBranchName' });
            this._parentBranchName = parentBranchName;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getParentBranchName = function () {
        return this._parentBranchName;
    };
    ConfigurationData.prototype.setParentBranchName = function (parentBranchName) {
        this.parentBranchName = parentBranchName;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "baselineBranchName", {
        get: function () {
            return this._baselineBranchName;
        },
        set: function (baselineBranchName) {
            ArgumentGuard.isString(baselineBranchName, { name: 'baselineBranchName' });
            this._baselineBranchName = baselineBranchName;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getBaselineBranchName = function () {
        return this._baselineBranchName;
    };
    ConfigurationData.prototype.setBaselineBranchName = function (baselineBranchName) {
        this.baselineBranchName = baselineBranchName;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "compareWithParentBranch", {
        get: function () {
            return this._compareWithParentBranch;
        },
        set: function (compareWithParentBranch) {
            ArgumentGuard.isBoolean(compareWithParentBranch, { name: 'compareWithParentBranch' });
            this._compareWithParentBranch = compareWithParentBranch;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getCompareWithParentBranch = function () {
        return this._compareWithParentBranch;
    };
    ConfigurationData.prototype.setCompareWithParentBranch = function (compareWithParentBranch) {
        this.compareWithParentBranch = compareWithParentBranch;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "ignoreBaseline", {
        get: function () {
            return this._ignoreBaseline;
        },
        set: function (ignoreBaseline) {
            ArgumentGuard.isBoolean(ignoreBaseline, { name: 'ignoreBaseline' });
            this._ignoreBaseline = ignoreBaseline;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getIgnoreBaseline = function () {
        return this._ignoreBaseline;
    };
    ConfigurationData.prototype.setIgnoreBaseline = function (ignoreBaseline) {
        this.ignoreBaseline = ignoreBaseline;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "saveFailedTests", {
        get: function () {
            return this._saveFailedTests;
        },
        set: function (saveFailedTests) {
            ArgumentGuard.isBoolean(saveFailedTests, { name: 'saveFailedTests' });
            this._saveFailedTests = saveFailedTests;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getSaveFailedTests = function () {
        return this._saveFailedTests;
    };
    ConfigurationData.prototype.setSaveFailedTests = function (saveFailedTests) {
        this.saveFailedTests = saveFailedTests;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "saveNewTests", {
        get: function () {
            return this._saveNewTests;
        },
        set: function (saveNewTests) {
            ArgumentGuard.isBoolean(saveNewTests, { name: 'saveNewTests' });
            this._saveNewTests = saveNewTests;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getSaveNewTests = function () {
        return this._saveNewTests;
    };
    ConfigurationData.prototype.setSaveNewTests = function (saveNewTests) {
        this.saveNewTests = saveNewTests;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "saveDiffs", {
        get: function () {
            return this._saveDiffs;
        },
        set: function (saveDiffs) {
            ArgumentGuard.isBoolean(saveDiffs, { name: 'saveDiffs' });
            this._saveDiffs = saveDiffs;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getSaveDiffs = function () {
        return this._saveDiffs;
    };
    ConfigurationData.prototype.setSaveDiffs = function (saveDiffs) {
        this.saveDiffs = saveDiffs;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "sendDom", {
        get: function () {
            return this._sendDom;
        },
        set: function (sendDom) {
            ArgumentGuard.isBoolean(sendDom, { name: 'sendDom' });
            this._sendDom = sendDom;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getSendDom = function () {
        return this._sendDom;
    };
    ConfigurationData.prototype.setSendDom = function (sendDom) {
        this.sendDom = sendDom;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "hostApp", {
        get: function () {
            return this._hostApp;
        },
        set: function (hostApp) {
            this._hostApp = hostApp ? hostApp.trim() : undefined;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getHostApp = function () {
        return this._hostApp;
    };
    ConfigurationData.prototype.setHostApp = function (hostApp) {
        this.hostApp = hostApp;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "hostOS", {
        get: function () {
            return this._hostOS;
        },
        set: function (hostOS) {
            this._hostOS = hostOS ? hostOS.trim() : undefined;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getHostOS = function () {
        return this._hostOS;
    };
    ConfigurationData.prototype.setHostOS = function (hostOS) {
        this.hostOS = hostOS;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "hostAppInfo", {
        get: function () {
            return this._hostAppInfo;
        },
        set: function (hostAppInfo) {
            this._hostAppInfo = hostAppInfo ? hostAppInfo.trim() : undefined;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getHostAppInfo = function () {
        return this._hostAppInfo;
    };
    ConfigurationData.prototype.setHostAppInfo = function (hostAppInfo) {
        this.hostAppInfo = hostAppInfo;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "hostOSInfo", {
        get: function () {
            return this._hostOSInfo;
        },
        set: function (hostOSInfo) {
            this._hostOSInfo = hostOSInfo ? hostOSInfo.trim() : undefined;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getHostOSInfo = function () {
        return this.hostOSInfo;
    };
    ConfigurationData.prototype.setHostOSInfo = function (hostOSInfo) {
        this.hostOSInfo = hostOSInfo;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "deviceInfo", {
        get: function () {
            return this._deviceInfo;
        },
        set: function (deviceInfo) {
            this._deviceInfo = deviceInfo ? deviceInfo.trim() : undefined;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getDeviceInfo = function () {
        return this._deviceInfo;
    };
    ConfigurationData.prototype.setDeviceInfo = function (deviceInfo) {
        this.deviceInfo = deviceInfo;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "defaultMatchSettings", {
        get: function () {
            return this._defaultMatchSettings;
        },
        set: function (defaultMatchSettings) {
            ArgumentGuard.notNull(defaultMatchSettings, { name: 'defaultMatchSettings' });
            this._defaultMatchSettings = new ImageMatchSettings_1["default"](defaultMatchSettings);
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getDefaultMatchSettings = function () {
        return this._defaultMatchSettings;
    };
    ConfigurationData.prototype.setDefaultMatchSettings = function (defaultMatchSettings) {
        this.defaultMatchSettings = defaultMatchSettings;
        return this;
    };
    ConfigurationData.prototype.getMatchLevel = function () {
        return this._defaultMatchSettings.matchLevel;
    };
    ConfigurationData.prototype.setMatchLevel = function (matchLevel) {
        this._defaultMatchSettings.matchLevel = matchLevel;
        return this;
    };
    ConfigurationData.prototype.getAccessibilityValidation = function () {
        return this._defaultMatchSettings.accessibilitySettings;
    };
    ConfigurationData.prototype.setAccessibilityValidation = function (accessibilityValidation) {
        this._defaultMatchSettings.accessibilitySettings = accessibilityValidation;
        return this;
    };
    ConfigurationData.prototype.getUseDom = function () {
        return this._defaultMatchSettings.useDom;
    };
    ConfigurationData.prototype.setUseDom = function (useDom) {
        this._defaultMatchSettings.useDom = useDom;
        return this;
    };
    ConfigurationData.prototype.getEnablePatterns = function () {
        return this._defaultMatchSettings.enablePatterns;
    };
    ConfigurationData.prototype.setEnablePatterns = function (enablePatterns) {
        this._defaultMatchSettings.enablePatterns = enablePatterns;
        return this;
    };
    ConfigurationData.prototype.getIgnoreDisplacements = function () {
        return this._defaultMatchSettings.ignoreDisplacements;
    };
    ConfigurationData.prototype.setIgnoreDisplacements = function (ignoreDisplacements) {
        this._defaultMatchSettings.ignoreDisplacements = ignoreDisplacements;
        return this;
    };
    ConfigurationData.prototype.getIgnoreCaret = function () {
        return this._defaultMatchSettings.ignoreCaret;
    };
    ConfigurationData.prototype.setIgnoreCaret = function (ignoreCaret) {
        this._defaultMatchSettings.ignoreCaret = ignoreCaret;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "forceFullPageScreenshot", {
        get: function () {
            return this._forceFullPageScreenshot;
        },
        set: function (forceFullPageScreenshot) {
            this._forceFullPageScreenshot = forceFullPageScreenshot;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getForceFullPageScreenshot = function () {
        return this._forceFullPageScreenshot;
    };
    ConfigurationData.prototype.setForceFullPageScreenshot = function (forceFullPageScreenshot) {
        this.forceFullPageScreenshot = forceFullPageScreenshot;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "waitBeforeScreenshots", {
        get: function () {
            return this._waitBeforeScreenshots;
        },
        set: function (waitBeforeScreenshots) {
            ArgumentGuard.isInteger(waitBeforeScreenshots, { name: 'waitBeforeScreenshots', gt: 0 });
            this._waitBeforeScreenshots = waitBeforeScreenshots;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getWaitBeforeScreenshots = function () {
        return this._waitBeforeScreenshots;
    };
    ConfigurationData.prototype.setWaitBeforeScreenshots = function (waitBeforeScreenshots) {
        this.waitBeforeScreenshots = waitBeforeScreenshots;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "stitchMode", {
        get: function () {
            return this._stitchMode;
        },
        set: function (stitchMode) {
            ArgumentGuard.isEnumValue(stitchMode, StitchMode_1["default"], { name: 'stitchMode' });
            this._stitchMode = stitchMode;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getStitchMode = function () {
        return this._stitchMode;
    };
    ConfigurationData.prototype.setStitchMode = function (stitchMode) {
        this.stitchMode = stitchMode;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "hideScrollbars", {
        get: function () {
            return this._hideScrollbars;
        },
        set: function (hideScrollbars) {
            this._hideScrollbars = hideScrollbars;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getHideScrollbars = function () {
        return this._hideScrollbars;
    };
    ConfigurationData.prototype.setHideScrollbars = function (hideScrollbars) {
        this.hideScrollbars = hideScrollbars;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "hideCaret", {
        get: function () {
            return this._hideCaret;
        },
        set: function (hideCaret) {
            this._hideCaret = hideCaret;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getHideCaret = function () {
        return this._hideCaret;
    };
    ConfigurationData.prototype.setHideCaret = function (hideCaret) {
        this.hideCaret = hideCaret;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "stitchOverlap", {
        get: function () {
            return this._stitchOverlap;
        },
        set: function (stitchOverlap) {
            ArgumentGuard.isInteger(stitchOverlap, { name: 'stitchOverlap', strict: false });
            this._stitchOverlap = stitchOverlap;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getStitchOverlap = function () {
        return this._stitchOverlap;
    };
    ConfigurationData.prototype.setStitchOverlap = function (stitchOverlap) {
        this.stitchOverlap = stitchOverlap;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "concurrentSessions", {
        get: function () {
            return this._concurrentSessions;
        },
        set: function (concurrentSessions) {
            this._concurrentSessions = concurrentSessions;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getConcurrentSessions = function () {
        return this._concurrentSessions;
    };
    ConfigurationData.prototype.setConcurrentSessions = function (concurrentSessions) {
        this.concurrentSessions = concurrentSessions;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "isThrowExceptionOn", {
        get: function () {
            return this._isThrowExceptionOn;
        },
        set: function (isThrowExceptionOn) {
            this._isThrowExceptionOn = isThrowExceptionOn;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getIsThrowExceptionOn = function () {
        return this._isThrowExceptionOn;
    };
    ConfigurationData.prototype.setIsThrowExceptionOn = function (isThrowExceptionOn) {
        this.isThrowExceptionOn = isThrowExceptionOn;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "browsersInfo", {
        get: function () {
            return this._browsersInfo;
        },
        set: function (browsersInfo) {
            ArgumentGuard.isArray(browsersInfo, { name: 'browsersInfo' });
            this._browsersInfo = browsersInfo;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getBrowsersInfo = function () {
        return this.browsersInfo;
    };
    ConfigurationData.prototype.setBrowsersInfo = function (browsersInfo) {
        this.browsersInfo = browsersInfo;
        return this;
    };
    ConfigurationData.prototype.addBrowsers = function () {
        var _a;
        var browsersInfo = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            browsersInfo[_i] = arguments[_i];
        }
        for (var _b = 0, _c = browsersInfo.entries(); _b < _c.length; _b++) {
            var _d = _c[_b], index = _d[0], browserInfo = _d[1];
            ArgumentGuard.isObject(browserInfo, { name: "addBrowsers( arg" + index + " )" });
        }
        if (!this._browsersInfo) {
            this._browsersInfo = [];
        }
        (_a = this._browsersInfo).push.apply(_a, browsersInfo);
        return this;
    };
    ConfigurationData.prototype.addBrowser = function (browserInfoOrWidth, height, name) {
        if (name === void 0) { name = BrowserName_1["default"].CHROME; }
        if (TypeUtils.isObject(browserInfoOrWidth)) {
            return this.addBrowsers(browserInfoOrWidth);
        }
        else {
            return this.addBrowsers({ width: browserInfoOrWidth, height: height, name: name });
        }
    };
    ConfigurationData.prototype.addDeviceEmulation = function (deviceName, screenOrientation) {
        if (screenOrientation === void 0) { screenOrientation = ScreenOrientation_1["default"].PORTRAIT; }
        if (!this._browsersInfo) {
            this._browsersInfo = [];
        }
        this._browsersInfo.push({ deviceName: deviceName, screenOrientation: screenOrientation });
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "visualGridOptions", {
        get: function () {
            return this._visualGridOptions;
        },
        set: function (visualGridOptions) {
            this._visualGridOptions = visualGridOptions;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getVisualGridOptions = function () {
        return this._visualGridOptions;
    };
    ConfigurationData.prototype.setVisualGridOptions = function (visualGridOptions) {
        this.visualGridOptions = visualGridOptions;
        return this;
    };
    ConfigurationData.prototype.setVisualGridOption = function (key, value) {
        if (!this._visualGridOptions) {
            this._visualGridOptions = {};
        }
        this._visualGridOptions[key] = value;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "layoutBreakpoints", {
        get: function () {
            return this._layoutBreakpoints;
        },
        set: function (layoutBreakpoints) {
            ArgumentGuard.notNull(layoutBreakpoints, { name: 'layoutBreakpoints' });
            if (!TypeUtils.isArray(layoutBreakpoints)) {
                this._layoutBreakpoints = layoutBreakpoints;
            }
            else if (layoutBreakpoints.length === 0) {
                this._layoutBreakpoints = false;
            }
            else {
                this._layoutBreakpoints = Array.from(new Set(layoutBreakpoints)).sort(function (a, b) {
                    return a < b ? 1 : -1;
                });
            }
            this._layoutBreakpoints = layoutBreakpoints;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getLayoutBreakpoints = function () {
        return this._layoutBreakpoints;
    };
    ConfigurationData.prototype.setLayoutBreakpoints = function (layoutBreakpoints) {
        this.layoutBreakpoints = layoutBreakpoints;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "disableBrowserFetching", {
        get: function () {
            return this._disableBrowserFetching;
        },
        set: function (disableBrowserFetching) {
            this._disableBrowserFetching = disableBrowserFetching;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getDisableBrowserFetching = function () {
        return this._disableBrowserFetching;
    };
    ConfigurationData.prototype.setDisableBrowserFetching = function (disableBrowserFetching) {
        this.disableBrowserFetching = disableBrowserFetching;
        return this;
    };
    Object.defineProperty(ConfigurationData.prototype, "dontCloseBatches", {
        get: function () {
            return this._dontCloseBatches;
        },
        set: function (dontCloseBatches) {
            this._dontCloseBatches = dontCloseBatches;
        },
        enumerable: false,
        configurable: true
    });
    ConfigurationData.prototype.getDontCloseBatches = function () {
        return this.dontCloseBatches;
    };
    ConfigurationData.prototype.setDontCloseBatches = function (dontCloseBatches) {
        this.dontCloseBatches = dontCloseBatches;
        return this;
    };
    ConfigurationData.prototype.toString = function () {
        return "Configuration " + this.toJSON();
    };
    ConfigurationData.prototype.toJSON = function () {
        return {};
    };
    return ConfigurationData;
}());
exports["default"] = ConfigurationData;
