const path = require('path')
const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

async function copyInternalPackagesToBuildFolder({dependencies, buildFolder}) {
  const internalPackages = getPathsToInternalPackages(dependencies)
  for (const internalPackage in internalPackages) {
    await _copyRecurisvely(internalPackages[internalPackage], buildFolder)
  }
}

async function _copyRecurisvely(target, destination) {
  await pexec(`cp -R ${target} ${destination}`)
}

function getPathsToInternalPackages(deps) {
  return Object.entries(deps)
    .filter(dep => dep[1].includes('portal:'))
    .map(dep => dep[1])
    .map(dep => dep.replace(/portal\:/, ''))
}

function getPathsToInternalPackagesRecursively(deps) {
  let results = []
  results.push(...getPathsToInternalPackages(deps))
  results.forEach(result => {
    const {dependencies} = require(path.resolve(result, 'package.json'))
    results.push(...getPathsToInternalPackagesRecursively(dependencies, results))
  })
  return new Set(results)
}

module.exports = {
  copyInternalPackagesToBuildFolder,
  getPathsToInternalPackages,
}
