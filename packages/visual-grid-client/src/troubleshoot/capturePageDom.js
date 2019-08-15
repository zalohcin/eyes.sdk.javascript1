'use strict';

const {getProcessPageAndPollScript} = require('@applitools/dom-snapshot');
const {GeneralUtils} = require('@applitools/eyes-common');

const PULL_TIMEOUT = 200; // ms
const CAPTURE_DOM_TIMEOUT_MS = 5 * 60 * 1000; // 5 min

async function capturePageDom({executeScript, startTime = Date.now()}) {
  const processPageAndPollScript = await getProcessPageAndPollScript();
  const resultAsString = await executeScript(
    `${processPageAndPollScript} return __processPageAndPoll();`,
  );

  const scriptResponse = JSON.parse(resultAsString);

  if (scriptResponse.status === 'SUCCESS') {
    return scriptResponse.value;
  } else if (scriptResponse.status === 'ERROR') {
    throw new Error(`Unable to process: ${scriptResponse.error}`);
  } else if (Date.now() - startTime >= CAPTURE_DOM_TIMEOUT_MS) {
    throw new Error('Timeout is reached.');
  }

  await GeneralUtils.sleep(PULL_TIMEOUT);
  return capturePageDom({executeScript, startTime});
}

module.exports = capturePageDom;
