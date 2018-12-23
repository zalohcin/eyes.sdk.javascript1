'use strict';
const createLogger = require('../../src/sdk/createLogger');

module.exports = createLogger(process.env.APPLITOOLS_SHOW_LOGS);
