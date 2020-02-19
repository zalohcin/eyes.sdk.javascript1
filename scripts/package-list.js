'use strict'
const path = require('path')

function makePackagesList() {
  const packages = require(path.join(__dirname, '..', 'package.json')).workspaces
  return packages.map(pkgPath => {
    const pkgDir = path.join(__dirname, '..', pkgPath)
    const packageJson = require(path.join(pkgDir, 'package.json'))
    return {
      name: packageJson.name,
      path: pkgDir,
    }
  })
}

module.exports = makePackagesList
