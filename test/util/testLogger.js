'use strict';
const {createLogger} = require('@applitools/eyes-sdk-utils');

module.exports = createLogger(process.env.APPLITOOLS_SHOW_LOGS);
