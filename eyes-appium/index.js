'use strict';

const parent = require('@applitools/eyes-selenium');

// Overridden & new classes
exports.Eyes = require('./lib/Eyes').Eyes;
exports.AppiumImageOrientationHandler = require('./lib/AppiumImageOrientationHandler').AppiumImageOrientationHandler;
exports.AppiumJavascriptHandler = require('./lib/AppiumJavascriptHandler').AppiumJavascriptHandler;
exports.AppiumJsCommandExtractor = require('./lib/AppiumJsCommandExtractor').AppiumJsCommandExtractor;
exports.EyesAppiumUtils = require('./lib/EyesAppiumUtils').EyesAppiumUtils;


// Classes from parent
exports.EyesWebDriverScreenshot = parent.EyesWebDriverScreenshot;
exports.EyesWebDriverScreenshotFactory = parent.EyesWebDriverScreenshotFactory;
exports.FirefoxScreenshotImageProvider = parent.FirefoxScreenshotImageProvider;
exports.FullPageCaptureAlgorithm = parent.FullPageCaptureAlgorithm;
exports.ImageProviderFactory = parent.ImageProviderFactory;
exports.SafariScreenshotImageProvider = parent.SafariScreenshotImageProvider;
exports.TakesScreenshotImageProvider = parent.TakesScreenshotImageProvider;

exports.EyesDriverOperationError = parent.EyesDriverOperationError;
exports.NoFramesError = parent.NoFramesError;

exports.FloatingRegionByElement = parent.FloatingRegionByElement;
exports.FloatingRegionBySelector = parent.FloatingRegionBySelector;
exports.FrameLocator = parent.FrameLocator;
exports.IgnoreRegionByElement = parent.IgnoreRegionByElement;
exports.IgnoreRegionBySelector = parent.IgnoreRegionBySelector;
exports.SeleniumCheckSettings = parent.SeleniumCheckSettings;
exports.Target = parent.Target;

exports.Frame = parent.Frame;
exports.FrameChain = parent.FrameChain;

exports.CssTranslatePositionMemento = parent.CssTranslatePositionMemento;
exports.CssTranslatePositionProvider = parent.CssTranslatePositionProvider;
exports.ElementPositionMemento = parent.ElementPositionMemento;
exports.ElementPositionProvider = parent.ElementPositionProvider;
exports.FirefoxRegionPositionCompensation = parent.FirefoxRegionPositionCompensation;
exports.ImageRotation = parent.ImageRotation;
exports.NullRegionPositionCompensation = parent.NullRegionPositionCompensation;
exports.OverflowAwareCssTranslatePositionProvider = parent.OverflowAwareCssTranslatePositionProvider;
exports.OverflowAwareScrollPositionProvider = parent.OverflowAwareScrollPositionProvider;
exports.RegionPositionCompensation = parent.RegionPositionCompensation;
exports.RegionPositionCompensationFactory = parent.RegionPositionCompensationFactory;
exports.SafariRegionPositionCompensation = parent.SafariRegionPositionCompensation;
exports.ScrollPositionMemento = parent.ScrollPositionMemento;
exports.ScrollPositionProvider = parent.ScrollPositionProvider;
exports.StitchMode = parent.StitchMode;

exports.MoveToRegionVisibilityStrategy = parent.MoveToRegionVisibilityStrategy;
exports.NopRegionVisibilityStrategy = parent.NopRegionVisibilityStrategy;
exports.RegionVisibilityStrategy = parent.RegionVisibilityStrategy;

exports.EyesTargetLocator = parent.EyesTargetLocator;
exports.EyesWebDriver = parent.EyesWebDriver;
exports.EyesWebElement = parent.EyesWebElement;
exports.EyesWebElementPromise = parent.EyesWebElementPromise;

exports.BordersAwareElementContentLocationProvider = parent.BordersAwareElementContentLocationProvider;
// exports.Eyes = parent.Eyes;
exports.EyesSeleniumUtils = parent.EyesSeleniumUtils;
exports.ImageOrientationHandler = parent.ImageOrientationHandler;
exports.JavascriptHandler = parent.JavascriptHandler;
exports.SeleniumJavaScriptExecutor = parent.SeleniumJavaScriptExecutor;
