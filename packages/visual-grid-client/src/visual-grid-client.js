'use strict';

const { DiffsFoundError, TestResults, TestFailedError, TestResultsStatus } = require('@applitools/eyes-sdk-core');

const makeVisualGridClient = require('./sdk/visualGridClient');
const createLogger = require('./sdk/createLogger');
const {makeGetConfig} = require('./sdk/config');

module.exports = {
  makeVisualGridClient,
  createLogger,
  makeGetConfig,
  DiffsFoundError,
  TestResults,
  TestFailedError,
  TestResultsStatus,
};
