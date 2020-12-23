const vm = require('vm')
const fs = require('fs')
const fetch = require('node-fetch')
const chalk = require('chalk')
const handlebars = require('handlebars')
const {useFramework} = require('../framework')
const {isUrl, mergeObjects, toPascalCase} = require('../common-util')

async function loadFileTemplate(templatePath) {
  return isUrl(templatePath)
    ? await fetch(templatePath).then(response => response.text())
    : fs.readFileSync(templatePath).toString()
}

async function loadEmitter(emitterPath) {
  const source = isUrl(emitterPath)
    ? await fetch(emitterPath).then(response => response.text())
    : fs.readFileSync(emitterPath).toString()
  try {
    const module = {exports: {}}
    vm.runInContext(source, vm.createContext({module, process, console}))
    return module.exports
  } catch (err) {
    if (err.constructor.name !== 'ReferenceError') throw err
    const stack = err.stack.split('\n')
    const [columnNumber, lineNumber] = stack[5].split(':').reverse()
    console.log(
      chalk.yellow(`Error emitter loading ${emitterPath}:${columnNumber}:${lineNumber}`),
      '\n',
    )
    const [line, caret] = stack.slice(1, 3)
    console.log(chalk.cyan(line))
    console.log(chalk.yellow(caret))
    throw new ReferenceError(err.message)
  }
}

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

async function prepareFileTemplate({template, testFrameworkTemplate}) {
  if (testFrameworkTemplate) return testFrameworkTemplate
  const string = await loadFileTemplate(template)
  handlebars.registerHelper('tags', (context, options) => {
    if (!context || context.length <= 0) return ''
    return ` (${context.map(options.fn).join(' ')})`
  })
  return handlebars.compile(string, {noEscape: true})
}

async function prepareEmitter({emitter, initializeSdk}) {
  if (initializeSdk) return initializeSdk
  return loadEmitter(emitter)
}

async function prepareTests({
  tests: testsPath,
  overrideTests = {},
  ignoreSkip,
  ignoreSkipEmit,
  emitSkipped,
  emitOnly = [],
}) {
  const {tests, testsConfig} = await loadTests(testsPath)
  const normalizedTests = Object.entries(tests).reduce((tests, [testName, {variants, ...test}]) => {
    test.group = testName
    test.key = test.key || toPascalCase(testName)
    test.name = testName
    if (variants) {
      Object.entries(variants).forEach(([variantName, variant]) => {
        variant.key = variant.key || test.key + toPascalCase(variantName)
        variant.name = variantName ? test.name + ' ' + variantName : test.name
        const testVariant = mergeObjects(test, variant, overrideTests[variant.name])
        tests.push(normalizeTest(testVariant))
      })
    } else {
      tests.push(normalizeTest(mergeObjects(test, overrideTests[test.name])))
    }
    return tests
  }, [])

  return filterTests(normalizedTests, {emitOnly, emitSkipped, ignoreSkipEmit})

  function normalizeTest(test) {
    test.config = test.config || {}
    test.skip = test.skip && !ignoreSkip
    test.skipEmit = test.skipEmit && !ignoreSkipEmit
    test.page = test.page && testsConfig.pages[test.page]
    return test
  }

  function filterTests(tests, {emitOnly, emitSkipped, ignoreSkipEmit}) {
    if (emitOnly.length > 0) {
      return tests.filter(test => {
        return emitOnly.some(pattern => {
          if (pattern.startsWith('/') && pattern.endsWith('/')) {
            const regexp = new RegExp(pattern.slice(1, -1), 'i')
            return regexp.test(test.name)
          }
          return test.name === pattern
        })
      })
    } else {
      return tests.filter(test => {
        return (ignoreSkipEmit || !test.skipEmit) && (emitSkipped || !test.skip)
      })
    }
  }
}

module.exports = {prepareFileTemplate, prepareEmitter, prepareTests}
