const path = require('path')

function _isAlreadyChecked({pkgName, dep, results}) {
  return results.find(result => result.pkgName === pkgName && result.dep === dep)
}

function _isWorkspacePackage({pkgs, pkgName}) {
  return pkgs.find(({name}) => name === pkgName)
}

function makePackagesList() {
  const packages = require(path.join(__dirname, '..', '..', '..', '..', 'package.json')).workspaces
  return packages.map(pkgPath => {
    const pkgDir = path.join(__dirname, '..', '..', '..', '..', pkgPath)
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
    if (!_isAlreadyChecked({pkgName, dep, results}) && _isWorkspacePackage({pkgs, pkgName: dep})) {
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

module.exports = {
  makePackagesList,
  verifyDependencies,
}
