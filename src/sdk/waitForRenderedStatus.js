'use strict';
const {RenderStatus} = require('@applitools/eyes-sdk-core');
const {presult} = require('@applitools/functional-commons');

const psetTimeout = t =>
  new Promise(res => {
    setTimeout(res, t);
  });

const failMsg = 'failed to render screenshot';

/*******************************
 *    This is THE STATUSER!    *
 *******************************/

function makeWaitForRenderedStatus({
  timeout = 120000,
  getStatusInterval = 500,
  logger,
  doGetRenderStatus,
}) {
  let counter = 0;
  let isRunning;
  const pendingRenders = {};
  return async function waitForRenderedStatus(renderId, stopCondition = () => {}) {
    return new Promise((resolve, reject) => {
      logger.log(`[waitForRenderedStatus] adding job for ${renderId} isRunning=${isRunning}`);
      if (!pendingRenders[renderId]) {
        pendingRenders[renderId] = {resolve, reject, startTime: Date.now()};
      }
      if (!isRunning) {
        isRunning = true;
        getRenderStatusJob();
      }
    });

    async function getRenderStatusJob() {
      counter++;
      const renderIds = Object.keys(pendingRenders);
      log(`render status job (${renderIds.length}): ${renderIds}`);
      if (renderIds.length === 0 || stopCondition()) {
        isRunning = false;
        return;
      }

      const [err, renderStatuses] = await presult(doGetRenderStatus(renderIds));

      if (err) {
        log(`error during getRenderStatus: ${err}`);
        await psetTimeout(getStatusInterval);
        return getRenderStatusJob();
      }

      const now = Date.now();
      renderStatuses.forEach((rs, i) => {
        const status = rs.getStatus();
        const renderId = renderIds[i];
        const pendingRender = pendingRenders[renderId];
        if (status === RenderStatus.ERROR) {
          delete pendingRenders[renderId];
          log(`render error received for ${renderId}: ${rs.getError()}`);
          pendingRender.reject(new Error(failMsg));
        } else if (status === RenderStatus.RENDERED) {
          delete pendingRenders[renderId];
          log(`got "rendered" status for ${renderId}`);
          pendingRender.resolve(rs.toJSON());
        } else if (now - pendingRender.startTime > timeout) {
          delete pendingRenders[renderId];
          log(`timeout reached for ${renderId}`);
          pendingRender.reject(new Error(failMsg));
        }
      });

      log(`awaiting getStatusInterval=${getStatusInterval}`);
      await psetTimeout(getStatusInterval);
      log('awaited');
      return getRenderStatusJob();

      function log(msg) {
        logger.log(`[waitForRenderedStatus] [${counter}] ${msg}`);
      }
    }
  };
}

module.exports = makeWaitForRenderedStatus;
module.exports.failMsg = failMsg;
