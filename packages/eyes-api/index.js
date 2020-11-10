"use strict";
// #region ENUM
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.Eyes = exports.VisualGridRunner = exports.ClassicRunner = exports.EyesRunner = exports.Region = exports.RectangleSize = exports.Location = exports.PropertyData = exports.BatchInfo = exports.FloatingMatchSettings = exports.AccessibilityMatchSettings = exports.ExactMatchSettings = exports.ImageMatchSettings = exports.ProxySettings = exports.Configuration = exports.CheckSettings = exports.StitchMode = exports.ScreenOrientation = exports.MatchLevel = exports.IosDeviceName = exports.DeviceName = exports.BrowserType = exports.AccessibilityRegionType = exports.AccessibilityLevel = exports.AccessibilityGuidelinesVersion = void 0;
var AccessibilityGuidelinesVersion_1 = require("./src/enums/AccessibilityGuidelinesVersion");
__createBinding(exports, AccessibilityGuidelinesVersion_1, "default", "AccessibilityGuidelinesVersion");
var AccessibilityLevel_1 = require("./src/enums/AccessibilityLevel");
__createBinding(exports, AccessibilityLevel_1, "default", "AccessibilityLevel");
var AccessibilityRegionType_1 = require("./src/enums/AccessibilityRegionType");
__createBinding(exports, AccessibilityRegionType_1, "default", "AccessibilityRegionType");
var BrowserName_1 = require("./src/enums/BrowserName");
__createBinding(exports, BrowserName_1, "default", "BrowserType");
var DeviceName_1 = require("./src/enums/DeviceName");
__createBinding(exports, DeviceName_1, "default", "DeviceName");
var IosDeviceName_1 = require("./src/enums/IosDeviceName");
__createBinding(exports, IosDeviceName_1, "default", "IosDeviceName");
var MatchLevel_1 = require("./src/enums/MatchLevel");
__createBinding(exports, MatchLevel_1, "default", "MatchLevel");
var ScreenOrientation_1 = require("./src/enums/ScreenOrientation");
__createBinding(exports, ScreenOrientation_1, "default", "ScreenOrientation");
var StitchMode_1 = require("./src/enums/StitchMode");
__createBinding(exports, StitchMode_1, "default", "StitchMode");
// #endregion
// #region INPUT
var CheckSettings_1 = require("./src/input/CheckSettings");
__createBinding(exports, CheckSettings_1, "default", "CheckSettings");
var Configuration_1 = require("./src/input/Configuration");
__createBinding(exports, Configuration_1, "default", "Configuration");
var ProxySettings_1 = require("./src/input/ProxySettings");
__createBinding(exports, ProxySettings_1, "default", "ProxySettings");
var ImageMatchSettings_1 = require("./src/input/ImageMatchSettings");
__createBinding(exports, ImageMatchSettings_1, "default", "ImageMatchSettings");
var ExactMatchSettings_1 = require("./src/input/ExactMatchSettings");
__createBinding(exports, ExactMatchSettings_1, "default", "ExactMatchSettings");
var AccessibilityRegion_1 = require("./src/input/AccessibilityRegion");
__createBinding(exports, AccessibilityRegion_1, "default", "AccessibilityMatchSettings");
var FloatingRegion_1 = require("./src/input/FloatingRegion");
__createBinding(exports, FloatingRegion_1, "default", "FloatingMatchSettings");
var BatchInfo_1 = require("./src/input/BatchInfo");
__createBinding(exports, BatchInfo_1, "default", "BatchInfo");
var CustomProperty_1 = require("./src/input/CustomProperty");
__createBinding(exports, CustomProperty_1, "default", "PropertyData");
var Location_1 = require("./src/input/Location");
__createBinding(exports, Location_1, "default", "Location");
var RectangleSize_1 = require("./src/input/RectangleSize");
__createBinding(exports, RectangleSize_1, "default", "RectangleSize");
var Region_1 = require("./src/input/Region");
__createBinding(exports, Region_1, "default", "Region");
// #endregion
var Runners_1 = require("./src/Runners");
__createBinding(exports, Runners_1, "default", "EyesRunner");
__createBinding(exports, Runners_1, "ClassicRunner");
__createBinding(exports, Runners_1, "VisualGridRunner");
var Runners_2 = require("./src/Runners");
__createBinding(exports, Runners_2, "default", "Eyes");
