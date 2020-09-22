const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const {isMatch} = require('micromatch')
const {exec} = require('child_process')
const {promisify} = require('util')
const {shWithOutput} = require('@applitools/sdk-shared/src/process-commons')
const pexec = promisify(exec)
const cwd = process.cwd()

function _isAlreadyChecked({pkgName, dep, results}) {
  return results.find(result => result.pkgName === pkgName && result.dep === dep)
}

function getWorkspacePackage({pkgs, pkgName}) {
  return pkgs.find(({name}) => name === pkgName)
}

function makePackagesList() {
  const packages = fs.readdirSync(path.join(cwd, '..'))
  return packages.map(pkgPath => {
    const pkgDir = path.join(cwd, '..', pkgPath)
    const packageJson = require(path.join(pkgDir, 'package.json'))
    return {
      name: packageJson.name,
      path: pkgDir,
    }
  })
}

function verifyDependencies({pkgs, pkgPath, results}) {
  const packageJsonPath = path.resolve(pkgPath, 'package.json')
  const packageJson = require(packageJsonPath)
  const pkgName = packageJson.name
  const {dependencies} = packageJson

  for (const dep in dependencies) {
    if (!_isAlreadyChecked({pkgName, dep, results}) && getWorkspacePackage({pkgs, pkgName: dep})) {
      const depVersion = dependencies[dep]
      const pkg = pkgs.find(({name}) => name === dep)
      const depPackageJsonPath = path.join(pkg.path, 'package.json')
      const depPackageJson = require(depPackageJsonPath)
      const sourceVersion = depPackageJson.version
      results.push({pkgName, dep, depVersion, sourceVersion, error: true})
      verifyDependencies({pkgs, pkgPath: pkg.path, results})
    }
  }
}

async function getNpmDependencies({pkgs, pkgPath}) {
  return Promise.all(
    getAllDependencies({pkgs, pkgPath})
      .map(dep => getWorkspacePackage({pkgs, pkgName: dep}))
      .filter(x => x)
      .map(async ({name, path: pkgPath}) => {
        const [npmVersion] = await shWithOutput(`npm view ${name} version`)
        const sourceVersion = JSON.parse(fs.readFileSync(path.resolve(pkgPath, 'package.json')))
          .version
        return {pkgName: name, pkgPath, npmVersion, sourceVersion}
      }),
  )
}

function getAllDependencies({pkgs, pkgPath}) {
  debugger
  const results = new Set()
  const packageJsonPath = path.resolve(pkgPath, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath))
  for (const dep in packageJson.dependencies) {
    results.add(dep)
    const pkg = getWorkspacePackage({pkgs, pkgName: dep})
    if (pkg) {
      const depDeps = getAllDependencies({pkgs, pkgPath: pkg.path})
      for (const depDep of depDeps) {
        results.add(depDep)
      }
    }
  }
  return [...results]
}

function checkPackagesForUniqueVersions(input, packageNames, {isNpmLs} = {isNpmLs: true}) {
  if (isNpmLs) {
    let errors = []
    packageNames.forEach(packageName => {
      const versions = _findVersionNumbersForPackage(input, packageName)
      if (versions.size > 1) errors.push({name: packageName, versions})
    })
    if (errors.length) {
      const affectedPackages = errors.map(error => error.name).join(', ')
      throw new Error(
        `Non-unique package versions found of ${affectedPackages} \n\nTo learn more, run \`npx bongo ls-dry-run\`.`,
      )
    }
  } else {
    let found = {}
    packageNames.forEach(packageName => {
      found[packageName] = findPackageInPackageLock({packageLock: input, packageName})
    })
    let affectedPackages = []
    for (const packageName in found) {
      const versions = found[packageName].map(entry => Object.values(entry)[0])
      const hasUniqueVersion = new Set(versions).size === 1
      if (!hasUniqueVersion) {
        found[packageName].forEach(versionEntry => {
          for (const [key, value] of Object.entries(versionEntry)) {
            console.log(chalk.cyan(`${key} \n -> ${value}\n`))
          }
        })
        affectedPackages.push(packageName)
      }
    }
    if (affectedPackages.length)
      throw new Error(`Non-unique package versions found of ${affectedPackages.join(', ')}.`)
  }
}

function _findVersionNumbersForPackage(input, pkgName) {
  let versionNumbers = []
  const packageEntries = findEntryByPackageName(input, pkgName)
  packageEntries.forEach(entry => {
    const versionNumber = entry.match(/(\d+\.)?(\d+\.)?(\*|\d+)/)[0]
    versionNumbers.push(versionNumber)
  })
  return new Set(versionNumbers)
}

function findEntryByPackageName(input, target) {
  if (typeof input === 'string') input = input.split('\n')
  return input.filter(entry => {
    const result = entry.match(/(@?\w+\/?\w+\-?\w+)@/)
    const _entry = result ? result[1] : ''
    return isMatch(_entry, target)
  })
}

async function checkPackageCommits(pkgPath) {
  const packageJson = require(path.resolve(pkgPath, 'package.json'))
  const {name, version} = packageJson
  const tagName = `${name}@${version}`
  const exclusions = `":(exclude,icase)../*/changelog.md" ":!../*/test/*"`
  try {
    return (await pexec(`git log --oneline ${tagName}..HEAD -- ${pkgPath} ${exclusions}`)).stdout
  } catch (ex) {
    if (/bad revision/.test(ex.message)) {
      const tagNameCyan = chalk.cyan(tagName)
      const versionCyan = chalk.cyan(version)
      console.log(
        chalk.yellow(
          `Warning [${name}]: unable to detect unreleased commits because tag ${tagNameCyan} is missing from git.
Please make sure there are no additional commits to this package since the release of version ${versionCyan}!`,
        ),
      )
    } else {
      throw ex
    }
  }
}

async function npmLs() {
  try {
    const {stdout} = await pexec(`npm ls`)
    return stdout
  } catch (error) {
    return error.stdout
  }
}

function findPackageInPackageLock({packageLock, packageName}) {
  const dependencies = packageLock.dependencies
  let found = []
  for (const depName in dependencies) {
    const {requires, version} = dependencies[depName]
    if (requires && requires[packageName]) {
      const result = {}
      result[`${depName}@${version}`] = `${packageName}@${requires[packageName]}`
      found.push(result)
    }
  }
  return found
}

module.exports = {
  makePackagesList,
  getNpmDependencies,
  verifyDependencies,
  checkPackagesForUniqueVersions,
  findEntryByPackageName,
  checkPackageCommits,
  npmLs,
  findPackageInPackageLock,
}
