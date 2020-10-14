const fs = require('fs')
const vm = require('vm')
const fetch = require('node-fetch')
const {isUrl, isFunction, mergeObjects} = require('../common-util')

async function prepareTests(path) {
  const {tests, ...options} = await getSuite(path)
  return {
    tests: mergeTests(tests),
    ...options,
  }
}

async function getSuite(path) {
  const context = vm.createContext({process})
  console.log(path)
  const source = isUrl(path)
    ? await fetch(path).then(response => response.text())
    : fs.readFileSync(path).toString()
  vm.runInContext(source, context)
  return {tests: context.tests, pages: context.pages}
}

function mergeTests(tests) {
  return Object.entries(tests).reduce((tests, [testName, test]) => {
    if (test.variants) {
      Object.entries(test.variants).forEach(([variantName, variant]) => {
        tests[testName + variantName] = mergeObjects(normalizeTest(test), variant)
        delete tests[testName + variantName].variants
      })
    } else {
      tests[testName] = normalizeTest(test)
    }
    return tests
  }, {})
}

function normalizeTest(test) {
  return isFunction(test) ? {test} : test
}

exports.prepareTests = prepareTests
