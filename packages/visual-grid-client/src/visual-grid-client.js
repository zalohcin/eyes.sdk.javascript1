'use strict';

const { DiffsFoundError, TestResults, TestFailedError, TestResultsStatus } = require('@applitools/eyes-sdk-core');

const makeRenderingGridClient = require('./sdk/renderingGridClient');
const createLogger = require('./sdk/createLogger');
const {makeGetConfig} = require('./sdk/config');

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
