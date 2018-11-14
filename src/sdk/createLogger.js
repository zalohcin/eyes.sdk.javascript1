'use strict';
const {Logger, ConsoleLogHandler, NullLogHandler} = require('@applitools/eyes-sdk-core');

function createLogger(showLogs) {
  const logger = new Logger();
  const logHandler = showLogs ? new ConsoleLogHandler(true) : new NullLogHandler();
  logger.setLogHandler(logHandler);
  return logger;
}

module.exports = createLogger;
