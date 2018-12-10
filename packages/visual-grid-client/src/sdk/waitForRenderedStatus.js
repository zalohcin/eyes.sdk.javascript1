'use strict';
const {RenderStatus} = require('@applitools/eyes-sdk-core');
const {presult} = require('@applitools/functional-commons');

const psetTimeout = t =>
  new Promise(res => {
    setTimeout(res, t);
  });

const failMsg = 'failed to render screenshot';

function makeWaitForRenderedStatus({timeout = 120000, logger, getRenderStatus}) {
  return async function waitForRenderedStatus(renderId, stopCondition = () => {}) {
    return new Promise(async (resolve, reject) => {
      log(`waiting for ${renderId} to be rendered`);
      const startTime = Date.now();
      getRenderStatusJob();

      async function getRenderStatusJob() {
        if (stopCondition()) {
          return reject(new Error(`aborted render ${renderId}`));
        }

        if (Date.now() - startTime > timeout) {
          return reject(new Error(failMsg));
        }

        const [err, rs] = await presult(getRenderStatus(renderId));

        if (err) {
          log(`error during getRenderStatus for ${renderId}: ${err}`);
          return getRenderStatusJob();
        }

        log(`render status result for ${renderId}: ${rs}`);

        const status = rs.getStatus();
        if (status === RenderStatus.ERROR) {
          return reject(new Error(failMsg));
        } else if (status === RenderStatus.RENDERED) {
          return resolve(rs.toJSON());
        }

        await psetTimeout(0);
        return getRenderStatusJob();
      }
    });

    function log(msg) {
      logger.log(`[waitForRenderedStatus] ${msg}`);
    }
  };
}

module.exports = makeWaitForRenderedStatus;
module.exports.failMsg = failMsg;
