const path = require('path')
const {copyInternalPackagesToBuildFolder} = require('..')
const packageDir = path.join(process.cwd())
const packageJson = require(path.join(packageDir, 'package.json'))
const buildFolder = path.join(packageDir, 'dist')

module.exports = copyInternalPackagesToBuildFolder.bind(undefined, {
  dependencies: packageJson.dependencies,
  buildFolder,
})
