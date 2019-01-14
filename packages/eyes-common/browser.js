'use strict';

/* eslint-disable max-len */

// Should be the same as index.js, but without classes that using Node's sdt libs like `fs`

// config
exports.Configuration = require('./lib/config/Configuration').Configuration;

// errors
exports.EyesError = require('./lib/errors/EyesError').EyesError;

// geometry
exports.CoordinatesType = require('./lib/geometry/CoordinatesType').CoordinatesType;
exports.Location = require('./lib/geometry/Location').Location;
exports.RectangleSize = require('./lib/geometry/RectangleSize').RectangleSize;
exports.Region = require('./lib/geometry/Region').Region;

// handler
exports.PropertyHandler = require('./lib/handler/PropertyHandler').PropertyHandler;
exports.ReadOnlyPropertyHandler = require('./lib/handler/ReadOnlyPropertyHandler').ReadOnlyPropertyHandler;
exports.SimplePropertyHandler = require('./lib/handler/SimplePropertyHandler').SimplePropertyHandler;

// images
exports.ImageDeltaCompressor = require('./lib/images/ImageDeltaCompressor').ImageDeltaCompressor;
exports.ImageUtils = require('./lib/images/ImageUtils').ImageUtils;
exports.MutableImage = require('./lib/images/MutableImage').MutableImage;

// logging
exports.ConsoleLogHandler = require('./lib/logging/ConsoleLogHandler').ConsoleLogHandler;
// exports.FileLogHandler = require('./lib/logging/FileLogHandler').FileLogHandler;
exports.Logger = require('./lib/logging/Logger').Logger;
exports.LogHandler = require('./lib/logging/LogHandler').LogHandler;
exports.NullLogHandler = require('./lib/logging/NullLogHandler').NullLogHandler;

// useragent
exports.BrowserNames = require('./lib/useragent/BrowserNames').BrowserNames;
exports.OSNames = require('./lib/useragent/OSNames').OSNames;
exports.UserAgent = require('./lib/useragent/UserAgent').UserAgent;

// utils
exports.ArgumentGuard = require('./lib/utils/ArgumentGuard').ArgumentGuard;
exports.ConfigUtils = require('./lib/utils/ConfigUtils').ConfigUtils;
exports.DateTimeUtils = require('./lib/utils/DateTimeUtils').DateTimeUtils;
exports.GeneralUtils = require('./lib/utils/GeneralUtils').GeneralUtils;
exports.PerformanceUtils = require('./lib/utils/PerformanceUtils').PerformanceUtils;
exports.StreamUtils = require('./lib/utils/StreamUtils').ReadableBufferStream;
exports.TypeUtils = require('./lib/utils/TypeUtils').TypeUtils;
