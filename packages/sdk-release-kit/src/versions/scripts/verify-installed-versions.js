const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)
const {checkPackagesForUniqueVersions} = require('..')

async function npmLs() {
  try {
    const {stdout} = await pexec(`npm ls`)
    return stdout
  } catch (error) {
    return error.stdout
  }
}

async function main(packageNames) {
  checkPackagesForUniqueVersions(await npmLs(), packageNames)
}

module.exports = main
