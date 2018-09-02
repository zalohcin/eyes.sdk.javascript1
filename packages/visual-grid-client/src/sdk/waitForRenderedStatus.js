'use strict';
const {RenderStatus} = require('@applitools/eyes.sdk.core');

const psetTimeout = t =>
  new Promise(res => {
    setTimeout(res, t);
  });

function makeWaitForRenderedStatus({timeout = 120000, getStatusInterval = 500, logger}) {
  return async function waitForRenderedStatus(renderIds, wrapper, stopCondition = () => {}) {
    async function getStatus() {
      if (timeoutReached) {
        logger.verbose(`waitForRenderedStatus: timeout reached for ${renderIds}`);
        throw new Error(`failed to render screenshot`);
      }

      try {
        const renderStatuses = await wrapper.getRenderStatus(renderIds);
        const error = renderStatuses.find(
          rs => (rs.getStatus() === RenderStatus.ERROR ? rs.getError() : null),
        );
        if (error) {
          throw error;
        }

        const statuses = renderStatuses.map(rs => rs.getStatus());
        if (stillRendering(statuses) && !stopCondition()) {
          await psetTimeout(getStatusInterval);
          return await getStatus();
        }

        clearTimeout(timeoutId);
        return renderStatuses.map(rs => rs.toJSON());
      } catch (ex) {
        if (timeoutReached) {
          throw ex;
        }
        logger.log(`error during getRenderStatus: ${ex}`);
        await psetTimeout(getStatusInterval);
        return await getStatus();
      }
    }

    let timeoutReached = false;
    const timeoutId = setTimeout(() => (timeoutReached = true), timeout);
    return await getStatus();
  };
}

function stillRendering(statuses) {
  return statuses.some(status => !status || status === RenderStatus.RENDERING);
}

module.exports = makeWaitForRenderedStatus;
