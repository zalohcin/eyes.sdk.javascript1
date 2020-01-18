const fs = require('fs')
const path = require('path')

function makePackagesList() {
  const dir = path.join(__dirname, '..', 'packages')
  const packages = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory())

  return packages.map(pkgName => {
    const pkgDir = path.join(dir, pkgName)
    const packageJson = require(path.join(pkgDir, 'package.json'))
    return {
      name: packageJson.name,
      path: pkgDir,
      deps: {...packageJson.dependencies, ...packageJson.devDependencies},
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
