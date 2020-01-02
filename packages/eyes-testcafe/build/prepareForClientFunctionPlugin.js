'use strict'

// This rollup plugin is meant to fix issues that testcafe's ClientFunction has
// See: https://github.com/DevExpress/testcafe/issues/3713
module.exports = name => ({
  generateBundle: (_outputOptions, bundle, _isWrite) => {
    const bundleFile = bundle[`${name}.js`]
    const prependWindow = ['Symbol', 'Array', 'Set', 'Object', 'String']
    prependWindow.forEach(token => {
      // TODO - Switch from this dump to some tokenizing method
      bundleFile.code = bundleFile.code
        .replace(new RegExp(`([ (!|]+)(${token}[ ,\.\[(])`, 'g'), '$1window.$2')
        .replace(new RegExp(`function window.${token}`, 'g'), `function ${token}`)
        .replace(new RegExp(`var window.${token}`, 'g'), `${token}`)
        .replace(new RegExp(`window.${token}:`, 'g'), `${token}:`)
        .trim()
    })
  },
})
