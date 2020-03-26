'use strict'

const path = require('path')
const fs = require('fs')
const {makePackagesList, verifyDependencies} = require('..')
const pkgs = makePackagesList()
const results = []

module.exports = ({isFix, pkgPath}) => {
  verifyDependencies({pkgs, pkgPath, results})

  const errors = results.filter(({depVersion, sourceVersion}) => depVersion !== sourceVersion)

  if (errors.length) {
    if (isFix) {
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
}
