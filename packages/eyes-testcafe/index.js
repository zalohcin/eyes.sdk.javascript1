'use strict'

const core = require('@applitools/eyes-sdk-core')

exports.Target = require('./lib/fluent/Target').Target
exports.Eyes = require('./lib/EyesTestCafe').EyesTestCafe

// eyes-sdk-core
exports.RectangleSize = core.RectangleSize
exports.AccessibilityLevel = core.AccessibilityLevel
exports.AccessibilityMatchSettings = core.AccessibilityMatchSettings
exports.BatchInfo = core.BatchInfo
exports.Configuration = core.Configuration
exports.ExactMatchSettings = core.ExactMatchSettings
exports.FloatingMatchSettings = core.FloatingMatchSettings
exports.ImageMatchSettings = core.ImageMatchSettings
exports.MatchLevel = core.MatchLevel
exports.ProxySettings = core.ProxySettings
exports.StitchMode = core.StitchMode
exports.EyesError = core.EyesError
exports.ConsoleLogHandler = core.ConsoleLogHandler
exports.DebugLogHandler = core.DebugLogHandler
exports.FileDebugScreenshotsProvider = core.FileDebugScreenshotsProvider
exports.FileLogHandler = core.FileLogHandler
exports.EyesJsBrowserUtils = core.EyesJsBrowserUtils
exports.DiffsFoundError = core.DiffsFoundError
exports.NewTestError = core.NewTestError
exports.TestFailedError = core.TestFailedError
exports.TestResults = core.TestResults
exports.TestResultsStatus = core.TestResultsStatus
