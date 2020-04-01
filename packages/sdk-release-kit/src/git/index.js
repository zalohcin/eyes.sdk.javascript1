const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

async function gitPullWithRebase() {
  await pexec(`git pull --rebase`)
}

async function gitPushWithTags() {
  await pexec(`git push --follow-tags`)
}

async function gitAddFile(file) {
  await pexec(`git add ${file}`)
}

module.exports = {
  gitAddFile,
  gitPullWithRebase,
  gitPushWithTags,
}
