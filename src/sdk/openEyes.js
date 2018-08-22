'use strict';
const makeCheckWindow = require('./checkWindow');
const makeCloseEyes = require('./closeEyes');
const {initWrappers, configureWrappers, openWrappers, apiKeyFailMsg} = require('./wrapperUtils');
const createLogger = require('./createLogger');

function makeOpenEyes({
  getError,
  setError,
  extractCssResourcesFromCdt,
  getBundledCssFromCdt,
  renderBatch,
  waitForRenderedStatus,
  getAllResources,
  resourceCache,
  renderThroat,
}) {
  return async function openEyes({
    appName,
    testName,
    browser = {width: 1024, height: 768},
    apiKey,
    showLogs = false,
    saveDebugData = false,
    wrappers,
    batchName,
    batchId,
    properties,
    baselineBranchName,
    baselineEnvName,
    baselineName,
    envName,
    ignoreCaret,
    isDisabled,
    matchLevel,
    matchTimeout,
    parentBranchName,
    branchName,
    proxy,
    saveFailedTests,
    saveNewTests,
    compareWithParentBranch,
    ignoreBaseline,
    serverUrl,
  }) {
    const logger = createLogger(showLogs);

    if (isDisabled) {
      logger.log('openEyes: isDisabled=true, skipping checks');
      return {
        checkWindow: disabledFunc('checkWindow'),
        close: disabledFunc('close'),
        abort: disabledFunc('abort'),
      };
    }

    if (!apiKey) {
      throw new Error(apiKeyFailMsg);
    }

    let checkWindowPromises = [];

    const browsers = Array.isArray(browser) ? browser : [browser];
    wrappers =
      wrappers ||
      initWrappers({count: browsers.length, apiKey, logHandler: logger.getLogHandler()});
    const renderWrapper = wrappers[0];

    configureWrappers({
      wrappers,
      isDisabled,
      batchName,
      batchId,
      properties,
      baselineBranchName,
      baselineEnvName,
      baselineName,
      envName,
      ignoreCaret,
      matchLevel,
      matchTimeout,
      parentBranchName,
      branchName,
      proxy,
      saveFailedTests,
      saveNewTests,
      compareWithParentBranch,
      ignoreBaseline,
      serverUrl,
    });

    await openWrappers({wrappers, browsers, appName, testName});

    const renderInfoPromise = renderWrapper
      .getRenderInfo()
      .then(renderInfo => {
        renderWrapper.setRenderingInfo(renderInfo);
        return renderInfo;
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          setError(new Error('Unauthorized access to Eyes server. Please check your API key.'));
        } else {
          setError(err);
        }
      });

    const checkWindow = makeCheckWindow({
      getError,
      saveDebugData,
      extractCssResourcesFromCdt,
      getBundledCssFromCdt,
      renderBatch,
      waitForRenderedStatus,
      getAllResources,
      renderInfoPromise,
      logger,
      getCheckWindowPromises,
      setCheckWindowPromises,
      browsers,
      setError,
      resourceCache,
      wrappers,
      renderWrapper,
      renderThroat,
    });

    const close = makeCloseEyes({getError, logger, getCheckWindowPromises, wrappers});

    return {
      checkWindow,
      close,
      abort,
    };

    function getCheckWindowPromises() {
      return checkWindowPromises;
    }

    function setCheckWindowPromises(promises) {
      checkWindowPromises = promises;
    }

    function disabledFunc(name) {
      return async () => {
        logger.log(`${name}: isDisabled=true, skipping checks`);
      };
    }

    function abort() {
      return Promise.all(wrappers.map(wrapper => wrapper.abortIfNotClosed()));
    }
  };
}

module.exports = makeOpenEyes;
