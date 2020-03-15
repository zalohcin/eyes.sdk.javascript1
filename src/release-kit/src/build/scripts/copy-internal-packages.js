const path = require('path')
const {copyInternalPackagesToBuildFolder} = require('..')
const packageDir = path.join(process.cwd())
const packageJson = require(path.join(packageDir, 'package.json'))
const buildFolder = path.join(packageDir, 'dist')

module.exports = () => {
  // TODO
  // clean package/dist
  // mirror package into package/dist (e.g., cp -R package into package/dist)
  // cd into package/dist and work from here
  copyInternalPackagesToBuildFolder({
    dependencies: packageJson.dependencies,
    buildFolder,
  })
  // update package/dist/package.json to use package/dist/dist (!) folder contents
  // pack
  // mkdir tmpdir
  // install pack into tmpdir
  // check installed package for sanity
  // rm -rf tmpdir
}
