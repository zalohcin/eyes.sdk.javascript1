'use strict';
const {presult} = require('@applitools/functional-commons');
const makeWaitForTestEnd = require('./makeWaitForTestEnd');
const storeBatchHandle = require('./storeBatchHandle');

function makeAbort({
  getCheckWindowPromises,
  wrappers,
  openEyesPromises,
  resolveTests,
  testController,
  batches,
  logger,
}) {
  const waitAndResolveTests = makeWaitForTestEnd({
    getCheckWindowPromises,
    openEyesPromises,
    logger,
  });

  return async () => {
    testController.setIsAbortedByUser();
    return waitAndResolveTests(async testIndex => {
      const [closeErr, closeResult] = await presult(wrappers[testIndex].abort());
      resolveTests[testIndex]();
      if (closeErr) {
        throw closeErr;
      }
      return closeResult;
    }).then(res => {
      storeBatchHandle(wrappers, batches);
      return res;
    });
  };
}

module.exports = makeAbort;
