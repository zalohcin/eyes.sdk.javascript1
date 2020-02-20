'use strict'

const {
  GeneralUtils: {pexec, cachify, presult},
} = require('@applitools/eyes-common')

async function doGetScmInfo(parentBranchName, _opts) {
  const commitTimeCmd = `HASH=$(git merge-base HEAD ${parentBranchName}) && git show -q --format=%cI $HASH`
  let [{stderr} = {}, {stdout} = {}] = await presult(pexec(commitTimeCmd, _opts))

  // missing parent branch info
  if (stderr && stderr.includes('Not a valid object name')) {
    const fetchParentCmd = `git fetch origin ${parentBranchName}:${parentBranchName}`
    ;[{stderr} = {}, {stdout} = {}] = await presult(
      pexec(`${fetchParentCmd} && ${commitTimeCmd}`, _opts),
    )
  }
  // missing current branch info
  if (!stdout) {
    const fetchBranchCmd = 'git fetch origin --unshallow'
    ;[{stderr} = {}, {stdout} = {}] = await presult(
      pexec(`${fetchBranchCmd} && ${commitTimeCmd}`, _opts),
    )
  }

  if (stdout) {
    stdout = stdout.replace(/\s/g, '')
  }
  if (!_isCorrectInfo(stdout)) {
    throw new Error(`stderr: ${stderr}, stdout: ${stdout}`)
  }

  return stdout
}

function _isCorrectInfo(stdout) {
  return stdout && stdout.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}/)
}

module.exports = cachify(doGetScmInfo, true)
