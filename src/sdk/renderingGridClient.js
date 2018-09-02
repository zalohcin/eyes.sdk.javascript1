'use strict';
const throatPkg = require('throat');
const getBatch = require('./getBatch');
const createLogger = require('./createLogger');
const makeGetAllResources = require('./getAllResources');
const makeExtractCssResources = require('./extractCssResources');
const makeFetchResource = require('./fetchResource');
const makeExtractCssResourcesFromCdt = require('./extractCssResourcesFromCdt');
const createResourceCache = require('./createResourceCache');
const makeGetBundledCssFromCdt = require('./getBundledCssFromCdt');
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

  const renderThroat = throatPkg(openEyesConcurrency * renderConcurrencyFactor);

  let error;
  const logger = createLogger(showLogs);
  const resourceCache = createResourceCache();
  const fetchCache = createResourceCache();
  const extractCssResources = makeExtractCssResources(logger);
  const fetchResource = makeFetchResource(logger);
  const extractCssResourcesFromCdt = makeExtractCssResourcesFromCdt(extractCssResources);
  const getBundledCssFromCdt = makeGetBundledCssFromCdt({resourceCache, logger});
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
    setError,
    getError,
    extractCssResourcesFromCdt,
    getBundledCssFromCdt,
    renderBatch,
    waitForRenderedStatus,
    getAllResources,
    renderThroat,
  });
  const openEyesLimitedConcurrency = makeOpenEyesLimitedConcurrency(
    openEyesWithConfig,
    openEyesConcurrency,
  );
  const waitForTestResults = makeWaitForTestResults({logger, getError});

  const defaultBatch = getBatch(getInitialConfig());
  logger.log('new default batch', defaultBatch);
  updateConfig(defaultBatch);

  return {
    openEyes: openEyesLimitedConcurrency,
    waitForTestResults,
    getError,
  };

  function setError(err) {
    logger.log('error set', err);
    error = err;
  }

  function getError() {
    return error;
  }

  function openEyesWithConfig(args) {
    const config = getConfig(args);
    return openEyes(config);
  }
}

module.exports = makeRenderingGridClient;
