const path = require('path')
const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

async function copyInternalPackagesToBuildFolder({dependencies, buildFolder}) {
  const internalPackages = getPathsToInternalPackagesRecursively(dependencies)
  for (const internalPackage in internalPackages) {
    await copyRecurisvely(internalPackages[internalPackage], buildFolder)
  }
}

async function copyRecurisvely(target, destination) {
  await pexec(`cp -R ${target} ${destination}`)
}

function getPathsToInternalPackages(deps, packageDir) {
  const result = Object.entries(deps)
    .filter(dep => dep[1].includes('portal:'))
    .map(dep => dep[1])
    .map(dep => dep.replace(/portal\:/, ''))
  return packageDir ? result.map(dep => path.join(packageDir, dep)) : result
}

function getPathsToInternalPackagesRecursively(deps, packageDir) {
  let results = []
  results.push(...getPathsToInternalPackages(deps, packageDir))
  results.forEach(dep => {
    const {dependencies} = require(path.resolve(dep, 'package.json'))
    results.push(...getPathsToInternalPackagesRecursively(dependencies, dep))
  })
  return [...new Set(results)]
}

module.exports = {
  copyInternalPackagesToBuildFolder,
  getPathsToInternalPackages,
}
