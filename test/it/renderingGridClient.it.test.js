'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeRenderingGridClient = require('../../src/sdk/renderingGridClient');
const createFakeWrapper = require('../util/createFakeWrapper');
const {apiKeyFailMsg} = require('../../src/sdk/wrapperUtils');

const apiKey = 'api key';
const appName = 'app name';

describe('renderingGridClient', () => {
  it('sets a new batch', async () => {
    const wrapper = createFakeWrapper('http://some_url');
    const {openEyes} = makeRenderingGridClient({
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      apiKey,
      appName,
      renderWrapper: wrapper,
    });

    await openEyes({wrappers: [wrapper]});

    const batchId = wrapper.getBatch().toJSON().id;

    await openEyes({
      wrappers: [wrapper],
      apiKey,
    });

    const batchId2 = wrapper.getBatch().toJSON().id;
    expect(batchId).to.equal(batchId2);
  });

  it('validates presence of apiKey when openEyes and not at the creation of the client', async () => {
    const wrapper = createFakeWrapper('http://some_url');
    const {openEyes} = makeRenderingGridClient({
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      appName,
      renderWrapper: wrapper,
    });

    try {
      await openEyes({wrapper});
    } catch (err) {
      expect(err.message).to.equal(apiKeyFailMsg);
    }
  });
});
