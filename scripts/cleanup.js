'use strict'

const fs = require('fs')
const path = require('path')
const {packages} = require(path.join(__dirname, '../package.json')).workspaces

for (const pkg of packages) {
  const pkgName = pkg.replace('packages/', '')
  try {
    const applitoolsDeps = fs.readdirSync(path.resolve(pkg, 'node_modules/@applitools'))
    for (const dep of applitoolsDeps) {
      if (packages.includes(`packages/${dep}`)) {
        console.log('pkg', pkgName, dep)
        fs.rmdirSync(path.resolve(pkg, 'node_modules/@applitools', dep))
      }
    }
  } catch (ex) {
    if (ex.code === 'ENOENT') {
      // console.log(`${pkgName}: no @applitools folder in node_modules`)
    }
  }
}
