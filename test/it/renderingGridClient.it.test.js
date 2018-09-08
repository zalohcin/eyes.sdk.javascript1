'use strict';
const {describe, it, beforeEach, before} = require('mocha');
const {expect} = require('chai');
const makeRenderingGridClient = require('../../src/sdk/renderingGridClient');
const {initConfig} = require('../../src/sdk/config');

describe('renderingGridClient', () => {
  let wrapper;

  let getConfig, updateConfig, getInitialConfig;
  before(() => {
    const config = initConfig();
    getConfig = config.getConfig;
    updateConfig = config.updateConfig;
    getInitialConfig = config.getInitialConfig;
  });

  beforeEach(() => {
    wrapper = {
      getRenderInfo: async () => 'renderInfo',
      setRenderingInfo: function(value) {
        this.renderingInfo = value;
      },
    };
  });

  it('sets a new batch', async () => {
    expect(getConfig()).not.to.have.property('batchId');
    expect(getConfig()).not.to.have.property('batchName');

    makeRenderingGridClient({
      getConfig,
      updateConfig,
      getInitialConfig,
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      wrapper,
    });

    expect(getConfig()).to.have.property('batchId');
    expect(getConfig()).to.have.property('batchName');
    const batchId = getConfig().batchId;

    makeRenderingGridClient({
      getConfig,
      updateConfig,
      getInitialConfig,
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      wrapper,
    });

    expect(getConfig().batchId).not.to.equal(batchId);
  });
});
