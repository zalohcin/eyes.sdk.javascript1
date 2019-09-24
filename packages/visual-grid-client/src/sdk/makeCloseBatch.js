'use strict';

function makeCloseBatch(batches) {
  return async () => {
    const doneIds = new Set();
    const promises = [];
    for (const batch of batches) {
      if (!batch.id || doneIds.has(batch.id)) continue;
      doneIds.add(batch.id);
      const p = batch.deleteBatchSessions(batch.id);
      promises.push(p);
    }
    await Promise.all(promises);
  };
}

module.exports = makeCloseBatch;
