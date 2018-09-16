'use strict';
const throatPkg = require('throat');
const getBatch = require('./getBatch');
const createLogger = require('./createLogger');
const makeGetAllResources = require('./getAllResources');
const makeExtractCssResources = require('./extractCssResources');
const makeFetchResource = require('./fetchResource');
const makeExtractCssResourcesFromCdt = require('./extractCssResourcesFromCdt');
const createResourceCache = require('./createResourceCache');
const makeWaitForRenderedStatus = require('./waitForRenderedStatus');
const makePutResources = require('./putResources');
const makeRenderBatch = require('./renderBatch');
const makeOpenEyes = require('./openEyes');
const makeWaitForTestResults = require('./waitForTestResults');
const makeOpenEyesLimitedConcurrency = require('./openEyesLimitedConcurrency');

function makeRenderingGridClient({
  getConfig,
  updateConfig,
  getInitialConfig,
  showLogs,
  renderStatusTimeout,
  renderStatusInterval,
  concurrency = Infinity,
  renderConcurrencyFactor = 5,
}) {
  const openEyesConcurrency = Number(getConfig({concurrency}).concurrency);

  if (isNaN(openEyesConcurrency)) {
    throw new Error('concurrency is not a number');
  }

  let lazyRenderInfo;
  const renderThroat = throatPkg(openEyesConcurrency * renderConcurrencyFactor);
  const logger = createLogger(showLogs);
  const resourceCache = createResourceCache();
  const fetchCache = createResourceCache();
  const extractCssResources = makeExtractCssResources(logger);
  const fetchResource = makeFetchResource(logger);
  const extractCssResourcesFromCdt = makeExtractCssResourcesFromCdt(extractCssResources);
  const putResources = makePutResources();
  const renderBatch = makeRenderBatch({putResources, resourceCache, fetchCache, logger});
  const waitForRenderedStatus = makeWaitForRenderedStatus({
    timeout: renderStatusTimeout,
    getStatusInterval: renderStatusInterval,
    logger,
  });
  const getAllResources = makeGetAllResources({
    resourceCache,
    extractCssResources,
    fetchResource,
    fetchCache,
  });

  const openEyes = makeOpenEyes({
    extractCssResourcesFromCdt,
    renderBatch,
    waitForRenderedStatus,
    getAllResources,
    renderThroat,
    getLazyRenderInfo,
    setLazyRenderInfo,
  });
  const openEyesLimitedConcurrency = makeOpenEyesLimitedConcurrency(
    openEyesWithConfig,
    openEyesConcurrency,
  );
  const waitForTestResults = makeWaitForTestResults({logger});

  const defaultBatch = getBatch(getInitialConfig());
  logger.log('new default batch', defaultBatch);
  updateConfig(defaultBatch);

  return {
    openEyes: openEyesLimitedConcurrency,
    waitForTestResults,
  };

  function openEyesWithConfig(args) {
    const config = getConfig(args);
    return openEyes(config);
  }

  function getLazyRenderInfo() {
    return lazyRenderInfo;
  }

  function setLazyRenderInfo(renderInfo) {
    lazyRenderInfo = renderInfo;
  }
}

module.exports = makeRenderingGridClient;
