const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

let errors = []

function checkPackagesForUniqueVersions(input, packageNames) {
  packageNames.forEach(packageName => {
    hasUniqueVersionForPackage(input, packageName)
  })
  if (errors.length) {
    const affectedPackages = errors.map(error => error.name).join(', ')
    throw new Error(`Non-unique package versions found of ${affectedPackages}`)
  }
}

function findVersionNumbersForPackage(input, pkgName) {
  let versionNumbers = []
  const packageEntries = grep(input, pkgName)
  packageEntries.forEach(entry => {
    const versionNumber = entry.match(/(\d+\.)?(\d+\.)?(\*|\d+)/)[0]
    versionNumbers.push(versionNumber)
  })
  return new Set(versionNumbers)
}

function grep(input, target) {
  if (typeof input === 'string') input = input.split('\n')
  return input.filter(entry => entry.includes(target))
}

function hasUniqueVersionForPackage(input, pkgName) {
  const versions = findVersionNumbersForPackage(input, pkgName)
  if (versions.size > 1) errors.push({name: pkgName, versions})
}

async function npmLs() {
  try {
    const {stdout} = await pexec(`npm ls`)
    return stdout
  } catch (error) {
    return error.stdout
  }
}

async function main(packageNames = ['@applitools/eyes-sdk-core', '@applitools/eyes-common']) {
  checkPackagesForUniqueVersions(await npmLs(), packageNames)
}

module.exports = main
