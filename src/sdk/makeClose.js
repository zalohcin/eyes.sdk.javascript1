'use strict';
const makeWaitForTestEnd = require('./makeWaitForTestEnd');
const {presult} = require('@applitools/functional-commons');

function makeClose({
  getCheckWindowPromises,
  wrappers,
  openEyesPromises,
  resolveTests,
  getError,
  logger,
}) {
  const waitAndResolveTests = makeWaitForTestEnd({
    getCheckWindowPromises,
    openEyesPromises,
  });

  return async throwEx => {
    let error;
    if ((error = getError())) {
      logger.log('closeEyes() aborting when started');
      throw error;
    }
    return waitAndResolveTests(async testIndex => {
      if ((error = getError())) {
        logger.log('closeEyes() aborting after checkWindow');
        resolveTests[testIndex]();
        throw error;
      }

      const [closeErr, closeResult] = await presult(wrappers[testIndex].close(throwEx));
      resolveTests[testIndex]();
      if (closeErr) {
        throw closeErr;
      }

      return closeResult;
    });
  };
}

module.exports = makeClose;
