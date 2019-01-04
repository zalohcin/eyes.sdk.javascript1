'use strict';
const makeRenderingGridClient = require('./sdk/renderingGridClient');
const createLogger = require('./sdk/createLogger');
const {makeGetConfig} = require('./sdk/config');
const {
  DiffsFoundError,
  TestResults,
  TestFailedError,
  TestResultsStatus,
} = require('@applitools/eyes-sdk-core');

module.exports = {
  makeVisualGridClient: makeRenderingGridClient,
  makeRenderingGridClient,
  createLogger,
  makeGetConfig,
  DiffsFoundError,
  TestResults,
  TestFailedError,
  TestResultsStatus,
};
