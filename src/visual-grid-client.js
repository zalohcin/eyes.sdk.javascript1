'use strict';
const makeVisualGridClient = require('./sdk/renderingGridClient');
const createLogger = require('./sdk/createLogger');
const {initConfig} = require('./sdk/config');

module.exports = {
  makeVisualGridClient,
  createLogger,
  initConfig,
};
