const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

async function pushWithTags() {
  await pexec(`git push --folow-tags`)
}

async function addFile(file) {
  await pexec(`git add ${file}`)
}

module.exports = {
  addFile,
  pushWithTags,
}
