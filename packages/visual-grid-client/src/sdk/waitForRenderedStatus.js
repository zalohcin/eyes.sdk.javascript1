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
      const renderIds = Object.keys(pendingRenders);
      logger.log(`[waitForRenderedStatus] render status job (${renderIds.length}): ${renderIds}`);
      if (renderIds.length === 0 || stopCondition()) {
        isRunning = false;
        return;
      }

      const [err, renderStatuses] = await presult(doGetRenderStatus(renderIds));

      if (err) {
        logger.log(`error during getRenderStatus: ${err}`);
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
          logger.log(`render error received for ${renderId}: ${status.getError()}`);
          pendingRender.reject(new Error(failMsg));
        } else if (status === RenderStatus.RENDERED) {
          delete pendingRenders[renderId];
          logger.log('render completed:', renderId);
          pendingRender.resolve(rs.toJSON());
        } else if (now - pendingRender.startTime > timeout) {
          delete pendingRenders[renderId];
          logger.log(`timeout reached for ${renderId}`);
          pendingRender.reject(new Error(failMsg));
        }
      });

      logger.log('[waitForRenderedStatus] awaiting', getStatusInterval);
      await psetTimeout(getStatusInterval);
      logger.log('[waitForRenderedStatus] awaited');
      return getRenderStatusJob();
    }
  };
}

module.exports = makeWaitForRenderedStatus;
module.exports.failMsg = failMsg;
