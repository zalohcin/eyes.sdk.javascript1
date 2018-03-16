exports.AppOutputProvider = require('./lib/capture/AppOutputProvider');
exports.AppOutputWithScreenshot = require('./lib/capture/AppOutputWithScreenshot');
exports.EyesScreenshot = require('./lib/capture/EyesScreenshot');
exports.EyesScreenshotFactory = require('./lib/capture/EyesScreenshotFactory');
exports.EyesSimpleScreenshot = require('./lib/capture/EyesSimpleScreenshot');
exports.ImageProvider = require('./lib/capture/ImageProvider');

exports.CutProvider = require('./lib/cropping/CutProvider');
exports.FixedCutProvider = require('./lib/cropping/FixedCutProvider');
exports.NullCutProvider = require('./lib/cropping/NullCutProvider');
exports.UnscaledFixedCutProvider = require('./lib/cropping/UnscaledFixedCutProvider');

exports.DebugScreenshotsProvider = require('./lib/debug/DebugScreenshotsProvider');
exports.FileDebugScreenshotsProvider = require('./lib/debug/FileDebugScreenshotsProvider');
exports.NullDebugScreenshotProvider = require('./lib/debug/NullDebugScreenshotProvider');

exports.CoordinatesTypeConversionError = require('./lib/errors/CoordinatesTypeConversionError');
exports.DiffsFoundError = require('./lib/errors/DiffsFoundError');
exports.EyesError = require('./lib/errors/EyesError');
exports.NewTestError = require('./lib/errors/NewTestError');
exports.OutOfBoundsError = require('./lib/errors/OutOfBoundsError');
exports.TestFailedError = require('./lib/errors/TestFailedError');

exports.CheckSettings = require('./lib/fluent/CheckSettings');
exports.CheckTarget = require('./lib/fluent/CheckTarget');
exports.FloatingRegionByRectangle = require('./lib/fluent/FloatingRegionByRectangle');
exports.GetFloatingRegion = require('./lib/fluent/GetFloatingRegion');
exports.GetRegion = require('./lib/fluent/GetRegion');
exports.IgnoreRegionByRectangle = require('./lib/fluent/IgnoreRegionByRectangle');

exports.CoordinatesType = require('./lib/geometry/CoordinatesType');
exports.Location = require('./lib/geometry/Location');
exports.RectangleSize = require('./lib/geometry/RectangleSize');
exports.Region = require('./lib/geometry/Region');

exports.ImageDeltaCompressor = require('./lib/images/ImageDeltaCompressor');
exports.ImageUtils = require('./lib/images/ImageUtils');
exports.MutableImage = require('./lib/images/MutableImage');

exports.ConsoleLogHandler = require('./lib/logging/ConsoleLogHandler');
exports.FileLogHandler = require('./lib/logging/FileLogHandler');
exports.Logger = require('./lib/logging/Logger');
exports.LogHandler = require('./lib/logging/LogHandler');
exports.NullLogHandler = require('./lib/logging/NullLogHandler');

exports.AppOutput = require('./lib/match/AppOutput');
exports.ExactMatchSettings = require('./lib/match/ExactMatchSettings');
exports.FloatingMatchSettings = require('./lib/match/FloatingMatchSettings');
exports.ImageMatchSettings = require('./lib/match/ImageMatchSettings');
exports.MatchLevel = require('./lib/match/MatchLevel');
exports.MatchResult = require('./lib/match/MatchResult');
exports.MatchSingleWindowData = require('./lib/match/MatchSingleWindowData');
exports.MatchWindowData = require('./lib/match/MatchWindowData');
exports.MatchWindowDataWithScreenshot = require('./lib/match/MatchWindowDataWithScreenshot');

exports.ActualAppOutput = require('./lib/metadata/ActualAppOutput');
exports.Annotations = require('./lib/metadata/Annotations');
exports.BatchInfo = require('./lib/metadata/BatchInfo');
exports.Branch = require('./lib/metadata/Branch');
exports.ExpectedAppOutput = require('./lib/metadata/ExpectedAppOutput');
exports.Image = require('./lib/metadata/Image');
exports.ImageMatchSettings = require('./lib/metadata/ImageMatchSettings');
exports.SessionResults = require('./lib/metadata/SessionResults');
exports.StartInfo = require('./lib/metadata/StartInfo');

exports.InvalidPositionProvider = require('./lib/positioning/InvalidPositionProvider');
exports.NullRegionProvider = require('./lib/positioning/NullRegionProvider');
exports.PositionMemento = require('./lib/positioning/PositionMemento');
exports.PositionProvider = require('./lib/positioning/PositionProvider');
exports.RegionProvider = require('./lib/positioning/RegionProvider');

exports.RenderingInfo = require('./lib/renderer/RenderingInfo');
exports.RenderRequest = require('./lib/renderer/RenderRequest');
exports.RenderStatus = require('./lib/renderer/RenderStatus');
exports.RenderStatusResults = require('./lib/renderer/RenderStatusResults');
exports.RGridDom = require('./lib/renderer/RGridDom');
exports.RGridResource = require('./lib/renderer/RGridResource');
exports.RunningRender = require('./lib/renderer/RunningRender');

exports.ContextBasedScaleProvider = require('./lib/scaling/ContextBasedScaleProvider');
exports.ContextBasedScaleProviderFactory = require('./lib/scaling/ContextBasedScaleProviderFactory');
exports.FixedScaleProvider = require('./lib/scaling/FixedScaleProvider');
exports.FixedScaleProviderFactory = require('./lib/scaling/FixedScaleProviderFactory');
exports.NullScaleProvider = require('./lib/scaling/NullScaleProvider');
exports.ScaleProvider = require('./lib/scaling/ScaleProvider');
exports.ScaleProviderFactory = require('./lib/scaling/ScaleProviderFactory');
exports.ScaleProviderIdentityFactory = require('./lib/scaling/ScaleProviderIdentityFactory');

exports.PropertyData = require('./lib/server/PropertyData');
exports.ProxySettings = require('./lib/server/ProxySettings');
exports.RunningSession = require('./lib/server/RunningSession');
exports.ServerConnector = require('./lib/server/ServerConnector');
exports.SessionStartInfo = require('./lib/server/SessionStartInfo');
exports.SessionType = require('./lib/server/SessionType');

exports.MouseTrigger = require('./lib/triggers/MouseTrigger');
exports.TextTrigger = require('./lib/triggers/TextTrigger');
exports.Trigger = require('./lib/triggers/Trigger');

exports.BrowserNames = require('./lib/utils/BrowserNames');
exports.GeneralUtils = require('./lib/utils/GeneralUtils');
exports.OSNames = require('./lib/utils/OSNames');
exports.PropertyHandler = require('./lib/utils/PropertyHandler');
exports.ReadOnlyPropertyHandler = require('./lib/utils/ReadOnlyPropertyHandler');
exports.SimplePropertyHandler = require('./lib/utils/SimplePropertyHandler');
exports.StreamUtils = require('./lib/utils/StreamUtils');
exports.UserAgent = require('./lib/utils/UserAgent');

exports.AppEnvironment = require('./lib/AppEnvironment');
exports.ArgumentGuard = require('./lib/ArgumentGuard');
exports.BatchInfo = require('./lib/BatchInfo');
exports.EyesBase = require('./lib/EyesBase');
exports.EyesJsBrowserUtils = require('./lib/EyesJsBrowserUtils');
exports.EyesJsExecutor = require('./lib/EyesJsExecutor');
exports.FailureReports = require('./lib/FailureReports');
exports.MatchSingleWindowTask = require('./lib/MatchSingleWindowTask');
exports.MatchWindowTask = require('./lib/MatchWindowTask');
exports.PromiseFactory = require('./lib/PromiseFactory');
exports.RemoteSessionEventHandler = require('./lib/RemoteSessionEventHandler');
exports.RenderWindowTask = require('./lib/RenderWindowTask');
exports.SessionEventHandler = require('./lib/SessionEventHandler');
exports.TestResults = require('./lib/TestResults');
exports.TestResultsStatus = require('./lib/TestResultsStatus');
