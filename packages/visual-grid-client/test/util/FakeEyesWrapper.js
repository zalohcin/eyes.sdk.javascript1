'use strict';
const {MatchResult, RenderStatusResults, RenderStatus} = require('@applitools/eyes.sdk.core');
const {URL} = require('url');
const {loadJsonFixture, loadFixtureBuffer} = require('./loadFixture');
const SOME_BATCH = 'SOME_BATCH';
const crypto = require('crypto');
const FakeRunningRender = require('./FakeRunningRender');

function compare(o1, o2) {
  return JSON.stringify(o1) === JSON.stringify(o2);
}

function getSha256Hash(content) {
  return crypto
    .createHash('sha256')
    .update(content)
    .digest('hex');
}

class FakeEyesWrapper {
  constructor({goodFilename, goodResourceUrls, goodTags}) {
    this._logger = {
      verbose: console.log,
      log: console.log,
    };
    this.goodFilename = goodFilename;
    this.goodResourceUrls = goodResourceUrls;
    this.goodTags = goodTags;
    this.batch;
    this.baseUrl = 'http://fake';
    this.resultsRoute = '/results_url';
  }

  async open(_appName, _testName, _viewportSize) {
    this.results = [];
  }

  async renderBatch(renderRequests) {
    const renderInfo = renderRequests[0].getRenderInfo();
    this.sizeMode = renderInfo.getSizeMode();
    this.selector = renderInfo.getSelector();
    this.region = renderInfo.getRegion();

    return renderRequests.map(renderRequest => this.getRunningRenderForRequest(renderRequest));
  }

  getRunningRenderForRequest(renderRequest) {
    const resources = renderRequest.getResources();
    const actualResources = resources.map(resource => ({
      url: resource.getUrl(),
      hash: resource.getSha256Hash(),
    }));
    const isGoodResources =
      !actualResources.length ||
      this.expectedResources.every(er => !!actualResources.find(ar => compare(er, ar)));

    const cdt = renderRequest.getDom().getDomNodes();
    const isGoodCdt = cdt.length === 0 || compare(cdt, this.expectedCdt); // allowing [] for easier testing (only need to pass `cdt:[]` in the test)
    const renderInfo = renderRequest.getRenderInfo();
    const sizeMode = renderInfo.getSizeMode();
    const browserName = renderRequest.getBrowserName();
    const selector = renderInfo.getSelector();
    const region = renderInfo.getRegion();

    const isGood = isGoodCdt && isGoodResources;
    const renderId = JSON.stringify({isGood, region, browserName, selector, sizeMode});

    return new FakeRunningRender(renderId, RenderStatus.RENDERED);
  }

  async getRenderStatus(renderIds) {
    return renderIds.map(renderId =>
      RenderStatusResults.fromObject({
        status: RenderStatus.RENDERED,
        imageLocation: renderId,
        userAgent: JSON.parse(renderId).browserName,
      }),
    );
  }

  async getRenderInfo() {
    return {getResultsUrl: () => `${this.baseUrl}${this.resultsRoute}`};
  }

  setRenderingInfo() {}

  async checkWindow({screenshotUrl, tag, domUrl, checkSettings}) {
    if (tag && this.goodTags && !this.goodTags.includes(tag))
      throw new Error(`Tag ${tag} should be one of the good tags ${this.goodTags}`);

    const result = new MatchResult();
    const {isGood, sizeMode, browserName: _browserName, selector, region} = JSON.parse(
      screenshotUrl,
    );
    const asExpected =
      isGood &&
      (!this.sizeMode || sizeMode === this.sizeMode) &&
      (!this.selector || selector === this.selector) &&
      compare(region, this.region);
    result.setAsExpected(asExpected);
    result.__domUrl = domUrl;
    result.__checkSettings = checkSettings;
    result.__tag = tag;
    this.results.push(result);
    return result;
  }

  createRGridDom({cdt: _cdt, resources: _resources}) {}

  async close() {
    this.closed = !this.aborted;
    if (this.results.find(r => !r.getAsExpected())) throw new Error('mismatch');
    return this.results;
  }

  async abortIfNotClosed() {
    this.aborted = !this.closed;
  }

  get expectedCdt() {
    return loadJsonFixture(this.goodFilename);
  }

  get expectedResources() {
    return this.goodResourceUrls.map(resourceUrl => ({
      url: resourceUrl,
      hash: getSha256Hash(loadFixtureBuffer(new URL(resourceUrl).pathname.slice(1))),
    }));
  }

  getBatch() {
    return this.batch || SOME_BATCH;
  }

  setBatch(batch) {
    this.batch = batch;
  }

  setBaselineBranchName(value) {
    this.baselineBranchName = value;
  }

  setBaselineEnvName(value) {
    this.baselineEnvName = value;
  }

  setBaselineName(value) {
    this.baselineName = value;
  }

  setEnvName(value) {
    this.envName = value;
  }

  setIgnoreCaret(value) {
    this.ignoreCaret = value;
  }

  setIsDisabled(value) {
    this.isDisabled = value;
  }

  setMatchLevel(value) {
    this.matchLevel = value;
  }

  setMatchTimeout(value) {
    this.matchTimeout = value;
  }

  setParentBranchName(value) {
    this.parentBranchName = value;
  }

  setBranchName(value) {
    this.branchName = value;
  }

  setProxy(value) {
    this.proxy = value;
  }

  setSaveFailedTests(value) {
    this.saveFailedTests = value;
  }

  setSaveNewTests(value) {
    this.saveNewTests = value;
  }

  setCompareWithParentBranch(value) {
    this.compareWithParentBranch = value;
  }

  setIgnoreBaseline(value) {
    this.ignoreBaseline = value;
  }

  setServerUrl(value) {
    this.serverUrl = value;
  }

  async getInferredEnvironment() {
    return this.inferredEnvironment;
  }

  setInferredEnvironment(value) {
    this.inferredEnvironment = value;
  }
}

module.exports = FakeEyesWrapper;
