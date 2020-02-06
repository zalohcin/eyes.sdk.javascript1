'use strict'

function makeGetBatchInfo(doGetbatchInfo) {
  const batchInfoPromises = {}
  return function getBatchInfo(batchId) {
    if (!batchInfoPromises[batchId]) {
      batchInfoPromises[batchId] = doGetbatchInfo(batchId)
    }
    return batchInfoPromises[batchId]
  }
}

module.exports = makeGetBatchInfo
