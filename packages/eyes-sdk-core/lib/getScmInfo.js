'use strict'

const {
  GeneralUtils: {pexec},
} = require('@applitools/eyes-common')

const getScmInfo = (function() {
  const cache = {}
  return async function getScmInfo(batchKey, parentBranchName, _opts) {
    if (!cache[batchKey]) {
      const {stdout} = await pexec(
        `HASH=$(git merge-base HEAD ${parentBranchName}) && git show -q --format=%cI $HASH`,
        _opts,
      )
      cache[batchKey] = stdout && stdout.replace(/\s/g, '')
    }
    return cache[batchKey]
  }
})()

module.exports = getScmInfo
