'use strict'

const {
  GeneralUtils: {pexec},
} = require('@applitools/eyes-common')

const getScmInfo = (function() {
  let mergeBaseTime
  return async function getScmInfo(parentBranchName, _opts) {
    if (!mergeBaseTime) {
      const {stdout} = await pexec(
        `HASH=$(git merge-base HEAD ${parentBranchName}) && git show -q --format=%cI $HASH`,
        _opts,
      )
      mergeBaseTime = stdout && stdout.replace(/\s/g, '')
    }
    return mergeBaseTime
  }
})()

module.exports = getScmInfo
