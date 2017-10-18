exports.AppOutput = require('./src/capture/AppOutput');
exports.AppOutputProvider = require('./src/capture/AppOutputProvider');
exports.AppOutputWithScreenshot = require('./src/capture/AppOutputWithScreenshot');
exports.EyesScreenshotFactory = require('./src/capture/EyesScreenshotFactory');
exports.ImageProvider = require('./src/capture/ImageProvider');

exports.CutProvider = require('./src/cutting/CutProvider');
exports.FixedCutProvider = require('./src/cutting/FixedCutProvider');
exports.NullCutProvider = require('./src/cutting/NullCutProvider');
exports.UnscaledFixedCutProvider = require('./src/cutting/UnscaledFixedCutProvider');

exports.DebugScreenshotsProvider = require('./src/debug/DebugScreenshotsProvider');
exports.FileDebugScreenshotsProvider = require('./src/debug/FileDebugScreenshotsProvider');
exports.NullDebugScreenshotProvider = require('./src/debug/NullDebugScreenshotProvider');

exports.DiffsFoundError = require('./src/errors/DiffsFoundError');
exports.NewTestError = require('./src/errors/NewTestError');
exports.TestFailedError = require('./src/errors/TestFailedError');

exports.CheckSettings = require('./src/fluent/CheckSettings');
exports.CheckTarget = require('./src/fluent/CheckTarget');
exports.FloatingRegionByRectangle = require('./src/fluent/FloatingRegionByRectangle');
exports.IgnoreRegionByRectangle = require('./src/fluent/IgnoreRegionByRectangle');

exports.PropertyHandler = require('./src/handlers/PropertyHandler');
exports.ReadOnlyPropertyHandler = require('./src/handlers/ReadOnlyPropertyHandler');
exports.SimplePropertyHandler = require('./src/handlers/SimplePropertyHandler');

exports.EyesScreenshot = require('./src/images/EyesScreenshot');
exports.ImageDeltaCompressor = require('./src/images/ImageDeltaCompressor');
exports.ImageUtils = require('./src/images/ImageUtils');
exports.MutableImage = require('./src/images/MutableImage');

exports.ConsoleLogHandler = require('./src/logging/ConsoleLogHandler');
exports.FileLogHandler = require('./src/logging/FileLogHandler');
exports.Logger = require('./src/logging/Logger');
exports.LogHandler = require('./src/logging/LogHandler');
exports.NullLogHandler = require('./src/logging/NullLogHandler');

exports.ExactMatchSettings = require('./src/match/ExactMatchSettings');
exports.ImageMatchSettings = require('./src/match/ImageMatchSettings');
exports.MatchLevel = require('./src/match/MatchLevel');
exports.MatchWindowData = require('./src/match/MatchWindowData');
exports.MatchWindowDataWithScreenshot = require('./src/match/MatchWindowDataWithScreenshot');

exports.CoordinatesType = require('./src/positioning/CoordinatesType');
exports.FloatingMatchSettings = require('./src/positioning/FloatingMatchSettings');
exports.FloatingRegionProvider = require('./src/positioning/FloatingRegionProvider');
exports.InvalidPositionProvider = require('./src/positioning/InvalidPositionProvider');
exports.Location = require('./src/positioning/Location');
exports.NullRegionProvider = require('./src/positioning/NullRegionProvider');
exports.PositionProvider = require('./src/positioning/PositionProvider');
exports.RectangleSize = require('./src/positioning/RectangleSize');
exports.Region = require('./src/positioning/Region');
exports.RegionProvider = require('./src/positioning/RegionProvider');

exports.ContextBasedScaleProvider = require('./src/scaling/ContextBasedScaleProvider');
exports.ContextBasedScaleProviderFactory = require('./src/scaling/ContextBasedScaleProviderFactory');
exports.FixedScaleProvider = require('./src/scaling/FixedScaleProvider');
exports.FixedScaleProviderFactory = require('./src/scaling/FixedScaleProviderFactory');
exports.NullScaleProvider = require('./src/scaling/NullScaleProvider');
exports.ScaleProvider = require('./src/scaling/ScaleProvider');
exports.ScaleProviderFactory = require('./src/scaling/ScaleProviderFactory');
exports.ScaleProviderIdentityFactory = require('./src/scaling/ScaleProviderIdentityFactory');

exports.MatchResult = require('./src/server/MatchResult');
exports.PropertyData = require('./src/server/PropertyData');
exports.ProxySettings = require('./src/server/ProxySettings');
exports.RunningSession = require('./src/server/RunningSession');
exports.ServerConnector = require('./src/server/ServerConnector');
exports.SessionStartInfo = require('./src/server/SessionStartInfo');
exports.SessionType = require('./src/server/SessionType');
exports.TestResults = require('./src/server/TestResults');

exports.MouseTrigger = require('./src/triggers/MouseTrigger');
exports.TextTrigger = require('./src/triggers/TextTrigger');
exports.Trigger = require('./src/triggers/Trigger');

exports.AppEnvironment = require('./src/AppEnvironment');
exports.ArgumentGuard = require('./src/ArgumentGuard');
exports.BatchInfo = require('./src/BatchInfo');
exports.BrowserNames = require('./src/BrowserNames');
exports.EyesBase = require('./src/EyesBase');
exports.FailureReports = require('./src/FailureReports');
exports.GeneralUtils = require('./src/GeneralUtils');
exports.MatchWindowTask = require('./src/MatchWindowTask');
exports.OSNames = require('./src/OSNames');
exports.PromiseFactory = require('./src/PromiseFactory');
exports.RemoteSessionEventHandler = require('./src/RemoteSessionEventHandler');
exports.SessionEventHandler = require('./src/SessionEventHandler');
exports.StreamUtils = require('./src/StreamUtils');
exports.UserAgent = require('./src/UserAgent');
