"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var TypeUtils = require("./utils/TypeUtils");
var ArgumentGuard = require("./utils/ArgumentGuard");
var Configuration_1 = require("./input/Configuration");
var Runners_1 = require("./Runners");
var Eyes = /** @class */ (function () {
    function Eyes(runnerOrConfig, configOrRunner) {
        if (TypeUtils.instanceOf(runnerOrConfig, Runners_1["default"])) {
            this._runner = runnerOrConfig;
            this._config = new Configuration_1["default"](configOrRunner);
        }
        else if (TypeUtils.instanceOf(configOrRunner, Runners_1["default"])) {
            this._runner = configOrRunner;
            this._config = new Configuration_1["default"](runnerOrConfig);
        }
        else {
            this._runner = new Runners_1.ClassicRunner();
            this._config = new Configuration_1["default"]();
        }
        this._runner.attach(this);
    }
    Eyes.setViewportSize = function (driver, viewportSize) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prototype._spec.setViewportSize(driver, viewportSize)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(Eyes.prototype, "runner", {
        get: function () {
            return this._runner;
        },
        enumerable: false,
        configurable: true
    });
    Eyes.prototype.getRunner = function () {
        return this._runner;
    };
    Object.defineProperty(Eyes.prototype, "driver", {
        get: function () {
            return this._driver;
        },
        enumerable: false,
        configurable: true
    });
    Eyes.prototype.getDriver = function () {
        return this._driver;
    };
    Object.defineProperty(Eyes.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (config) {
            this._config = new Configuration_1["default"](config);
        },
        enumerable: false,
        configurable: true
    });
    Eyes.prototype.getConfiguration = function () {
        return this._config;
    };
    Eyes.prototype.setConfiguration = function (config) {
        this._config = new Configuration_1["default"](config);
    };
    Eyes.prototype.open = function (driver, configOrAppName, testName, viewportSize, sessionType) {
        return __awaiter(this, void 0, void 0, function () {
            var config, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        config = __assign({}, this._config);
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
                        _a = this;
                        return [4 /*yield*/, this._spec.openEyes(driver, config)];
                    case 1:
                        _a._commands = _b.sent();
                        return [2 /*return*/, driver];
                }
            });
        });
    };
    Eyes.prototype.check = function (checkSettingsOrName, checkSettings) {
        return __awaiter(this, void 0, void 0, function () {
            var settings;
            return __generator(this, function (_a) {
                if (TypeUtils.isString(checkSettingsOrName)) {
                    ArgumentGuard.notNull(checkSettings, { name: 'checkSettings' });
                    settings = checkSettings.name(checkSettingsOrName).toJSON();
                }
                else {
                    settings = checkSettingsOrName;
                }
                // TODO wrap/transform response to user output interface
                return [2 /*return*/, this._commands.check(settings)];
            });
        });
    };
    Eyes.prototype.checkWindow = function (name, timeout, isFully) {
        if (isFully === void 0) { isFully = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.check({ name: name, timeout: timeout, isFully: isFully })];
            });
        });
    };
    Eyes.prototype.checkFrame = function (element, timeout, name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.check({ name: name, frames: [element], timeout: timeout, isFully: true })];
            });
        });
    };
    Eyes.prototype.checkElement = function (element, timeout, name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.check({ name: name, region: element, timeout: timeout, isFully: true })];
            });
        });
    };
    Eyes.prototype.checkElementBy = function (selector, timeout, name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.check({ name: name, region: selector, timeout: timeout, isFully: true })];
            });
        });
    };
    Eyes.prototype.checkRegion = function (region, name, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.check({ name: name, region: region, timeout: timeout })];
            });
        });
    };
    Eyes.prototype.checkRegionByElement = function (element, name, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.check({ name: name, region: element, timeout: timeout })];
            });
        });
    };
    Eyes.prototype.checkRegionBy = function (selector, name, timeout, isFully) {
        if (isFully === void 0) { isFully = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.check({ name: name, region: selector, timeout: timeout, isFully: isFully })];
            });
        });
    };
    Eyes.prototype.checkRegionInFrame = function (frame, selector, timeout, name, isFully) {
        if (isFully === void 0) { isFully = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.check({ name: name, region: selector, frames: [frame], timeout: timeout, isFully: isFully })];
            });
        });
    };
    Eyes.prototype.close = function (throwErr) {
        if (throwErr === void 0) { throwErr = true; }
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._commands.close()
                        // TODO wrap/transform response to user output interface
                        // TODO throw error `throwErr` is true and `results` include error response
                    ];
                    case 1:
                        results = _a.sent();
                        // TODO wrap/transform response to user output interface
                        // TODO throw error `throwErr` is true and `results` include error response
                        return [2 /*return*/, results];
                }
            });
        });
    };
    Eyes.prototype.abort = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._commands.abort()
                        // TODO wrap/transform response to user output interface
                    ];
                    case 1:
                        results = _a.sent();
                        // TODO wrap/transform response to user output interface
                        return [2 /*return*/, results];
                }
            });
        });
    };
    Eyes.prototype.closeBatch = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._spec.closeBatch()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // async locate(visualLocatorSettings: any) {
    // }
    // async getViewportSize() : Promise<RectangleSizeData> {
    //   return this._commands
    // }
    // async setViewportSize(viewportSize: RectangleSize|RectangleSizeData) : Promise<void> {
    //   await this._commands
    // }
    // getRotation() : number {
    //   return this._rotation
    // }
    // setRotation(rotation: number) {
    //   this._rotation = rotation
    // }
    // getDebugScreenshotsPrefix() {
    //   // return this._debugScreenshotsProvider.getPrefix()
    // }
    // setDebugScreenshotsPrefix(debugScreenshotsPrefix: boolean) {
    //   // this._debugScreenshotsProvider.setPrefix(prefix)
    // }
    // setDebugScreenshotsPath(debugScreenshotsPath: string) {
    //   // this._debugScreenshotsProvider.setPath(pathToSave)
    // }
    // getDebugScreenshotsPath() {
    //   // return this._debugScreenshotsProvider.getPath()
    // }
    // getSaveDebugScreenshots() : boolean {
    //   return this._saveDebugScreenshots
    // }
    // setSaveDebugScreenshots(saveDebugScreenshots: boolean) {
    //   this._saveDebugScreenshots = saveDebugScreenshots
    // }
    // getScaleRatio() : number {
    //   return this._scaleRatio
    // }
    // setScaleRatio(scaleRatio: number) {
    //   this._scaleRatio = scaleRatio
    // }
    // getScrollRootElement() : TElement|TSelector {
    //   return this._scrollRootElement
    // }
    // setScrollRootElement(scrollRootElement: TElement|TSelector) {
    //   this._scrollRootElement = scrollRootElement
    // }
    // #region CONFIG
    Eyes.prototype.addProperty = function (name, value) {
        return this._config.addProperty(name, value);
    };
    Eyes.prototype.clearProperties = function () {
        return this._config.setProperties([]);
    };
    Eyes.prototype.getBatch = function () {
        return this._config.getBatch();
    };
    Eyes.prototype.setBatch = function (batchOrName, id, startedAt) {
        if (TypeUtils.isString(batchOrName)) {
            this._config.setBatch({ name: batchOrName, id: id, startedAt: new Date(startedAt) });
        }
        else {
            this._config.setBatch(batchOrName);
        }
    };
    Eyes.prototype.getApiKey = function () {
        return this._config.getApiKey();
    };
    Eyes.prototype.setApiKey = function (apiKey) {
        this._config.setApiKey(apiKey);
    };
    Eyes.prototype.getTestName = function () {
        return this._config.getTestName();
    };
    Eyes.prototype.setTestName = function (testName) {
        this._config.setTestName(testName);
    };
    Eyes.prototype.getAppName = function () {
        return this._config.getAppName();
    };
    Eyes.prototype.setAppName = function (appName) {
        this._config.setAppName(appName);
    };
    Eyes.prototype.getBaselineBranchName = function () {
        return this._config.getBaselineBranchName();
    };
    Eyes.prototype.setBaselineBranchName = function (baselineBranchName) {
        this._config.setBaselineBranchName(baselineBranchName);
    };
    /** @deprecated */
    Eyes.prototype.getBaselineName = function () {
        return this.getBaselineEnvName();
    };
    /** @deprecated */
    Eyes.prototype.setBaselineName = function (baselineName) {
        this.setBaselineEnvName(baselineName);
    };
    Eyes.prototype.getBaselineEnvName = function () {
        return this._config.getBaselineEnvName();
    };
    Eyes.prototype.setBaselineEnvName = function (baselineEnvName) {
        this._config.setBaselineEnvName(baselineEnvName);
    };
    Eyes.prototype.getBranchName = function () {
        return this._config.getBranchName();
    };
    Eyes.prototype.setBranchName = function (branchName) {
        this._config.setBranchName(branchName);
    };
    Eyes.prototype.getHostApp = function () {
        return this._config.getHostApp();
    };
    Eyes.prototype.setHostApp = function (hostApp) {
        this._config.setHostApp(hostApp);
    };
    Eyes.prototype.getHostOS = function () {
        return this._config.getHostOS();
    };
    Eyes.prototype.setHostOS = function (hostOS) {
        this._config.setHostOS(hostOS);
    };
    Eyes.prototype.getHostAppInfo = function () {
        return this._config.getHostAppInfo();
    };
    Eyes.prototype.setHostAppInfo = function (hostAppInfo) {
        this._config.setHostAppInfo(hostAppInfo);
    };
    Eyes.prototype.getHostOSInfo = function () {
        return this._config.getHostOSInfo();
    };
    Eyes.prototype.setHostOSInfo = function (hostOSInfo) {
        this._config.setHostOSInfo(hostOSInfo);
    };
    Eyes.prototype.getDeviceInfo = function () {
        return this._config.getDeviceInfo();
    };
    Eyes.prototype.setDeviceInfo = function (deviceInfo) {
        this._config.setDeviceInfo(deviceInfo);
    };
    Eyes.prototype.setIgnoreCaret = function (ignoreCaret) {
        this._config.setIgnoreCaret(ignoreCaret);
    };
    Eyes.prototype.getIgnoreCaret = function () {
        return this._config.getIgnoreCaret();
    };
    Eyes.prototype.getIsDisabled = function () {
        return this._config.getIsDisabled();
    };
    Eyes.prototype.setIsDisabled = function (isDisabled) {
        this._config.setIsDisabled(isDisabled);
    };
    Eyes.prototype.getMatchLevel = function () {
        return this._config.getMatchLevel();
    };
    Eyes.prototype.setMatchLevel = function (matchLevel) {
        this._config.setMatchLevel(matchLevel);
    };
    Eyes.prototype.getMatchTimeout = function () {
        return this._config.getMatchTimeout();
    };
    Eyes.prototype.setMatchTimeout = function (matchTimeout) {
        this._config.setMatchTimeout(matchTimeout);
    };
    Eyes.prototype.getParentBranchName = function () {
        return this._config.getParentBranchName();
    };
    Eyes.prototype.setParentBranchName = function (parentBranchName) {
        this._config.setParentBranchName(parentBranchName);
    };
    Eyes.prototype.setProxy = function (proxyOrUrlOrIsDisabled, username, password, isHttpOnly) {
        this._config.setProxy(proxyOrUrlOrIsDisabled, username, password, isHttpOnly);
        return this;
    };
    Eyes.prototype.getProxy = function () {
        return this._config.getProxy();
    };
    Eyes.prototype.getSaveDiffs = function () {
        return this._config.saveDiffs;
    };
    Eyes.prototype.setSaveDiffs = function (saveDiffs) {
        this._config.saveDiffs = saveDiffs;
    };
    Eyes.prototype.getSaveNewTests = function () {
        return this._config.saveNewTests;
    };
    Eyes.prototype.setSaveNewTests = function (saveNewTests) {
        this._config.saveNewTests = saveNewTests;
    };
    Eyes.prototype.getServerUrl = function () {
        return this._config.getServerUrl();
    };
    Eyes.prototype.setServerUrl = function (serverUrl) {
        this._config.setServerUrl(serverUrl);
    };
    Eyes.prototype.getSendDom = function () {
        return this._config.getSendDom();
    };
    Eyes.prototype.setSendDom = function (sendDom) {
        this._config.setSendDom(sendDom);
    };
    Eyes.prototype.getHideCaret = function () {
        return this._config.getHideCaret();
    };
    Eyes.prototype.setHideCaret = function (hideCaret) {
        this._config.setHideCaret(hideCaret);
    };
    Eyes.prototype.getHideScrollbars = function () {
        return this._config.getHideScrollbars();
    };
    Eyes.prototype.setHideScrollbars = function (hideScrollbars) {
        this._config.setHideScrollbars(hideScrollbars);
    };
    Eyes.prototype.getForceFullPageScreenshot = function () {
        return this._config.getForceFullPageScreenshot();
    };
    Eyes.prototype.setForceFullPageScreenshot = function (forceFullPageScreenshot) {
        this._config.setForceFullPageScreenshot(forceFullPageScreenshot);
    };
    Eyes.prototype.getWaitBeforeScreenshots = function () {
        return this._config.getWaitBeforeScreenshots();
    };
    Eyes.prototype.setWaitBeforeScreenshots = function (waitBeforeScreenshots) {
        this._config.setWaitBeforeScreenshots(waitBeforeScreenshots);
    };
    Eyes.prototype.getStitchMode = function () {
        return this._config.getStitchMode();
    };
    Eyes.prototype.setStitchMode = function (stitchMode) {
        this._config.setStitchMode(stitchMode);
    };
    Eyes.prototype.getStitchOverlap = function () {
        return this._config.getStitchOverlap();
    };
    Eyes.prototype.setStitchOverlap = function (stitchOverlap) {
        this._config.setStitchOverlap(stitchOverlap);
    };
    return Eyes;
}());
exports["default"] = Eyes;
