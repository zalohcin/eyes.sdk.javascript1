'use strict'

const path = require('path')
const {sh} = require('../src/process-commons')
const {presult} = require('@applitools/functional-commons')

;(async function main() {
  const commands = process.argv.slice(2)
  const folders = [
    'sdk-shared',
    'sdk-fake-eyes-server',
    'sdk-release-kit',
    'sdk-coverage-tests',
    'snippets',
    'eyes-sdk-core',
    'visual-grid-client',
    'eyes-selenium',
    'eyes-webdriverio-5',
    'eyes-webdriverio-4',
    'eyes-protractor',
    'eyes-playwright',
    'eyes-cypress',
    'eyes-storybook',
    'eyes-webdriverio-5-service',
  ]
  const errors = []
  const start = Date.now()
  for (const [index, folder] of folders.entries()) {
    console.log('[workspace]', folder, `(${index + 1} of ${folders.length})`)
    process.chdir(path.resolve(__dirname, '../..', folder))
    const [err] = await presult(
      commands.reduce((p, cmd) => p.then(() => sh(cmd)), Promise.resolve()),
    )
    if (err) errors.push({folder, err})
  }
  const total = Date.now() - start

  if (errors.length) {
    console.log(`[workspace] done with ${errors.length} errors. Total time: ${total}ms`)
    for (const [index, {folder, err}] of errors.entries()) {
      console.log(`[workspace] Error ${index + 1} ${folder}:`, err)
    }
  } else {
    console.log(`[workspace] done without errors! Total time: ${total}ms`)
  }
})().catch(err => {
  console.log(err)
  process.exit(1)
})
