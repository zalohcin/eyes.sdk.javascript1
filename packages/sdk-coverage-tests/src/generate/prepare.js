const vm = require('vm')
const fs = require('fs')
const fetch = require('node-fetch')
const {useFramework} = require('../framework')
const {isUrl} = require('../common-util')

async function prepareTests(config) {
  const source = isUrl(config.testsPath)
    ? await fetch(config.testsPath).then(response => response.text())
    : fs.readFileSync(config.testsPath).toString()

  const {context, api} = useFramework()

  vm.runInContext(source, vm.createContext({...api, process}))

  return context
}

module.exports = {prepareTests}
