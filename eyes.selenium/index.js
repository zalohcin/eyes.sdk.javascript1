exports.EyesWebDriverScreenshot = require('./lib/capture/EyesWebDriverScreenshot');
exports.EyesWebDriverScreenshotFactory = require('./lib/capture/EyesWebDriverScreenshotFactory');
exports.FirefoxScreenshotImageProvider = require('./lib/capture/FirefoxScreenshotImageProvider');
exports.FullPageCaptureAlgorithm = require('./lib/capture/FullPageCaptureAlgorithm');
exports.ImageProviderFactory = require('./lib/capture/ImageProviderFactory');
exports.SafariScreenshotImageProvider = require('./lib/capture/SafariScreenshotImageProvider');
exports.TakesScreenshotImageProvider = require('./lib/capture/TakesScreenshotImageProvider');

exports.EyesDriverOperationError = require('./lib/errors/EyesDriverOperationError');
exports.NoFramesError = require('./lib/errors/NoFramesError');

exports.FloatingRegionByElement = require('./lib/fluent/FloatingRegionByElement');
exports.FloatingRegionBySelector = require('./lib/fluent/FloatingRegionBySelector');
exports.FrameLocator = require('./lib/fluent/FrameLocator');
exports.IgnoreRegionByElement = require('./lib/fluent/IgnoreRegionByElement');
exports.IgnoreRegionBySelector = require('./lib/fluent/IgnoreRegionBySelector');
exports.SeleniumCheckSettings = require('./lib/fluent/SeleniumCheckSettings');
exports.Target = require('./lib/fluent/Target');

exports.Frame = require('./lib/frames/Frame');
exports.FrameChain = require('./lib/frames/FrameChain');

exports.CssTranslatePositionMemento = require('./lib/positioning/CssTranslatePositionMemento');
exports.CssTranslatePositionProvider = require('./lib/positioning/CssTranslatePositionProvider');
exports.ElementPositionMemento = require('./lib/positioning/ElementPositionMemento');
exports.ElementPositionProvider = require('./lib/positioning/ElementPositionProvider');
exports.FirefoxRegionPositionCompensation = require('./lib/positioning/FirefoxRegionPositionCompensation');
exports.ImageRotation = require('./lib/positioning/ImageRotation');
exports.NullRegionPositionCompensation = require('./lib/positioning/NullRegionPositionCompensation');
exports.RegionPositionCompensation = require('./lib/positioning/RegionPositionCompensation');
exports.RegionPositionCompensationFactory = require('./lib/positioning/RegionPositionCompensationFactory');
exports.SafariRegionPositionCompensation = require('./lib/positioning/SafariRegionPositionCompensation');
exports.ScrollPositionMemento = require('./lib/positioning/ScrollPositionMemento');
exports.ScrollPositionProvider = require('./lib/positioning/ScrollPositionProvider');
exports.StitchMode = require('./lib/positioning/StitchMode');

exports.MoveToRegionVisibilityStrategy = require('./lib/regionVisibility/MoveToRegionVisibilityStrategy');
exports.NopRegionVisibilityStrategy = require('./lib/regionVisibility/NopRegionVisibilityStrategy');
exports.RegionVisibilityStrategy = require('./lib/regionVisibility/RegionVisibilityStrategy');

exports.EyesTargetLocator = require('./lib/wrappers/EyesTargetLocator');
exports.EyesWebDriver = require('./lib/wrappers/EyesWebDriver');
exports.EyesWebElement = require('./lib/wrappers/EyesWebElement');
exports.EyesWebElementPromise = require('./lib/wrappers/EyesWebElementPromise');

exports.BordersAwareElementContentLocationProvider = require('./lib/BordersAwareElementContentLocationProvider');
exports.Eyes = require('./lib/Eyes');
exports.EyesSeleniumUtils = require('./lib/EyesSeleniumUtils');
exports.ImageOrientationHandler = require('./lib/ImageOrientationHandler');
exports.JavascriptHandler = require('./lib/JavascriptHandler');
exports.SeleniumJavaScriptExecutor = require('./lib/SeleniumJavaScriptExecutor');
