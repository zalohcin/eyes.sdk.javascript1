'use strict';
const makeTestController = require('./makeTestController');

function makeGlobalState({logger}) {
  let queuedRendersCount = 0;
  const queuedRendersConditions = [];

  return {
    makeTestController,
    getQueuedRendersCount,
    setQueuedRendersCount,
    waitForQueuedRenders,
  };

  function getQueuedRendersCount() {
    return queuedRendersCount;
  }

  function setQueuedRendersCount(value) {
    logger.log('setting queued renders count to', value);
    queuedRendersCount = value;
    const condition = queuedRendersConditions[0];
    condition && condition();
  }

  async function waitForQueuedRenders(desiredCount) {
    if (desiredCount <= queuedRendersCount) {
      return new Promise(resolve => {
        queuedRendersConditions.push(newCount => {
          if (desiredCount > newCount) {
            queuedRendersConditions.pop();
            resolve();
          }
        });
      });
    }
  }
}

module.exports = makeGlobalState;
