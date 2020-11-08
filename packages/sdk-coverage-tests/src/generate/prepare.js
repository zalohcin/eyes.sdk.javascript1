const vm = require('vm')
const fs = require('fs')
const fetch = require('node-fetch')
const chalk = require('chalk')
const {useFramework} = require('../framework')
const {isUrl, mergeObjects, toPascalCase} = require('../common-util')

async function loadTests(testsPath) {
  const source = isUrl(testsPath)
    ? await fetch(testsPath).then(response => response.text())
    : fs.readFileSync(testsPath).toString()

  const {context, api} = useFramework()
  try {
    vm.runInContext(source, vm.createContext({...api, process}))
    return context
  } catch (err) {
    if (err.constructor.name !== 'ReferenceError') throw err
    const stack = err.stack.split('\n')
    const [columnNumber, lineNumber] = stack[5].split(':').reverse()
    console.log(
      chalk.yellow(`Error during tests loading ${testsPath}:${columnNumber}:${lineNumber}`),
      '\n',
    )
    const [line, caret] = stack.slice(1, 3)
    console.log(chalk.cyan(line))
    console.log(chalk.yellow(caret))
    throw new ReferenceError(err.message)
  }
}

async function prepareTests({
  testsPath,
  overrideTests = {},
  ignoreSkip,
  emitSkipped,
  emitOnly = [],
}) {
  const {tests, testsConfig} = await loadTests(testsPath)
  const normalizedTests = Object.entries(tests).reduce((tests, [testName, {variants, ...test}]) => {
    test.key = test.key || toPascalCase(testName)
    test.name = testName
    if (variants) {
      Object.entries(variants).forEach(([variantName, variant]) => {
        variant.key = variant.key || test.key + toPascalCase(variantName)
        variant.name = test.name + ' ' + variantName
        const testVariant = mergeObjects(test, variant, overrideTests[variant.name])
        tests.push(normalizeTest(testVariant))
      })
    } else {
      tests.push(normalizeTest(mergeObjects(test, overrideTests[test.name])))
    }
    return tests
  }, [])

  let filteredTests = normalizedTests
  if (!emitSkipped) filteredTests = filteredTests.filter(test => !test.skip)
  if (emitOnly.length > 0)
    filteredTests = filteredTests.filter(test => {
      return emitOnly.some(pattern => {
        if (pattern.startsWith('/') && pattern.endsWith('/')) {
          const regexp = new RegExp(pattern.slice(1, -1), 'i')
          return regexp.test(test.name)
        }
        return test === pattern
      })
    })

  return filteredTests

  function normalizeTest(test) {
    test.config = test.config || {}
    test.skip = test.skip && !ignoreSkip
    test.page = test.page && testsConfig.pages[test.page]
    return test
  }
}

module.exports = {prepareTests}
