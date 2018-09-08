'use strict';
const {presult} = require('@applitools/functional-commons');

function makeWaitForTestResults({logger}) {
  return async function waitForTestResults(closePromises) {
    logger.log(`waitForTestResults: waiting for ${closePromises.length} tests`);
    const closeResults = await Promise.all(closePromises.map(presult));
    return closeResults
      .map(result => result[0] || result[1])
      .map(arr => (arr.length === 1 ? arr[0] : arr));
  };
}

module.exports = makeWaitForTestResults;
