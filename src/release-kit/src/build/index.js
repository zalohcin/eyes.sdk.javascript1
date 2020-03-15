const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

async function copyInternalPackagesToBuildFolder({dependencies, buildFolder}) {
  const internalPackages = getPathsToInternalPackages(dependencies)
  for (const internalPackage in internalPackages) {
    await copyRecurisvely(internalPackages[internalPackage], buildFolder)
  }
}

async function copyRecurisvely(target, destination) {
  await pexec(`cp -R ${target} ${destination}`)
}

function getPathsToInternalPackages(deps = {}) {
  return Object.entries(deps)
    .filter(dep => dep[1].includes('file:'))
    .map(dep => dep[1])
    .map(dep => dep.replace(/file\:/, ''))
}

module.exports = {
  copyInternalPackagesToBuildFolder,
  getPathsToInternalPackages,
}
