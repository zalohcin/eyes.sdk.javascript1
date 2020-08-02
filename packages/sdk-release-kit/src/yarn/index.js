const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

async function yarnInstall() {
  await pexec(`yarn install`)
}

async function yarnUpgrade() {
  await pexec(`yarn upgrade --exact --latest --pattern "@applitools/"`)
}

module.exports = {
  yarnInstall,
  yarnUpgrade,
}
