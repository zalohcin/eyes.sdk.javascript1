'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeRenderingGridClient = require('../../src/sdk/renderingGridClient');
const {initConfig} = require('../../src/sdk/config');
const {getConfig, updateConfig, getInitialConfig} = initConfig();

describe('renderingGridClient', () => {
  it('sets a new batch', async () => {
    expect(getConfig()).not.to.have.property('batchId');
    expect(getConfig()).not.to.have.property('batchName');

    makeRenderingGridClient({
      getConfig,
      updateConfig,
      getInitialConfig,
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
    });

    expect(getConfig()).to.have.property('batchId');
    expect(getConfig()).to.have.property('batchName');
    const batchId = getConfig().batchId;

    makeRenderingGridClient({
      getConfig,
      updateConfig,
      getInitialConfig,
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
    });

    expect(getConfig().batchId).not.to.equal(batchId);
  });
});
