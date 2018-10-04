'use strict';

const domNodesToCdt = require('./src/browser-util/domNodesToCdt');
const extractResources = require('./src/browser-util/extractResources');
const {processDocument} = require('./src/browser-util/processResources');

module.exports = {
  domNodesToCdt,
  extractResources,
  processDocument,
};
