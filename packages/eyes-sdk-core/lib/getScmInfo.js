'use strict'

const {
  GeneralUtils: {pexec, cachify, presult},
} = require('@applitools/eyes-common')

async function doGetScmInfo(parentBranchName, _opts) {
  const commitTimeCmd = `HASH=$(git merge-base HEAD ${parentBranchName}) && git show -q --format=%cI $HASH`
  let [{stderr} = {}, {stdout} = {}] = await presult(pexec(commitTimeCmd, _opts))

  // missing branch info
  if (stderr && stderr.includes('Not a valid object name')) {
    const fetchParentCmd = `git fetch origin ${parentBranchName}:${parentBranchName}`
    ;[{stderr} = {}, {stdout} = {}] = await presult(
      pexec(`${fetchParentCmd} && ${commitTimeCmd}`, _opts),
    )
  }
  if (stderr) {
    throw stderr
  }

  return stdout.replace(/\s/g, '')
}

module.exports = cachify(doGetScmInfo, true)
