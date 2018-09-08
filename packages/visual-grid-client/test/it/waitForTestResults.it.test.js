'use strict';
const {describe, it, before, after, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');
const testServer = require('../util/testServer');
const makeRenderingGridClient = require('../../src/sdk/renderingGridClient');
const {initConfig} = require('../../src/sdk/config');
const nock = require('nock');
const createFakeWrapper = require('../util/createFakeWrapper');
const {presult} = require('@applitools/functional-commons');

describe('waitForTestResults', () => {
  const apiKey = 'some api key';

  let getConfig, updateConfig, getInitialConfig;
  before(() => {
    const config = initConfig();
    getConfig = config.getConfig;
    updateConfig = config.updateConfig;
    getInitialConfig = config.getInitialConfig;
  });

  let baseUrl, closeServer;
  before(async () => {
    const server = await testServer({port: 3456}); // TODO fixed port avoids 'need-more-resources' for dom. Is this desired? should both paths be tested?
    baseUrl = `http://localhost:${server.port}`;
    closeServer = server.close;
  });

  after(async () => {
    await closeServer();
  });

  let wrapper;
  beforeEach(() => {
    wrapper = createFakeWrapper(baseUrl);

    nock(wrapper.baseUrl)
      .persist()
      .post(wrapper.resultsRoute)
      .reply(201, '', {location: 'uploaded_location'});
  });

  let waitForTestResults, openEyes;
  beforeEach(() => {
    const client = makeRenderingGridClient({
      getConfig,
      updateConfig,
      getInitialConfig,
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      wrapper,
    });

    waitForTestResults = client.waitForTestResults;
    openEyes = client.openEyes;
  });

  let prevEnv;
  beforeEach(() => {
    prevEnv = process.env;
    process.env = {};
  });

  afterEach(() => {
    process.env = prevEnv;
  });

  it('returns errors and results', async () => {
    const client = makeRenderingGridClient({
      getConfig,
      updateConfig,
      getInitialConfig,
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      wrapper,
    });

    waitForTestResults = client.waitForTestResults;
    openEyes = client.openEyes;

    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      apiKey,
    });

    const errMsg = 'Tag bad should be one of the good tags good1,good2';

    checkWindow({cdt: [], url: '', tag: 'bad'});
    const closePromise = close();
    expect((await presult(closePromise))[0].message).to.equal(errMsg);

    const {checkWindow: checkWindow2, close: close2} = await openEyes({
      wrappers: [wrapper],
    });

    checkWindow2({cdt: [], url: ''});
    const closePromise2 = close2();
    const [err, results] = await waitForTestResults([closePromise, closePromise2]);
    expect(err.message).to.equal(errMsg);
    expect(results.map(r => r.getAsExpected())[0]).to.equal(true);
  });
});
