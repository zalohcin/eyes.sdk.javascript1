'use strict'

const args = require('yargs').argv
const path = require('path')
const fs = require('fs')
const makePackagesList = require('./package-list')
const pkgs = makePackagesList()
const results = []
const rootFolder = args.folder || process.cwd()

verifyDependencies(rootFolder)

const errors = results.filter(({depVersion, sourceVersion}) => depVersion !== sourceVersion)

if (errors.length) {
  if (args.fix) {
    for (const error of errors) {
      const pkg = pkgs.find(({name}) => name === error.pkgName)
      const packageJsonPath = path.resolve(pkg.path, 'package.json')
      const packageJson = require(packageJsonPath)
      packageJson.dependencies[error.dep] = error.sourceVersion
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    }
  } else {
    console.log(
      errors
        .map(({pkgName, dep, depVersion, sourceVersion}) => {
          return `[${pkgName}] [MISMATCH] ${dep}: version ${depVersion} is required, but source has version ${sourceVersion}`
        })
        .join('\n'),
    )
    process.exit(1)
  }
}

function verifyDependencies(pkgPath) {
  const packageJsonPath = path.resolve(pkgPath, 'package.json')
  const packageJson = require(packageJsonPath)
  const pkgName = packageJson.name
  const {dependencies} = packageJson

  for (const dep in dependencies) {
    if (!isAlreadyChecked({pkgName, dep}) && isWorkspacePackage(dep)) {
      const depVersion = dependencies[dep]
      const pkg = pkgs.find(({name}) => name === dep)
      const depPackageJsonPath = path.join(pkg.path, 'package.json')
      const depPackageJson = require(depPackageJsonPath)
      const sourceVersion = depPackageJson.version
      results.push({pkgName, dep, depVersion, sourceVersion, error: true})
      verifyDependencies(pkg.path)
    }
  }
}

function isWorkspacePackage(pkgName) {
  return pkgs.find(({name}) => name === pkgName)
}

function isAlreadyChecked({pkgName, dep}) {
  return results.find(result => result.pkgName === pkgName && result.dep === dep)
}
