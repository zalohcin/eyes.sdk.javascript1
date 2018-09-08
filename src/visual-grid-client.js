'use strict';
const makeVisualGridClient = require('./sdk/renderingGridClient');
const createLogger = require('./sdk/createLogger');
const {initConfig} = require('./sdk/config');
const {DiffsFoundError} = require('@applitools/eyes.sdk.core');

module.exports = {
  makeVisualGridClient,
  createLogger,
  initConfig,
  DiffsFoundError,
};
