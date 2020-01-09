'use strict'

const common = require('@applitools/eyes-common')
const core = require('@applitools/eyes-sdk-core')

exports.Target = require('./lib/fluent/Target').Target
exports.Eyes = require('./lib/EyesTestCafe').EyesTestCafe

// eyes-common
exports.RectangleSize = common.RectangleSize
exports.AccessibilityLevel = common.AccessibilityLevel
exports.AccessibilityMatchSettings = common.AccessibilityMatchSettings
exports.BatchInfo = common.BatchInfo
exports.Configuration = common.Configuration
exports.ExactMatchSettings = common.ExactMatchSettings
exports.FloatingMatchSettings = common.FloatingMatchSettings
exports.ImageMatchSettings = common.ImageMatchSettings
exports.MatchLevel = common.MatchLevel
exports.ProxySettings = common.ProxySettings
exports.StitchMode = common.StitchMode
exports.FileDebugScreenshotsProvider = common.FileDebugScreenshotsProvider
exports.EyesError = common.EyesError
exports.ConsoleLogHandler = common.ConsoleLogHandler
exports.DebugLogHandler = common.DebugLogHandler
exports.FileLogHandler = common.FileLogHandler

// eyes-sdk-core
exports.EyesJsBrowserUtils = core.EyesJsBrowserUtils
exports.DiffsFoundError = core.DiffsFoundError
exports.NewTestError = core.NewTestError
exports.TestFailedError = core.TestFailedError
exports.TestResults = core.TestResults
exports.TestResultsStatus = core.TestResultsStatus
