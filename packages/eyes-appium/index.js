'use strict'

const parent = require('@applitools/eyes-selenium')

// Overridden & new classes
exports.Eyes = require('./lib/Eyes').Eyes
exports.AppiumImageOrientationHandler = require('./lib/AppiumImageOrientationHandler').AppiumImageOrientationHandler
exports.AppiumJavascriptHandler = require('./lib/AppiumJavascriptHandler').AppiumJavascriptHandler
exports.AppiumJsCommandExtractor = require('./lib/AppiumJsCommandExtractor').AppiumJsCommandExtractor
exports.EyesAppiumUtils = require('./lib/EyesAppiumUtils').EyesAppiumUtils

// eyes-selenium
exports.EyesWebDriverScreenshot = parent.EyesWebDriverScreenshot
exports.EyesWebDriverScreenshotFactory = parent.EyesWebDriverScreenshotFactory
exports.FirefoxScreenshotImageProvider = parent.FirefoxScreenshotImageProvider
exports.ImageProviderFactory = parent.ImageProviderFactory
exports.SafariScreenshotImageProvider = parent.SafariScreenshotImageProvider
exports.TakesScreenshotImageProvider = parent.TakesScreenshotImageProvider

exports.EyesDriverOperationError = parent.EyesDriverOperationError
exports.NoFramesError = parent.NoFramesError

exports.AccessibilityRegionByElement = parent.AccessibilityRegionByElement
exports.AccessibilityRegionBySelector = parent.AccessibilityRegionBySelector
exports.FloatingRegionByElement = parent.FloatingRegionByElement
exports.FloatingRegionBySelector = parent.FloatingRegionBySelector
exports.FrameLocator = parent.FrameLocator
exports.IgnoreRegionByElement = parent.IgnoreRegionByElement
exports.IgnoreRegionBySelector = parent.IgnoreRegionBySelector
exports.SelectorByElement = parent.SelectorByElement
exports.SelectorByLocator = parent.SelectorByLocator
exports.SeleniumCheckSettings = parent.SeleniumCheckSettings
exports.Target = parent.Target

exports.Frame = parent.Frame
exports.FrameChain = parent.FrameChain

exports.CssTranslatePositionMemento = parent.CssTranslatePositionMemento
exports.CssTranslatePositionProvider = parent.CssTranslatePositionProvider
exports.ElementPositionMemento = parent.ElementPositionMemento
exports.ElementPositionProvider = parent.ElementPositionProvider
exports.FirefoxRegionPositionCompensation = parent.FirefoxRegionPositionCompensation
exports.ImageRotation = parent.ImageRotation
exports.OverflowAwareCssTranslatePositionProvider = parent.OverflowAwareCssTranslatePositionProvider
exports.OverflowAwareScrollPositionProvider = parent.OverflowAwareScrollPositionProvider
exports.RegionPositionCompensationFactory = parent.RegionPositionCompensationFactory
exports.SafariRegionPositionCompensation = parent.SafariRegionPositionCompensation
exports.ScrollPositionMemento = parent.ScrollPositionMemento
exports.ScrollPositionProvider = parent.ScrollPositionProvider

exports.MoveToRegionVisibilityStrategy = parent.MoveToRegionVisibilityStrategy
exports.NopRegionVisibilityStrategy = parent.NopRegionVisibilityStrategy
exports.RegionVisibilityStrategy = parent.RegionVisibilityStrategy

exports.ClassicRunner = parent.ClassicRunner
exports.VisualGridRunner = parent.VisualGridRunner
exports.TestResultContainer = parent.TestResultContainer
exports.TestResultsSummary = parent.TestResultsSummary

exports.EyesTargetLocator = parent.EyesTargetLocator
exports.EyesWebDriver = parent.EyesWebDriver
exports.EyesWebElement = parent.EyesWebElement
exports.EyesWebElementPromise = parent.EyesWebElementPromise

exports.BordersAwareElementContentLocationProvider =
  parent.BordersAwareElementContentLocationProvider
exports.EyesSeleniumUtils = parent.EyesSeleniumUtils
exports.ImageOrientationHandler = parent.ImageOrientationHandler
exports.JavascriptHandler = parent.JavascriptHandler
exports.SeleniumJavaScriptExecutor = parent.SeleniumJavaScriptExecutor

// exports.Eyes = parent.EyesFactory;
// exports.EyesSelenium = parent.EyesSelenium;
// exports.EyesVisualGrid = parent.EyesVisualGrid;

// eyes-common
exports.AccessibilityLevel = parent.AccessibilityLevel
exports.AccessibilityMatchSettings = parent.AccessibilityMatchSettings
exports.AccessibilityRegionType = parent.AccessibilityRegionType
exports.BatchInfo = parent.BatchInfo
exports.BrowserType = parent.BrowserType
exports.Configuration = parent.Configuration
exports.DeviceName = parent.DeviceName
exports.ExactMatchSettings = parent.ExactMatchSettings
exports.FloatingMatchSettings = parent.FloatingMatchSettings
exports.ImageMatchSettings = parent.ImageMatchSettings
exports.MatchLevel = parent.MatchLevel
exports.PropertyData = parent.PropertyData
exports.ProxySettings = parent.ProxySettings
exports.ScreenOrientation = parent.ScreenOrientation
exports.StitchMode = parent.StitchMode
exports.DebugScreenshotsProvider = parent.DebugScreenshotsProvider
exports.FileDebugScreenshotsProvider = parent.FileDebugScreenshotsProvider
exports.NullDebugScreenshotProvider = parent.NullDebugScreenshotProvider
exports.EyesError = parent.EyesError
exports.CoordinatesType = parent.CoordinatesType
exports.Location = parent.Location
exports.RectangleSize = parent.RectangleSize
exports.Region = parent.Region
exports.PropertyHandler = parent.PropertyHandler
exports.ReadOnlyPropertyHandler = parent.ReadOnlyPropertyHandler
exports.SimplePropertyHandler = parent.SimplePropertyHandler
exports.ImageDeltaCompressor = parent.ImageDeltaCompressor
exports.MutableImage = parent.MutableImage
exports.ConsoleLogHandler = parent.ConsoleLogHandler
exports.DebugLogHandler = parent.DebugLogHandler
exports.FileLogHandler = parent.FileLogHandler
exports.Logger = parent.Logger
exports.LogHandler = parent.LogHandler
exports.NullLogHandler = parent.NullLogHandler

// eyes-sdk-core
exports.ImageProvider = parent.ImageProvider
exports.FullPageCaptureAlgorithm = parent.FullPageCaptureAlgorithm
exports.EyesSimpleScreenshotFactory = parent.EyesSimpleScreenshotFactory
exports.CorsIframeHandle = parent.CorsIframeHandle
exports.CutProvider = parent.CutProvider
exports.FixedCutProvider = parent.FixedCutProvider
exports.NullCutProvider = parent.NullCutProvider
exports.UnscaledFixedCutProvider = parent.UnscaledFixedCutProvider
exports.ScaleProvider = parent.ScaleProvider
exports.FixedScaleProvider = parent.FixedScaleProvider
exports.FixedScaleProviderFactory = parent.FixedScaleProviderFactory
exports.PositionMemento = parent.PositionMemento
exports.PositionProvider = parent.PositionProvider
exports.RemoteSessionEventHandler = parent.RemoteSessionEventHandler
exports.SessionEventHandler = parent.SessionEventHandler
exports.ValidationInfo = parent.ValidationInfo
exports.ValidationResult = parent.ValidationResult
exports.CoordinatesTypeConversionError = parent.CoordinatesTypeConversionError
exports.DiffsFoundError = parent.DiffsFoundError
exports.NewTestError = parent.NewTestError
exports.OutOfBoundsError = parent.OutOfBoundsError
exports.TestFailedError = parent.TestFailedError
exports.MatchResult = parent.MatchResult
exports.NullRegionProvider = parent.NullRegionProvider
exports.RegionProvider = parent.RegionProvider
exports.RunningSession = parent.RunningSession
exports.SessionType = parent.SessionType
exports.FailureReports = parent.FailureReports
exports.TestResults = parent.TestResults
exports.TestResultsFormatter = parent.TestResultsFormatter
exports.TestResultsStatus = parent.TestResultsStatus
