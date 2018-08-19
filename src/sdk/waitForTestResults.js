'use strict';
const {presult} = require('@applitools/functional-commons');

function makeWaitForTestResults({logger, getError}) {
  return async function waitForTestResults(closePromises) {
    let error;
    if ((error = getError())) {
      logger.log('waitForTestResults() aborting when started');
      throw error;
    }

    const closeResults = await Promise.all(closePromises.map(presult));

    if ((error = getError())) {
      logger.log('waitForTestResults() aborting after closes');
      throw error;
    }

    const closeErrors = closeResults.filter(result => result[0]);
    if (closeErrors.length) {
      throw closeErrors[0][0];
    }

    return closeResults.map(result => result[1]);
  };
}

module.exports = makeWaitForTestResults;
