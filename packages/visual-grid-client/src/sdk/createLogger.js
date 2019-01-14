'use strict';

const {Logger} = require('@applitools/eyes-common');

function createLogger(showLogs) {
  return new Logger(showLogs);
}

module.exports = createLogger;
