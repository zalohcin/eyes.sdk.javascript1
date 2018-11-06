'use strict';
const makeVisualGridClient = require('./sdk/renderingGridClient');
const createLogger = require('./sdk/createLogger');
const {makeGetConfig} = require('./sdk/config');
const {
  DiffsFoundError,
  TestResults,
  TestFailedError,
  TestResultsStatus,
} = require('@applitools/eyes.sdk.core');

module.exports = {
  makeVisualGridClient,
  createLogger,
  makeGetConfig,
  DiffsFoundError,
  TestResults,
  TestFailedError,
  TestResultsStatus,
};
