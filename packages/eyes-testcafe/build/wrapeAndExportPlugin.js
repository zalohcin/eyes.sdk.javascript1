'use strict'

// This rollup plugin is meant to take the functions defined in processPageAndSerialize
// wrape them in a single function and export it.
module.exports = name => ({
  generateBundle: (_outputOptions, bundle, _isWrite) => {
    const bundleFile = bundle[`${name}.js`]
    bundleFile.code = `
module.exports = function ${name} () {
  ${bundleFile.code}
  return ${name}()
}`
  },
})
