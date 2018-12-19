'use strict';
const makeVisualGridClient = require('./sdk/renderingGridClient');
const configParams = require('./sdk/configParams');
const {
  DiffsFoundError,
  TestResults,
  TestFailedError,
  TestResultsStatus,
} = require('@applitools/eyes-sdk-core');

module.exports = {
  configParams,
  makeVisualGridClient,
  DiffsFoundError,
  TestResults,
  TestFailedError,
  TestResultsStatus,
};
