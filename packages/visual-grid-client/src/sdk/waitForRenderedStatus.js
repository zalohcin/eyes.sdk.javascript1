'use strict';
const {RenderStatus} = require('@applitools/eyes-sdk-core');

const psetTimeout = t =>
  new Promise(res => {
    setTimeout(res, t);
  });

const failMsg = 'failed to render screenshot';

function makeWaitForRenderedStatus({timeout = 120000, getStatusInterval = 500, logger}) {
  return async function waitForRenderedStatus(renderIds, wrapper, stopCondition = () => {}) {
    async function getStatus() {
      if (timeoutReached) {
        logger.log(`waitForRenderedStatus: timeout reached for ${renderIds}`);
        throw new Error(failMsg);
      }

      let renderStatuses;
      try {
        renderStatuses = await wrapper.getRenderStatus(renderIds);
      } catch (ex) {
        logger.log(`error during getRenderStatus: ${ex}`);
        await psetTimeout(getStatusInterval);
        return getStatus();
      }
      const errorStatus = renderStatuses.find(
        rs => (rs.getStatus() === RenderStatus.ERROR ? rs.getError() : null),
      );
      if (errorStatus) {
        logger.log(`render error received: ${errorStatus.getError()}`);
        clearTimeout(timeoutId);
        throw new Error(failMsg);
      }

      const statuses = renderStatuses.map(rs => rs.getStatus());
      if (stillRendering(statuses) && !stopCondition()) {
        await psetTimeout(getStatusInterval);
        return getStatus();
      }

      clearTimeout(timeoutId);
      return renderStatuses.map(rs => rs.toJSON());
    }

    let timeoutReached = false;
    const timeoutId = setTimeout(() => (timeoutReached = true), timeout);
    return getStatus();
  };
}

function stillRendering(statuses) {
  return statuses.some(status => !status || status === RenderStatus.RENDERING);
}

module.exports = makeWaitForRenderedStatus;
module.exports.failMsg = failMsg;
