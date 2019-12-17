'use strict'

function unserializeDomSnapshotResult(domSnapshotResult) {
  const ret = {
    ...domSnapshotResult,
    resourceContents: blobDataToResourceContents(domSnapshotResult.blobs),
    frames: domSnapshotResult.frames.map(unserializeDomSnapshotResult),
  }
  delete ret.blobs
  return ret
}

function blobDataToResourceContents(blobs) {
  return blobs.reduce((acc, {url, type, value}) => {
    acc[url] = {url, type, value: Buffer.from(value, 'base64')}
    return acc
  }, {})
}

module.exports = unserializeDomSnapshotResult
