const fs = require('fs')
const vm = require('vm')
const fetch = require('node-fetch')
const {isUrl, mergeObjects} = require('../common-util')

async function prepareTests(path, overrides) {
  const {tests, ...options} = await getSuite(path)
  return {
    tests: flatTests(mergeObjects(tests, overrides)),
    ...options,
  }
}

async function getSuite(path) {
  const context = vm.createContext({process})
  const source = isUrl(path)
    ? await fetch(path).then(response => response.text())
    : fs.readFileSync(path).toString()
  vm.runInContext(source, context)
  return {tests: context.tests, pages: context.pages}
}

function flatTests(tests) {
  return Object.entries(tests).reduce((tests, [testName, {variants, ...test}]) => {
    test.name = testName
    test.config = test.config || {}
    if (variants) {
      Object.entries(variants).forEach(([variantName, overrides]) => {
        const testVariant = mergeObjects(test, overrides)
        if (variantName) testVariant.name += `__${variantName}`
        tests.push(testVariant)
      })
    } else {
      tests.push(test)
    }
    return tests
  }, [])
}

exports.prepareTests = prepareTests
