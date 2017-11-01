exports.CssTranslatePositionProvider = require('./src/positioning/CssTranslatePositionProvider');
exports.ElementPositionProvider = require('./src/positioning/ElementPositionProvider');
exports.Eyes = require('./src/Eyes');
exports.StitchMode = exports.Eyes.StitchMode;
exports.EyesRegionProvider = require('./src/EyesRegionProvider');
exports.EyesRemoteWebElement = require('./src/wrappers/EyesWebElement');
exports.EyesTargetLocator = require('./src/wrappers/EyesTargetLocator');
exports.EyesWebDriver = require('./src/wrappers/EyesWebDriver');
exports.EyesWebDriverScreenshot = require('./src/capture/EyesWebDriverScreenshot');
exports.Frame = require('./src/frames/Frame');
exports.FrameChain = require('./src/frames/FrameChain');
exports.ScrollPositionProvider = require('./src/positioning/ScrollPositionProvider');
exports.Target = require('./src/fluent/Target');

exports.CoreSDK = require('eyes.sdk');
