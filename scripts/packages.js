const fs = require('fs')
const path = require('path')

function _moveToFront(packages, packageName) {
  packages.unshift(
    packages
      .splice(
        packages.findIndex(pkgName => pkgName === packageName),
        1,
      )
      .toString(),
  )
  return packages
}

function makePackagesList() {
  const dir = path.join(__dirname, '..', 'packages')
  const packages = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory())
  _moveToFront(packages, 'eyes-sdk-core')
  _moveToFront(packages, 'eyes-common')
  _moveToFront(packages, 'sdk-fake-eyes-server')
  return packages.map(pkgName => {
    const pkgDir = path.join(dir, pkgName)
    const packageJson = require(path.join(pkgDir, 'package.json'))
    return {
      name: packageJson.name,
      folderName: pkgName,
      path: pkgDir,
      deps: {...packageJson.dependencies, ...packageJson.devDependencies},
      scripts: {...packageJson.scripts},
    }
  })
}

function findLocalDepsFromPackage(pkg) {
  const packages = makePackagesList()
  const deps = Object.keys(pkg.deps).filter(dep => {
    return packages.map(pkg => pkg.name).includes(dep)
  })
  return deps.map(depName => {
    return {name: depName, path: packages.find(p => p.name === depName).path}
  })
}

module.exports = {
  makePackagesList,
  findLocalDepsFromPackage,
}
