const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

async function gitAdd(target) {
  await pexec(`git add ${target}`)
}

async function gitCommit(message = 'Committed with sdk-release-kit') {
  await pexec(`git commit -m "${message}"`)
}

async function gitPullWithRebase() {
  await pexec(`git pull --rebase`)
}

async function gitPushWithTags() {
  await pexec(`git push --follow-tags`)
}

module.exports = {
  gitAdd,
  gitCommit,
  gitPullWithRebase,
  gitPushWithTags,
}
