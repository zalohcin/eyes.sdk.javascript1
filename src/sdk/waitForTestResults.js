'use strict';
const {presult} = require('@applitools/functional-commons');

function makeWaitForTestResults({logger}) {
  return async function waitForTestResults(closePromises) {
    logger.log(`waitForTestResults: waiting for ${closePromises.length} tests`);
    const closeResults = await Promise.all(closePromises.map(presult));
    return closeResults.map(result => {
      if (result[0]) {
        return result[0]; // exception
      } else {
        const wrapperResults = result[1];

        // might be undefined if openEyes was passed isDisabled=true
        if (wrapperResults) {
          return wrapperResults.length === 1 ? wrapperResults[0] : wrapperResults;
        }
      }
    });
  };
}

module.exports = makeWaitForTestResults;
