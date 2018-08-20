'use strict';
const {describe, it, before, after, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');
const makeRenderingGridClient = require('../../src/sdk/renderingGridClient');
const FakeEyesWrapper = require('../util/FakeEyesWrapper');
const createFakeWrapper = require('../util/createFakeWrapper');
const testServer = require('../util/testServer');
const {loadJsonFixture, loadFixtureBuffer} = require('../util/loadFixture');
const {promisify: p} = require('util');
const nock = require('nock');
const psetTimeout = p(setTimeout);
const {presult} = require('@applitools/functional-commons');
const {
  RenderStatus,
  RenderStatusResults,
  Region,
  IgnoreRegionByRectangle,
} = require('@applitools/eyes.sdk.core');
const {initConfig} = require('../../src/sdk/config');
const {apiKeyFailMsg} = require('../../src/sdk/wrapperUtils');

describe('openEyes', () => {
  let baseUrl, closeServer, wrapper, openEyes, prevEnv;
  const apiKey = 'some api key';

  before(async () => {
    const server = await testServer({port: 3456}); // TODO fixed port avoids 'need-more-resources' for dom. Is this desired? should both paths be tested?
    baseUrl = `http://localhost:${server.port}`;
    closeServer = server.close;
  });

  after(async () => {
    await closeServer();
  });

  beforeEach(() => {
    prevEnv = process.env;
    process.env = {};

    const {getConfig, updateConfig, getInitialConfig} = initConfig();
    openEyes = makeRenderingGridClient({
      getConfig,
      updateConfig,
      getInitialConfig,
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
    }).openEyes;

    wrapper = createFakeWrapper(baseUrl);

    nock(wrapper.baseUrl)
      .persist()
      .post(wrapper.resultsRoute)
      .reply(201, '', {location: 'uploaded_location'});
  });

  afterEach(() => {
    process.env = prevEnv;
  });

  it("doesn't throw exception", async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      apiKey,
    });

    checkWindow({cdt: [], tag: 'good1', url: `${baseUrl}/test.html`});
    expect((await close())[0].map(r => r.getAsExpected())).to.eql([true]);
  });

  it('throws with bad tag', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      apiKey,
    });
    checkWindow({cdt: [], resourceUrls: [], tag: 'bad!', url: `${baseUrl}/test.html`});
    await psetTimeout(0); // because FakeEyesWrapper throws, and then the error is set async and will be read in the next call to close()
    expect((await presult(close()))[0].message).to.equal(
      `Tag bad! should be one of the good tags good1,good2`,
    );
  });

  it('passes with correct dom', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      apiKey,
    });

    const resourceUrls = wrapper.goodResourceUrls;
    const cdt = loadJsonFixture('test.cdt.json');
    checkWindow({resourceUrls, cdt, tag: 'good1', url: `${baseUrl}/test.html`});

    expect((await close())[0].map(r => r.getAsExpected())).to.eql([true]);
  });

  it('fails with incorrect dom', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      apiKey,
    });
    const resourceUrls = ['smurfs.jpg', 'test.css'];
    const cdt = loadJsonFixture('test.cdt.json');
    cdt.find(node => node.nodeValue === "hi, I'm red").nodeValue = "hi, I'm green";

    checkWindow({resourceUrls, cdt, tag: 'good1', url: `${baseUrl}/test.html`});

    expect((await presult(close()))[0].message).to.equal('mismatch');
  });

  it('renders multiple viewport sizes', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [
        createFakeWrapper(baseUrl),
        createFakeWrapper(baseUrl),
        createFakeWrapper(baseUrl),
      ],
      browser: [{width: 320, height: 480}, {width: 640, height: 768}, {width: 1600, height: 900}],
      apiKey,
    });

    const resourceUrls = wrapper.goodResourceUrls;
    const cdt = loadJsonFixture('test.cdt.json');
    checkWindow({resourceUrls, cdt, tag: 'good1', url: `${baseUrl}/test.html`});
    expect(
      (await close()).map(wrapperResult => wrapperResult.map(r2 => r2.getAsExpected())),
    ).to.eql([[true], [true], [true]]);
  });

  it('handles `batchName` and `batchId` param', async () => {
    const batchName = `some batch name ${Date.now()}`;
    const batchId = `some batch ID ${Date.now()}`;
    await openEyes({
      wrappers: [wrapper],
      apiKey,
      batchName,
      batchId,
    });

    expect(wrapper.getBatch().getName()).to.equal(batchName);
    expect(wrapper.getBatch().getId()).to.equal(batchId);
  });

  it('renders the correct sizeMode', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      browser: {width: 320, height: 480},
      apiKey,
    });

    const resourceUrls = wrapper.goodResourceUrls;
    const cdt = loadJsonFixture('test.cdt.json');
    checkWindow({
      resourceUrls,
      cdt,
      tag: 'good1',
      sizeMode: 'some size mode',
      url: `${baseUrl}/test.html`,
    });
    expect((await close())[0].map(r => r.getAsExpected())).to.eql([true]);
  });

  it('runs matchWindow in the correct order', async () => {
    const wrapper1 = new FakeEyesWrapper({goodFilename: 'test.cdt.json', goodResourceUrls: []});
    const wrapper2 = new FakeEyesWrapper({goodFilename: 'test.cdt.json', goodResourceUrls: []});

    wrapper1.checkWindow = async function({tag}) {
      if (tag === 'one') {
        await psetTimeout(200);
      } else if (tag === 'two') {
        await psetTimeout(50);
      }
      this.results.push(`${tag}1`);
    };

    wrapper2.checkWindow = async function({tag}) {
      if (tag === 'one') {
        await psetTimeout(150);
      } else if (tag === 'two') {
        await psetTimeout(150);
      }
      this.results.push(`${tag}2`);
    };

    wrapper1.close = wrapper2.close = function() {
      return this.results;
    };

    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper1, wrapper2],
      browser: [{width: 320, height: 480}, {width: 640, height: 768}],
      apiKey,
    });

    const resourceUrls = wrapper.goodResourceUrls;
    const cdt = loadJsonFixture('test.cdt.json');
    checkWindow({resourceUrls, cdt, tag: 'one', url: `${baseUrl}/test.html`});
    checkWindow({resourceUrls, cdt, tag: 'two', url: `${baseUrl}/test.html`});
    checkWindow({resourceUrls, cdt, tag: 'three', url: `${baseUrl}/test.html`});
    expect(await close()).to.eql([['one1', 'two1', 'three1'], ['one2', 'two2', 'three2']]);
  });

  it('handles resourceContents in checkWindow', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      apiKey,
    });

    const blobUrl = `blob.css`;
    const resourceContents = {
      [blobUrl]: {
        url: blobUrl,
        type: 'text/css',
        value: loadFixtureBuffer('blob.css'),
      },
    };

    wrapper.goodResourceUrls = [`${baseUrl}/blob.css`, `${baseUrl}/smurfs4.jpg`];

    checkWindow({cdt: [], resourceContents, tag: 'good1', url: `${baseUrl}/test.html`});
    expect((await close())[0].map(r => r.getAsExpected())).to.eql([true]);
  });

  it('handles "selector" sizeMode', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      apiKey,
    });

    checkWindow({cdt: [], url: 'some url', selector: 'some selector'});
    expect((await close())[0].map(r => r.getAsExpected())).to.eql([true]);
  });

  it('handles "region" sizeMode', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      apiKey,
    });

    checkWindow({cdt: [], url: 'some url', region: {width: 1, height: 2, left: 3, top: 4}});
    expect((await close())[0].map(r => r.getAsExpected())).to.eql([true]);
  });

  it('renders the correct browser', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      browser: {width: 320, height: 480, name: 'ucbrowser'},
      url: `${baseUrl}/test.html`,
      apiKey,
    });

    const resourceUrls = wrapper.goodResourceUrls;
    const cdt = loadJsonFixture('test.cdt.json');
    checkWindow({
      resourceUrls,
      cdt,
      tag: 'good1',
      sizeMode: 'some size mode',
      url: `${baseUrl}/test.html`,
    });
    await close();
    expect(await wrapper.getInferredEnvironment()).to.equal('useragent:ucbrowser');
  });

  it('handles error during getRenderInfo', async () => {
    let error;
    wrapper.getRenderInfo = async () => {
      await psetTimeout(0);
      throw new Error('getRenderInfo');
    };
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      apiKey,
    });

    checkWindow({resourceUrls: [], cdt: [], url: `bla`});
    await psetTimeout(50);
    expect(() => checkWindow({resourceUrls: [], cdt: [], url: `bla`})).to.throw(/^getRenderInfo$/);
    error = await close().then(x => x, err => err);
    expect(error.message).to.equal('getRenderInfo');
  });

  it('handles error during rendering', async () => {
    let error;
    wrapper.renderBatch = async () => {
      throw new Error('renderBatch');
    };
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      url: `bla`,
      apiKey,
    });

    checkWindow({resourceUrls: [], cdt: [], url: `bla`});
    await psetTimeout(0);
    expect(() => checkWindow({resourceUrls: [], cdt: [], url: `bla`})).to.throw(/^renderBatch$/);
    error = await close().then(x => x, err => err);
    expect(error.message).to.equal('renderBatch');
  });

  it('handles error during checkWindow', async () => {
    let error;
    wrapper.checkWindow = async () => {
      throw new Error('checkWindow');
    };
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      apiKey,
    });

    checkWindow({resourceUrls: [], cdt: [], url: `bla`});
    await psetTimeout(0);
    expect(() => checkWindow({resourceUrls: [], cdt: [], url: `bla`})).to.throw(/^checkWindow$/);
    error = await close().then(x => x, err => err);
    expect(error.message).to.equal('checkWindow');
  });

  it('throws error during close', async () => {
    let error;
    wrapper.close = async () => {
      await psetTimeout(0);
      throw new Error('close');
    };
    const {close} = await openEyes({
      wrappers: [wrapper],
      apiKey,
    });

    error = await close().then(x => x, err => err);
    expect(error.message).to.equal('close');
  });

  it('runs open/close with max concurrency', async () => {
    const wrapper1 = createFakeWrapper(baseUrl);
    const wrapper2 = createFakeWrapper(baseUrl);
    const wrapper3 = createFakeWrapper(baseUrl);

    let flag;
    wrapper3.open = async () => {
      flag = true;
    };

    const {getConfig, updateConfig, getInitialConfig} = initConfig();
    openEyes = makeRenderingGridClient({
      getConfig,
      updateConfig,
      getInitialConfig,
      concurrency: 2,
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
    }).openEyes;

    const {close} = await openEyes({wrappers: [wrapper1], apiKey});
    await openEyes({wrappers: [wrapper2], apiKey});
    openEyes({wrappers: [wrapper3], apiKey});
    expect(flag).to.equal(undefined);
    await close();
    expect(flag).to.equal(true);
  });

  it('ends throat job when close throws', async () => {
    wrapper.close = async () => {
      await psetTimeout(0);
      throw new Error('close');
    };

    const {getConfig, updateConfig, getInitialConfig} = initConfig();
    openEyes = makeRenderingGridClient({
      getConfig,
      updateConfig,
      getInitialConfig,
      concurrency: 1,
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
    }).openEyes;

    const {close} = await openEyes({wrappers: [wrapper], apiKey});
    const err1 = await close().then(x => x, err => err);
    expect(err1.message).to.equal('close');
    const {close: close2} = await Promise.race([
      openEyes({wrappers: [wrapper], apiKey}),
      psetTimeout(100).then(() => ({close: 'not resolved'})),
    ]);
    expect(close2).not.to.equal('not resolved');
    const err2 = await close2().then(x => x, err => err);
    expect(err2.message).to.equal('close');
  });

  describe('max concurrency for render', () => {
    beforeEach(() => {
      const {getConfig, updateConfig, getInitialConfig} = initConfig();
      openEyes = makeRenderingGridClient({
        getConfig,
        updateConfig,
        getInitialConfig,
        concurrency: 2,
        renderConcurrencyFactor: 1,
        showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      }).openEyes;
    });

    let counter;
    let finishRenders;
    beforeEach(() => {
      counter = 0;
      finishRenders = [];
      wrapper.getRenderStatus = () =>
        new Promise(resolve => {
          counter++;
          finishRenders.push(() =>
            resolve([
              RenderStatusResults.fromObject({
                status: RenderStatus.RENDERED,
                imageLocation: JSON.stringify({isGood: true}),
              }),
            ]),
          );
        });
    });

    it('runs renders with max concurrency', async () => {
      const {checkWindow, close} = await openEyes({wrappers: [wrapper], apiKey});
      checkWindow({url: '', cdt: [], sizeMode: null});
      await psetTimeout(0);
      checkWindow({url: '', cdt: [], sizeMode: null});
      await psetTimeout(0);
      checkWindow({url: '', cdt: [], sizeMode: null});
      await psetTimeout(0);
      const expected1 = counter;
      finishRenders[0]();
      await psetTimeout(0);
      const expected2 = counter;
      finishRenders[1]();
      finishRenders[2]();
      await close();
      expect(expected1).to.equal(2);
      expect(expected2).to.equal(3);
      expect(counter).to.equal(3);
    });

    it('runs renders with max concurrency for multiple browsers', async () => {
      const {checkWindow, close} = await openEyes({
        wrappers: [wrapper, wrapper],
        browser: [{width: 1, height: 1}, {width: 2, height: 2}],
        apiKey,
      });

      checkWindow({url: '', cdt: [], sizeMode: null});
      await psetTimeout(0);
      checkWindow({url: '', cdt: [], sizeMode: null});
      await psetTimeout(0);
      const expected1 = counter;
      finishRenders[0]();
      await psetTimeout(0);
      const expected2 = counter;
      finishRenders[1]();
      finishRenders[2]();
      finishRenders[3]();
      await close();
      expect(expected1).to.equal(2);
      expect(expected2).to.equal(4);
      expect(counter).to.equal(4);
    });

    it('runs renders with max concurrency between open/close', async () => {
      const {checkWindow, close} = await openEyes({
        wrappers: [wrapper],
        apiKey,
      });

      const {checkWindow: checkWindow2, close: close2} = await openEyes({
        wrappers: [wrapper],
        apiKey,
      });

      checkWindow({url: '', cdt: [], sizeMode: null});
      await psetTimeout(0);

      checkWindow2({url: '', cdt: [], sizeMode: null});
      await psetTimeout(0);

      checkWindow({url: '', cdt: [], sizeMode: null});
      await psetTimeout(0);

      checkWindow2({url: '', cdt: [], sizeMode: null});
      await psetTimeout(0);

      const expected1 = counter;
      finishRenders[0]();
      await psetTimeout(0);

      const expected2 = counter;
      finishRenders[1]();
      finishRenders[2]();
      finishRenders[3]();

      await close();
      await close2();
      expect(expected1).to.equal(2);
      expect(expected2).to.equal(4);
      expect(counter).to.equal(4);
    });
  });

  it('handles render status timeout when second checkWindow starts AFTER timeout of previous checkWindow', async () => {
    wrapper.getRenderStatus = async () => {
      await psetTimeout(0);
      const rs = new RenderStatusResults();
      rs.setStatus(RenderStatus.RENDERING);
      return [rs];
    };

    const {getConfig, updateConfig, getInitialConfig} = initConfig();
    openEyes = makeRenderingGridClient({
      getConfig,
      updateConfig,
      getInitialConfig,
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      renderStatusTimeout: 50,
      renderStatusInterval: 50,
    }).openEyes;

    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      apiKey,
    });

    checkWindow({resourceUrls: [], cdt: [], url: 'bla', tag: 'good1'});
    await psetTimeout(150);
    expect(() => checkWindow({resourceUrls: [], cdt: [], url: 'bla', tag: 'good1'})).to.throw(
      /^failed to render screenshot$/,
    );

    const [err3] = await presult(close());
    expect(err3.message).to.equal('failed to render screenshot');
  });

  it('handles render status timeout when second checkWindow starts BEFORE timeout of previous checkWindow', async () => {
    wrapper.getRenderStatus = async () => {
      await psetTimeout(0);
      const rs = new RenderStatusResults();
      rs.setStatus(RenderStatus.RENDERING);
      return [rs];
    };

    const {getConfig, updateConfig, getInitialConfig} = initConfig();
    openEyes = makeRenderingGridClient({
      getConfig,
      updateConfig,
      getInitialConfig,
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      renderStatusTimeout: 150,
      renderStatusInterval: 50,
    }).openEyes;

    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      apiKey,
    });

    checkWindow({resourceUrls: [], cdt: [], url: 'bla', tag: 'good1'});
    await psetTimeout(0);
    checkWindow({resourceUrls: [], cdt: [], url: 'bla', tag: 'good1'});
    await psetTimeout(200);
    const [err3] = await presult(close());
    expect(err3.message).to.equal('failed to render screenshot');
  });

  it('sets configuration on wrappers', () => {
    openEyes({
      wrappers: [wrapper],
      url: 'bla',
      apiKey,
      baselineBranchName: 'baselineBranchName',
      baselineEnvName: 'baselineEnvName',
      baselineName: 'baselineName',
      envName: 'envName',
      ignoreCaret: 'ignoreCaret',
      isDisabled: false,
      matchLevel: 'matchLevel',
      matchTimeout: 'matchTimeout',
      parentBranchName: 'parentBranchName',
      branchName: 'branchName',
      proxy: 'proxy',
      saveFailedTests: 'saveFailedTests',
      saveNewTests: 'saveNewTests',
      compareWithParentBranch: 'compareWithParentBranch',
      ignoreBaseline: 'ignoreBaseline',
      serverUrl: 'serverUrl',
    });

    expect(wrapper.baselineBranchName).to.equal('baselineBranchName');
    expect(wrapper.baselineEnvName).to.equal('baselineEnvName');
    expect(wrapper.baselineName).to.equal('baselineName');
    expect(wrapper.envName).to.equal('envName');
    expect(wrapper.ignoreCaret).to.equal('ignoreCaret');
    expect(wrapper.isDisabled).to.equal(false);
    expect(wrapper.matchLevel).to.equal('matchLevel');
    expect(wrapper.matchTimeout).to.equal('matchTimeout');
    expect(wrapper.parentBranchName).to.equal('parentBranchName');
    expect(wrapper.branchName).to.equal('branchName');
    expect(wrapper.proxy).to.equal('proxy');
    expect(wrapper.saveFailedTests).to.equal('saveFailedTests');
    expect(wrapper.saveNewTests).to.equal('saveNewTests');
    expect(wrapper.compareWithParentBranch).to.equal('compareWithParentBranch');
    expect(wrapper.ignoreBaseline).to.equal('ignoreBaseline');
    expect(wrapper.serverUrl).to.equal('serverUrl');
  });

  it("doesn't do anything when isDisabled", async () => {
    const {checkWindow, close} = await openEyes({
      isDisabled: true,
      wrappers: [{_logger: console}],
    });

    checkWindow({});
    expect(await close()).to.equal(undefined);
  });

  it('throws missing apiKey msg', async () => {
    const err = await openEyes({}).then(x => x, err => err);
    expect(err.message).to.equal(apiKeyFailMsg);
  });

  it("doesn't init wrapper when isDisabled", async () => {
    const result = await openEyes({isDisabled: true}).then(x => x, err => err);
    expect(result).not.to.be.instanceof(Error);
  });

  it('handles ignore regions', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      apiKey,
    });
    const region = {left: 1, top: 2, width: 3, height: 4};
    checkWindow({
      url: '',
      // resourceUrls: [],
      cdt: [],
      ignore: [region],
    });
    const [results] = await close();
    expect(results[0].__checkSettings.getIgnoreRegions()).to.eql([
      new IgnoreRegionByRectangle(Region.fromObject(region)),
    ]);
  });

  it('handles abort', async () => {
    const wrapper1 = createFakeWrapper(baseUrl);
    const wrapper2 = createFakeWrapper(baseUrl);
    const {abort} = await openEyes({
      wrappers: [wrapper1, wrapper2],
      browser: [{width: 1, height: 2}, {width: 3, height: 4}],
      apiKey,
    });

    await abort();
    expect(wrapper1.aborted).to.equal(true);
    expect(wrapper2.aborted).to.equal(true);
  });
});
