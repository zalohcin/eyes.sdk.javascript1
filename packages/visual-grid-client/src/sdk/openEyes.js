'use strict';
const makeCheckWindow = require('./checkWindow');
const makeCloseEyes = require('./closeEyes');
const {
  initWrappers,
  configureWrappers,
  openWrappers,
  apiKeyFailMsg,
  authorizationErrMsg,
} = require('./wrapperUtils');
const createLogger = require('./createLogger');

function makeOpenEyes({
  extractCssResourcesFromCdt,
  getBundledCssFromCdt,
  renderBatch,
  waitForRenderedStatus,
  getAllResources,
  renderThroat,
  getLazyRenderInfo,
  setLazyRenderInfo,
  uploadResource,
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
    let error;
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

    const renderWrapper = wrappers[0];

    const renderInfoPromise = getLazyRenderInfo()
      ? Promise.resolve(getLazyRenderInfo()).then(() => {
          renderWrapper.setRenderingInfo(getLazyRenderInfo());
          return getLazyRenderInfo();
        })
      : renderWrapper
          .getRenderInfo()
          .then(_renderInfo => {
            setLazyRenderInfo(_renderInfo);
            renderWrapper.setRenderingInfo(_renderInfo);
            return _renderInfo;
          })
          .catch(err => {
            if (err.response && err.response.status === 401) {
              err = new Error(authorizationErrMsg);
            }

            setLazyRenderInfo(err);
            return err;
          });

    const [renderInfo] = await Promise.all([
      renderInfoPromise,
      openWrappers({wrappers, browsers, appName, testName}),
    ]);

    if (renderInfo instanceof Error) {
      throw renderInfo;
    }

    const checkWindow = makeCheckWindow({
      getError,
      saveDebugData,
      extractCssResourcesFromCdt,
      getBundledCssFromCdt,
      renderBatch,
      waitForRenderedStatus,
      getAllResources,
      renderInfo,
      logger,
      getCheckWindowPromises,
      setCheckWindowPromises,
      browsers,
      setError,
      wrappers,
      renderWrapper,
      renderThroat,
      uploadResource,
    });

    const close = makeCloseEyes({getError, logger, getCheckWindowPromises, wrappers});

    return {
      checkWindow,
      close,
      abort,
    };

    function setError(err) {
      logger.log('error set in test', testName, err);
      error = err;
    }

    function getError() {
      return error;
    }

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
