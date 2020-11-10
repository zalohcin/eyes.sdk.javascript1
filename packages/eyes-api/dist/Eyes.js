"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TypeUtils = require("./utils/TypeUtils");
const ArgumentGuard = require("./utils/ArgumentGuard");
const Configuration_1 = require("./input/Configuration");
const Runners_1 = require("./Runners");
class Eyes {
    constructor(runnerOrConfig, configOrRunner) {
        if (TypeUtils.instanceOf(runnerOrConfig, Runners_1.default)) {
            this._runner = runnerOrConfig;
            this._config = new Configuration_1.default(configOrRunner);
        }
        else if (TypeUtils.instanceOf(configOrRunner, Runners_1.default)) {
            this._runner = configOrRunner;
            this._config = new Configuration_1.default(runnerOrConfig);
        }
        else {
            this._runner = new Runners_1.ClassicRunner();
            this._config = new Configuration_1.default();
        }
        this._runner.attach(this);
    }
    static setViewportSize(driver, viewportSize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prototype._spec.setViewportSize(driver, viewportSize);
        });
    }
    get runner() {
        return this._runner;
    }
    getRunner() {
        return this._runner;
    }
    get driver() {
        return this._driver;
    }
    getDriver() {
        return this._driver;
    }
    get config() {
        return this._config;
    }
    set config(config) {
        this._config = new Configuration_1.default(config);
    }
    getConfiguration() {
        return this._config;
    }
    setConfiguration(config) {
        this._config = new Configuration_1.default(config);
    }
    open(driver, configOrAppName, testName, viewportSize, sessionType) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = Object.assign({}, this._config);
            if (TypeUtils.isObject(configOrAppName))
                Object.assign(config, configOrAppName);
            else
                config.appName = configOrAppName;
            if (TypeUtils.isString(testName))
                config.testName = testName;
            if (TypeUtils.isString(viewportSize))
                config.viewportSize = viewportSize;
            if (TypeUtils.isString(sessionType))
                config.sessionType = sessionType;
            this._driver = driver;
            this._commands = yield this._spec.openEyes(driver, config);
            return driver;
        });
    }
    check(checkSettingsOrName, checkSettings) {
        return __awaiter(this, void 0, void 0, function* () {
            let settings;
            if (TypeUtils.isString(checkSettingsOrName)) {
                ArgumentGuard.notNull(checkSettings, { name: 'checkSettings' });
                settings = checkSettings.name(checkSettingsOrName).toJSON();
            }
            else {
                settings = checkSettingsOrName;
            }
            return this._commands.check(settings);
        });
    }
    checkWindow(name, timeout, isFully = true) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.check({ name, timeout, isFully });
        });
    }
    checkFrame(element, timeout, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.check({ name, frames: [element], timeout, isFully: true });
        });
    }
    checkElement(element, timeout, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.check({ name, region: element, timeout, isFully: true });
        });
    }
    checkElementBy(selector, timeout, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.check({ name, region: selector, timeout, isFully: true });
        });
    }
    checkRegion(region, name, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.check({ name, region, timeout });
        });
    }
    checkRegionByElement(element, name, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.check({ name, region: element, timeout });
        });
    }
    checkRegionBy(selector, name, timeout, isFully = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.check({ name, region: selector, timeout, isFully });
        });
    }
    checkRegionInFrame(frame, selector, timeout, name, isFully = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.check({ name, region: selector, frames: [frame], timeout, isFully });
        });
    }
    close(throwErr = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this._commands.close();
            return results;
        });
    }
    abort() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this._commands.abort();
            return results;
        });
    }
    closeBatch() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._spec.closeBatch();
        });
    }
    addProperty(name, value) {
        return this._config.addProperty(name, value);
    }
    clearProperties() {
        return this._config.setProperties([]);
    }
    getBatch() {
        return this._config.getBatch();
    }
    setBatch(batchOrName, id, startedAt) {
        if (TypeUtils.isString(batchOrName)) {
            this._config.setBatch({ name: batchOrName, id, startedAt: new Date(startedAt) });
        }
        else {
            this._config.setBatch(batchOrName);
        }
    }
    getApiKey() {
        return this._config.getApiKey();
    }
    setApiKey(apiKey) {
        this._config.setApiKey(apiKey);
    }
    getTestName() {
        return this._config.getTestName();
    }
    setTestName(testName) {
        this._config.setTestName(testName);
    }
    getAppName() {
        return this._config.getAppName();
    }
    setAppName(appName) {
        this._config.setAppName(appName);
    }
    getBaselineBranchName() {
        return this._config.getBaselineBranchName();
    }
    setBaselineBranchName(baselineBranchName) {
        this._config.setBaselineBranchName(baselineBranchName);
    }
    getBaselineName() {
        return this.getBaselineEnvName();
    }
    setBaselineName(baselineName) {
        this.setBaselineEnvName(baselineName);
    }
    getBaselineEnvName() {
        return this._config.getBaselineEnvName();
    }
    setBaselineEnvName(baselineEnvName) {
        this._config.setBaselineEnvName(baselineEnvName);
    }
    getBranchName() {
        return this._config.getBranchName();
    }
    setBranchName(branchName) {
        this._config.setBranchName(branchName);
    }
    getHostApp() {
        return this._config.getHostApp();
    }
    setHostApp(hostApp) {
        this._config.setHostApp(hostApp);
    }
    getHostOS() {
        return this._config.getHostOS();
    }
    setHostOS(hostOS) {
        this._config.setHostOS(hostOS);
    }
    getHostAppInfo() {
        return this._config.getHostAppInfo();
    }
    setHostAppInfo(hostAppInfo) {
        this._config.setHostAppInfo(hostAppInfo);
    }
    getHostOSInfo() {
        return this._config.getHostOSInfo();
    }
    setHostOSInfo(hostOSInfo) {
        this._config.setHostOSInfo(hostOSInfo);
    }
    getDeviceInfo() {
        return this._config.getDeviceInfo();
    }
    setDeviceInfo(deviceInfo) {
        this._config.setDeviceInfo(deviceInfo);
    }
    setIgnoreCaret(ignoreCaret) {
        this._config.setIgnoreCaret(ignoreCaret);
    }
    getIgnoreCaret() {
        return this._config.getIgnoreCaret();
    }
    getIsDisabled() {
        return this._config.getIsDisabled();
    }
    setIsDisabled(isDisabled) {
        this._config.setIsDisabled(isDisabled);
    }
    getMatchLevel() {
        return this._config.getMatchLevel();
    }
    setMatchLevel(matchLevel) {
        this._config.setMatchLevel(matchLevel);
    }
    getMatchTimeout() {
        return this._config.getMatchTimeout();
    }
    setMatchTimeout(matchTimeout) {
        this._config.setMatchTimeout(matchTimeout);
    }
    getParentBranchName() {
        return this._config.getParentBranchName();
    }
    setParentBranchName(parentBranchName) {
        this._config.setParentBranchName(parentBranchName);
    }
    setProxy(proxyOrUrlOrIsDisabled, username, password, isHttpOnly) {
        this._config.setProxy(proxyOrUrlOrIsDisabled, username, password, isHttpOnly);
        return this;
    }
    getProxy() {
        return this._config.getProxy();
    }
    getSaveDiffs() {
        return this._config.saveDiffs;
    }
    setSaveDiffs(saveDiffs) {
        this._config.saveDiffs = saveDiffs;
    }
    getSaveNewTests() {
        return this._config.saveNewTests;
    }
    setSaveNewTests(saveNewTests) {
        this._config.saveNewTests = saveNewTests;
    }
    getServerUrl() {
        return this._config.getServerUrl();
    }
    setServerUrl(serverUrl) {
        this._config.setServerUrl(serverUrl);
    }
    getSendDom() {
        return this._config.getSendDom();
    }
    setSendDom(sendDom) {
        this._config.setSendDom(sendDom);
    }
    getHideCaret() {
        return this._config.getHideCaret();
    }
    setHideCaret(hideCaret) {
        this._config.setHideCaret(hideCaret);
    }
    getHideScrollbars() {
        return this._config.getHideScrollbars();
    }
    setHideScrollbars(hideScrollbars) {
        this._config.setHideScrollbars(hideScrollbars);
    }
    getForceFullPageScreenshot() {
        return this._config.getForceFullPageScreenshot();
    }
    setForceFullPageScreenshot(forceFullPageScreenshot) {
        this._config.setForceFullPageScreenshot(forceFullPageScreenshot);
    }
    getWaitBeforeScreenshots() {
        return this._config.getWaitBeforeScreenshots();
    }
    setWaitBeforeScreenshots(waitBeforeScreenshots) {
        this._config.setWaitBeforeScreenshots(waitBeforeScreenshots);
    }
    getStitchMode() {
        return this._config.getStitchMode();
    }
    setStitchMode(stitchMode) {
        this._config.setStitchMode(stitchMode);
    }
    getStitchOverlap() {
        return this._config.getStitchOverlap();
    }
    setStitchOverlap(stitchOverlap) {
        this._config.setStitchOverlap(stitchOverlap);
    }
}
exports.default = Eyes;
//# sourceMappingURL=Eyes.js.map