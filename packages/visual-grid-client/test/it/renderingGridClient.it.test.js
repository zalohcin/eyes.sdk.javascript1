'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeRenderingGridClient = require('../../src/sdk/renderingGridClient');
const createFakeWrapper = require('../util/createFakeWrapper');

const apiKey = 'api key';

describe('renderingGridClient', () => {
  it('sets a new batch', async () => {
    const {openEyes} = makeRenderingGridClient({
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
    });

    const wrapper = createFakeWrapper('http://some_url');
    await openEyes({
      wrappers: [wrapper],
      apiKey,
    });

    const batchId = wrapper.getBatch().toJSON().id;

    await openEyes({
      wrappers: [wrapper],
      apiKey,
    });

    const batchId2 = wrapper.getBatch().toJSON().id;
    expect(batchId).to.equal(batchId2);
  });
});
